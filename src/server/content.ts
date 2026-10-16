import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import type { GalleryItem, GameItem, WorkProject } from "@/@types/common.types";
import { validatePost, type BlogPost } from "@/lib/blog/format";
import { KINDS, type Kind } from "@/lib/content/kinds";
import { db, hasDb } from "./db";
import { HttpError } from "./http";

/* with DATABASE_URL the site reads the database. without it — a fresh clone,
   a preview with no db attached — it reads the seed files in content/, so
   the site always builds. if a database IS configured and errors, that
   error is allowed to surface: next keeps serving the last good page
   rather than silently publishing stale file content */

const read = (file: string) => JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", file), "utf8"));

const fromFiles = (kind: Kind): unknown[] => {
  if (kind !== "post") return read(`${kind}s.json`);
  return fs
    .readdirSync(path.join(process.cwd(), "content", "blog"))
    .filter((file) => file.endsWith(".json"))
    .map((file) => validatePost(read(`blog/${file}`)));
};

const published = cache(async (kind: Kind): Promise<unknown[]> => {
  if (!hasDb()) return fromFiles(kind);
  const rows = await db()`
    select data from content where kind = ${kind} and published
    order by sort, updated_at desc`;
  return rows.map((row) => row.data);
});

const numbered = <T>(items: unknown[]) =>
  items.map((item, i) => ({ ...(item as object), id: i + 1 }) as T);

export const getPosts = cache(async () =>
  ((await published("post")) as BlogPost[]).toSorted((a, b) => b.date.localeCompare(a.date))
);

export const getProjects = cache(async () => numbered<WorkProject>(await published("project")));

export const getGames = cache(async () => numbered<GameItem>(await published("game")));

export const getPhotos = cache(async () => numbered<GalleryItem>(await published("photo")));

export const kindOf = (value: string) => {
  if (!KINDS.includes(value as Kind)) throw new HttpError(404, "Unknown collection.");
  return value as Kind;
};
