/**
 * Minimal D1Database backed by node:sqlite, so services can be tested
 * against real SQL without a Worker. Covers what the services use.
 */
import { readFileSync, readdirSync } from "node:fs";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { join } from "node:path";

class Statement {
  private values: SQLInputValue[] = [];

  constructor(
    private db: DatabaseSync,
    private sql: string,
  ) {}

  bind(...values: SQLInputValue[]) {
    this.values = values;
    return this;
  }

  async first<T>(): Promise<T | null> {
    return (this.db.prepare(this.sql).get(...this.values) as T) ?? null;
  }

  async all<T>() {
    const results = this.db.prepare(this.sql).all(...this.values) as T[];
    return { results, success: true, meta: {} };
  }

  async run() {
    const { changes } = this.db.prepare(this.sql).run(...this.values);
    return { success: true, results: [], meta: { changes: Number(changes) } };
  }
}

export function createTestDb(): D1Database {
  const db = new DatabaseSync(":memory:");
  const dir = join(process.cwd(), "migrations");
  for (const file of readdirSync(dir)
    .filter((f) => /^\d+_.*\.sql$/.test(f))
    .sort()) {
    db.exec(readFileSync(join(dir, file), "utf8"));
  }

  return {
    prepare: (sql: string) => new Statement(db, sql),
    batch: (statements: Statement[]) =>
      Promise.all(statements.map((s) => s.all())),
  } as unknown as D1Database;
}
