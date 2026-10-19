import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import type { GalleryItem, GameItem, WorkProject } from "@/@types/common.types";
import { validatePost } from "@/lib/blog/format";

/* the site is static: everything it shows is read from content/ at build
   time. edit those files and redeploy to change it */

const read = (file: string) => JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", file), "utf8"));

const numbered = <T>(items: unknown[]) =>
  items.map((item, i) => ({ ...(item as object), id: i + 1 }) as T);

export const getPosts = cache(async () =>
  fs
    .readdirSync(path.join(process.cwd(), "content", "blog"))
    .filter((file) => file.endsWith(".json"))
    .map((file) => validatePost(read(`blog/${file}`)))
    .toSorted((a, b) => b.date.localeCompare(a.date))
);

export const getProjects = cache(async () => numbered<WorkProject>(read("projects.json")));

// 3d work lives in projects.json with the rest, and is listed under games too
export const getModels = cache(async () => (await getProjects()).filter((project) => project.stack === "3D"));

export const getGames = cache(async () => numbered<GameItem>(read("games.json")));

export const getPhotos = cache(async () => numbered<GalleryItem>(read("photos.json")));
