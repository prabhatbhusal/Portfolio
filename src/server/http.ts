import { createHash } from "node:crypto";

import { db } from "./db";

/** running on cloudflare workers (opennext), not a node server */
export const onWorkers = typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

type Handler<P> = (req: Request, ctx: { params: Promise<P> }) => Promise<Response>;

/* every api route goes through this: cross-site writes are refused, known
   errors become their status, and anything unexpected is logged and turned
   into a plain 500 so no stack trace reaches the browser */
export const route =
  <P = Record<string, string>>(handler: Handler<P>): Handler<P> =>
  async (req, ctx) => {
    try {
      if (req.method !== "GET" && !sameOrigin(req)) {
        throw new HttpError(403, "Cross-site request refused.");
      }
      return await handler(req, ctx);
    } catch (error) {
      if (error instanceof HttpError) {
        return Response.json({ error: error.message }, { status: error.status });
      }
      console.error(error);
      return Response.json({ error: "Something went wrong on our side." }, { status: 500 });
    }
  };

/* the session cookie is SameSite=Lax, and every write also has to come
   from this site's own pages. browsers always send Origin on POST/PUT/DELETE */
function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === (req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  } catch {
    return false;
  }
}

/** a json body, size-capped before it is parsed */
export async function readJson(req: Request, maxBytes = 512 * 1024): Promise<Record<string, unknown>> {
  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > maxBytes) throw new HttpError(413, "That is too large.");
  const raw = await req.text();
  if (raw.length > maxBytes) throw new HttpError(413, "That is too large.");
  try {
    const body = JSON.parse(raw);
    if (body && typeof body === "object" && !Array.isArray(body)) return body;
  } catch {
    // fall through
  }
  throw new HttpError(400, "Expected a JSON object.");
}

export const str = (body: Record<string, unknown>, key: string, max: number) => {
  const value = body[key];
  if (typeof value !== "string" || !value.trim()) throw new HttpError(400, `${key} is required.`);
  if (value.length > max) throw new HttpError(400, `${key} is too long.`);
  return value.trim();
};

export const email = (body: Record<string, unknown>) => {
  const value = str(body, "email", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new HttpError(400, "That email does not look right.");
  return value;
};

export const sha256 = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");

/* the address the host's own edge saw. cloudflare sets cf-connecting-ip on
   every request a worker gets, and passes a client's own x-real-ip through
   untouched, so there only the former counts. vercel and railway overwrite
   x-real-ip; failing that, the last x-forwarded-for hop is the one the
   nearest proxy appended. the first is whatever the client claimed, and
   trusting it let anyone mint a fresh rate-limit bucket per request. only a
   hash is ever stored */
export const clientKey = (req: Request) => {
  const ip = onWorkers
    ? req.headers.get("cf-connecting-ip")
    : (req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",").at(-1));
  return sha256(ip?.trim() || "local").slice(0, 24);
};

/** fixed-window limiter. throws 429 once `key` has been seen `max` times
 *  inside the window */
export async function limit(key: string, max: number, windowSeconds: number) {
  const [row] = await db()`
    insert into rate_limits (key, count, reset_at)
    values (${key}, 1, now() + ${windowSeconds}::int * interval '1 second')
    on conflict (key) do update set
      count = case when rate_limits.reset_at < now() then 1 else rate_limits.count + 1 end,
      reset_at = case when rate_limits.reset_at < now() then excluded.reset_at else rate_limits.reset_at end
    returning count`;
  // housekeeping rides along on about one call in fifty, so nothing needs a cron
  if (Math.random() < 0.02) {
    await db()`delete from rate_limits where reset_at < now()`;
    await db()`delete from auth_codes where expires_at < now()`;
  }
  if (row.count > max) throw new HttpError(429, "Too many attempts. Try again in a few minutes.");
}
