import * as cloudflare from "@pulumi/cloudflare";
import * as command from "@pulumi/command";
import * as pulumi from "@pulumi/pulumi";
import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";

const config = new pulumi.Config();
const accountId = config.require("accountId");
const zoneId = config.require("zoneId");

const environment = config.require("environment");
const isProd = environment === "production";

const secrets = {
  github: {
    id: config.requireSecret("github-id"),
    secret: config.requireSecret("github-secret"),
  },
  google: {
    id: config.requireSecret("google-id"),
    secret: config.requireSecret("google-secret"),
  },
  // signs session cookies: `pulumi config set --secret session-secret "$(openssl rand -base64 32)"`
  session: config.requireSecret("session-secret"),
};

// Fixed compatibility date - update intentionally when adopting new Workers runtime features
const COMPATIBILITY_DATE = "2026-02-03";

const absolutePath = (relativePath: string) =>
  new URL(relativePath, import.meta.url).pathname;

/**
 * Discover all .mjs module files from the Astro build output.
 * Astro 6.0 generates code-split chunks that need to be uploaded as separate modules.
 */
function discoverWorkerModules(serverDir: string): Array<{
  name: string;
  contentFile: string;
  contentType: string;
}> {
  const modules: Array<{
    name: string;
    contentFile: string;
    contentType: string;
  }> = [];

  // The entry point is special - it's renamed to index.js
  const entryPath = path.join(serverDir, "entry.mjs");
  if (fs.existsSync(entryPath)) {
    modules.push({
      name: "index.js",
      contentFile: entryPath,
      contentType: "application/javascript+module",
    });
  }

  // Discover other .mjs files in the server root (excluding entry.mjs)
  if (fs.existsSync(serverDir)) {
    const rootFiles = fs.readdirSync(serverDir);
    for (const file of rootFiles) {
      if (file.endsWith(".mjs") && file !== "entry.mjs") {
        modules.push({
          name: file,
          contentFile: path.join(serverDir, file),
          contentType: "application/javascript+module",
        });
      }
    }
  }

  // Discover all .mjs files in the chunks directory
  const chunksDir = path.join(serverDir, "chunks");
  if (fs.existsSync(chunksDir)) {
    const chunkFiles = fs.readdirSync(chunksDir);
    for (const file of chunkFiles) {
      if (file.endsWith(".mjs")) {
        modules.push({
          name: `chunks/${file}`,
          contentFile: path.join(chunksDir, file),
          contentType: "application/javascript+module",
        });
      }
    }
  }

  return modules;
}

const worker = new cloudflare.Worker(`tremtec-${environment}`, {
  accountId,
  name: `tremtec-${environment}`,

  subdomain: {
    enabled: true,
  },

  tags: ["tremtec", environment],

  observability: {
    enabled: false,
    headSamplingRate: 1,
    logs: {
      enabled: true,
      headSamplingRate: 1,
      invocationLogs: true,
    },
  },
});

const database = new cloudflare.D1Database(`tremtec-db-${environment}`, {
  accountId,
  name: `tremtec-${environment}`,
});

// wrangler applies migrations through a config that points at this stack's database
const migrationsDir = absolutePath("../migrations");
const migrationFiles = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();
const migrationsHash = crypto
  .createHash("sha256")
  .update(
    migrationFiles
      .map((file) => fs.readFileSync(path.join(migrationsDir, file)))
      .join("\n"),
  )
  .digest("hex");

const wranglerConfig = pulumi
  .all([database.id, database.name])
  .apply(([id, name]) => {
    const file = absolutePath(`../.wrangler.${environment}.json`);
    fs.writeFileSync(
      file,
      JSON.stringify({
        d1_databases: [
          {
            binding: "DB",
            database_name: name,
            database_id: id,
            migrations_dir: migrationsDir,
          },
        ],
      }),
    );
    return file;
  });

const migrationsCommand = pulumi.interpolate`bun run wrangler d1 migrations apply DB --remote --config ${wranglerConfig}`;
const runMigrations = new command.local.Command(
  `tremtec-migrations-${environment}`,
  {
    dir: absolutePath(".."),
    create: migrationsCommand,
    update: migrationsCommand,
    environment: { CLOUDFLARE_ACCOUNT_ID: accountId },
    // re-run when a migration is added or changed
    triggers: [migrationsHash],
  },
  { dependsOn: [database] },
);

const domain = isProd ? "tremtec.com" : "dev.tremtec.com";
const baseUrl = pulumi.interpolate`https://${domain}`;

const workerVersion = new cloudflare.WorkerVersion(
  `tremtec-worker-version-${environment}`,
  {
    accountId,
    workerId: worker.id,
    mainModule: "index.js",
    compatibilityDate: COMPATIBILITY_DATE,
    compatibilityFlags: ["global_fetch_strictly_public", "nodejs_compat"],

    assets: {
      directory: absolutePath("../dist/client/"),
      config: {
        runWorkerFirst: false,
      },
    },

    bindings: [
      {
        type: "assets",
        name: "ASSETS",
      },

      // env vars
      {
        name: "BASE_URL",
        type: "plain_text",
        text: baseUrl,
      },
      {
        name: "GITHUB_ID",
        type: "secret_text",
        secretName: "github-id",
        text: secrets.github.id,
      },
      {
        name: "GITHUB_SECRET",
        type: "secret_text",
        secretName: "github-secret",
        text: secrets.github.secret,
      },
      {
        name: "GOOGLE_ID",
        type: "secret_text",
        secretName: "google-id",
        text: secrets.google.id,
      },
      {
        name: "GOOGLE_SECRET",
        type: "secret_text",
        secretName: "google-secret",
        text: secrets.google.secret,
      },
      {
        name: "SESSION_SECRET",
        type: "secret_text",
        secretName: "session-secret",
        text: secrets.session,
      },
      {
        type: "d1",
        name: "DB",
        id: database.id,
      },
      {
        type: "send_email",
        name: "EMAIL",
        destinationAddress: "hello@tremtec.com",
      },
    ],

    modules: discoverWorkerModules(absolutePath("../dist/server")),
  },
  // the database and its schema must exist before the new version goes live
  { dependsOn: [worker, database, runMigrations] },
);

const workerDeployment = new cloudflare.WorkersDeployment(
  `tremtec-worker-deployment`,
  {
    accountId,
    versions: [
      {
        versionId: workerVersion.id,
        percentage: 100,
      },
    ],
    scriptName: worker.name,
    strategy: "percentage",
  },
  { dependsOn: [workerVersion] },
);

const customDomain = new cloudflare.WorkersCustomDomain(
  "tremtec-custom-domain",
  {
    zoneId,
    accountId,
    service: worker.name,
    hostname: domain,
  },
  { dependsOn: [workerDeployment] },
);

if (isProd) {
  // INFO: In production, add www redirect to apex domain
  const wwwCustomDomain = new cloudflare.WorkersCustomDomain(
    "tremtec-www-custom-domain",
    {
      zoneId,
      accountId,
      service: worker.name,
      hostname: `www.${domain}`,
    },
    { dependsOn: [workerDeployment] },
  );

  new cloudflare.Ruleset(
    "tremtec-www-to-apex",
    {
      zoneId,
      name: "Redirect www to primary",
      description: "Redirects all www traffic to the apex domain",
      kind: "zone",
      phase: "http_request_dynamic_redirect",
      rules: [
        {
          action: "redirect",
          actionParameters: {
            fromValue: {
              statusCode: 301,
              targetUrl: {
                expression: `concat("https://${domain}", http.request.uri.path)`,
              },
              preserveQueryString: true,
            },
          },
          expression: `(http.host eq "www.${domain}")`,
          enabled: true,
        },
      ],
    },
    { dependsOn: [customDomain, wwwCustomDomain] },
  );
}

export const databaseName = database.name;
export const migrations = runMigrations.stdout;
export const appDomain = baseUrl;
export const workerScriptName = workerDeployment.scriptName;
