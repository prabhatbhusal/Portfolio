// run with `npm test`. covers the parts of the blog that guard what ends up
// on the page: the inline parser, link/image filtering and post validation.
import { test } from "node:test";
import assert from "node:assert/strict";

import { parseInline, safeHref, safeSrc, slugify, validatePost } from "./format.ts";

const post = (extra = {}) => ({
  slug: "hello-world",
  title: "Hello",
  excerpt: "x",
  date: "2026-10-16",
  tags: [],
  blocks: [{ type: "p", text: "hi" }],
  ...extra,
});

test("inline marks", () => {
  assert.deepEqual(parseInline("a **b** *c* `d` [e](https://x.dev) f"), [
    { kind: "text", text: "a " },
    { kind: "strong", text: "b" },
    { kind: "text", text: " " },
    { kind: "em", text: "c" },
    { kind: "text", text: " " },
    { kind: "code", text: "d" },
    { kind: "text", text: " " },
    { kind: "link", text: "e", href: "https://x.dev" },
    { kind: "text", text: " f" },
  ]);
  // a lone multiplication sign is not italics
  assert.deepEqual(parseInline("2 * 3 * 4"), [{ kind: "text", text: "2 * 3 * 4" }]);
});

test("unsafe links degrade to plain text", () => {
  assert.deepEqual(parseInline("[x](javascript:alert(1))"), [
    { kind: "text", text: "[x](javascript:alert(1))" },
  ]);
  assert.deepEqual(parseInline("[x](javascript:alert)"), [{ kind: "text", text: "x" }]);
  for (const bad of ["javascript:x", "data:text/html,x", "//evil.dev", "vbscript:x"]) {
    assert.equal(safeHref(bad), null, bad);
  }
  for (const ok of ["https://a.dev", "/blog/x", "#top", "mailto:a@b.c"]) {
    assert.equal(safeHref(ok), ok);
  }
});

test("image sources stay on-site or https", () => {
  assert.ok(safeSrc("/blog/post/abc.webp"));
  assert.ok(safeSrc("https://cdn.dev/a.png"));
  for (const bad of ["/blog/../../etc", "//evil.dev/a.png", "http://a.dev/a.png", "javascript:x", "data:image/png;base64,AA"]) {
    assert.equal(safeSrc(bad), false, bad);
  }
});

test("slugs cannot climb out of content/blog", () => {
  assert.equal(slugify("../../Hello, Wörld!"), "hello-world");
  assert.throws(() => validatePost(post({ slug: "../x" })), /slug/);
  assert.throws(() => validatePost(post({ slug: "a/b" })), /slug/);
});

test("validation cleans and rejects", () => {
  const clean = validatePost(post({ extra: "<script>", blocks: [{ type: "p", text: "hi", onclick: "x" }] }));
  assert.equal("extra" in clean, false);
  assert.deepEqual(clean.blocks, [{ type: "p", text: "hi" }]);

  assert.throws(() => validatePost(post({ date: "16/10/2026" })), /date/);
  assert.throws(() => validatePost(post({ blocks: [] })), /block/);
  assert.throws(() => validatePost(post({ blocks: [{ type: "script", text: "x" }] })), /type/);
  assert.throws(() => validatePost(post({ cover: { src: "javascript:x", alt: "" } })), /cover\.src/);
});
