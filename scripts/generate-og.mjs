// builds public/og.png, the social card every page points at.
// generated rather than hand-drawn so the wording stays in one place, and
// written as a real .png because a static host needs the extension to send
// the right content type — an extensionless route file would not be previewed.
import { writeFile } from "node:fs/promises";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";

const NAME = "Prabhat Bhusal";
const ROLE = "Full-stack Developer & Geomatics Engineer";
const DOMAIN = "prabhatbhusal.com.np";
const STACK = ["React", "Next.js", "Django", "PostGIS", "LiDAR"];

const row = (children, style) =>
  h("div", { style: { display: "flex", ...style } }, ...children);

const card = h(
  "div",
  {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      background: "#0a0a0a",
      padding: "72px 80px",
      fontFamily: "sans-serif",
    },
  },
  row(
    [
      h("div", {
        style: { width: 14, height: 14, borderRadius: 999, background: "#ef9f27" },
      }),
      h(
        "div",
        { style: { fontSize: 24, letterSpacing: 6, color: "#8f8d86" } },
        DOMAIN,
      ),
    ],
    { alignItems: "center", gap: 16 },
  ),
  row(
    [
      h(
        "div",
        { style: { fontSize: 88, fontWeight: 800, letterSpacing: -2, color: "#f2f0eb" } },
        NAME,
      ),
      h("div", { style: { fontSize: 40, color: "#ef9f27" } }, ROLE),
    ],
    { flexDirection: "column", gap: 24 },
  ),
  row(
    [h("div", { style: { fontSize: 26, color: "#8f8d86" } }, STACK.join("  ·  "))],
    {},
  ),
);

const image = new ImageResponse(card, { width: 1200, height: 630 });
const buffer = Buffer.from(await image.arrayBuffer());

await writeFile("public/og.png", buffer);
console.log(`wrote public/og.png (${buffer.length} bytes)`);
