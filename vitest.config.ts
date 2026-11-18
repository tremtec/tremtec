import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    ui: false,
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      // Stub Cloudflare-specific modules for Node.js testing environment
      "cloudflare:email": "/src/lib/__mocks__/cloudflare-email.ts",
    },
  },
});
