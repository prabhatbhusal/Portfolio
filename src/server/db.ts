import postgres from "postgres";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import { HttpError, onWorkers } from "./http";

/** is there a database at all? without one the site builds from content/.
 *  read per call: on cloudflare the env arrives with the request */
export const hasDb = () => Boolean(process.env.DATABASE_URL);

// prepare: false keeps it working behind transaction poolers (neon, supabase)
const options = { prepare: false, onnotice: () => {} };

/* node (railway, vercel, next dev): one pool per process, parked on
   globalThis or each dev reload would open a fresh set of connections */
const g = globalThis as typeof globalThis & { __sql?: postgres.Sql };

/* cloudflare workers: a socket cannot outlive the request that opened it,
   and a pool shared across requests fails on the second one. so each
   request gets one client of its own, keyed on its execution context */
const perRequest = new WeakMap<object, postgres.Sql>();

/** the database, for code that cannot work without one */
export const db = (): postgres.Sql => {
  const url = process.env.DATABASE_URL;
  if (!url) throw new HttpError(503, "The database is not configured (DATABASE_URL).");
  if (!onWorkers) return (g.__sql ??= postgres(url, { ...options, max: 5, idle_timeout: 20 }));

  const { ctx } = getCloudflareContext();
  let client = perRequest.get(ctx);
  if (!client) {
    client = postgres(url, { ...options, max: 1, fetch_types: false });
    perRequest.set(ctx, client);
  }
  return client;
};
