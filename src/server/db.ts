import postgres from "postgres";

import { HttpError } from "./http";

const url = process.env.DATABASE_URL;

/* one pool per process. dev reloads modules on every edit, so the pool is
   parked on globalThis or each save would open a fresh set of connections.
   prepare: false keeps it working behind transaction poolers (neon, supabase) */
const g = globalThis as typeof globalThis & { __sql?: postgres.Sql };

export const sql: postgres.Sql | null = url
  ? (g.__sql ??= postgres(url, { max: 5, prepare: false, idle_timeout: 20, onnotice: () => {} }))
  : null;

/** for code that cannot work without a database — the studio and its api */
export const db = () => {
  if (!sql) throw new HttpError(503, "The database is not configured (DATABASE_URL).");
  return sql;
};
