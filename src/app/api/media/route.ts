import { requireOwner } from "@/server/auth";
import { db } from "@/server/db";
import { HttpError, route, sha256 } from "@/server/http";

const MAX = 4 * 1024 * 1024;

/* the type comes from the file's own first bytes, never from the client's
   Content-Type — and svg is not on the list, since an svg can carry script */
function sniff(b: Buffer) {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  if (b.toString("ascii", 0, 4) === "GIF8") return "image/gif";
  if (b.toString("ascii", 4, 8) === "ftyp" && /^avi[fs]$/.test(b.toString("ascii", 8, 12))) return "image/avif";
  return null;
}

/** the studio sends the already-shrunk image as the raw request body */
export const POST = route(async (req) => {
  await requireOwner();

  if (Number(req.headers.get("content-length") ?? 0) > MAX) throw new HttpError(413, "Images are capped at 4 MB.");
  const bytes = Buffer.from(await req.arrayBuffer());
  if (bytes.length > MAX) throw new HttpError(413, "Images are capped at 4 MB.");

  const type = sniff(bytes);
  if (!type) throw new HttpError(415, "Only jpeg, png, webp, gif and avif images.");

  // named by content: the same image uploaded twice is one row, and a url
  // can be cached forever because its bytes can never change
  const id = sha256(bytes).slice(0, 32);
  await db()`insert into media (id, type, bytes) values (${id}, ${type}, ${bytes}) on conflict (id) do nothing`;

  return Response.json({ src: `/media/${id}` });
});
