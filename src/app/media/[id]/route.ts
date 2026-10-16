import { db, hasDb } from "@/server/db";

/** serves an uploaded image. the id is a content hash, so the response can
 *  be cached forever — by browsers and by vercel's cdn (s-maxage) */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!hasDb() || !/^[a-f0-9]{32}$/.test(id)) return new Response("Not found", { status: 404 });

  const [row] = await db()`select type, bytes from media where id = ${id}`;
  if (!row) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(row.bytes as Buffer), {
    headers: {
      "Content-Type": row.type,
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      // never sniffed into anything else. the sandboxing csp for this path
      // is set in next.config.ts, which has the final say on headers
      "X-Content-Type-Options": "nosniff",
    },
  });
}
