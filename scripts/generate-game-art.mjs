// placeholder art for the games pages: one cover and one screenshot per title.
// generated rather than shipped as binaries nobody can regenerate — replace
// these files with real captures and delete the call for that game.
import { mkdir, writeFile } from "node:fs/promises";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";

const SIZE = { width: 1600, height: 900 };

const games = [
  {
    slug: "ridge-runner",
    title: "Ridge Runner",
    tagline: "Traversal on real terrain",
    engine: "Unity",
    ink: "#f2f0eb",
    accent: "#ef9f27",
    from: "#101418",
    to: "#26170a",
    readout: { label: "ELEVATION", value: "2,418 m" },
  },
  {
    slug: "signal-depth",
    title: "Signal Depth",
    tagline: "One instrument, one flooded station",
    engine: "Unreal Engine",
    ink: "#eaf1f2",
    accent: "#5dcaa5",
    from: "#07100f",
    to: "#0d2a2a",
    readout: { label: "DEPTH", value: "-18.4 m" },
  },
];

const chip = (text, { accent, ink }) =>
  h(
    "div",
    {
      style: {
        display: "flex",
        border: `2px solid ${accent}55`,
        borderRadius: 999,
        padding: "10px 22px",
        fontSize: 24,
        letterSpacing: 2,
        color: ink,
      },
    },
    text,
  );

/* peaks: squares turned 45 degrees and cropped by the band they sit in,
   because satori has no path drawing */
const ridge = (game, peaks) =>
  h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 360,
        overflow: "hidden",
      },
    },
    ...peaks.map((peak, i) =>
      h("div", {
        key: i,
        style: {
          width: peak.size,
          height: peak.size,
          marginLeft: i === 0 ? 0 : -peak.size * 0.35,
          marginBottom: -peak.size * 0.62 + peak.lift,
          transform: "rotate(45deg)",
          borderRadius: 18,
          background: `linear-gradient(135deg, ${game.accent}22 0%, ${game.from} 70%)`,
          border: `3px solid ${game.accent}55`,
        },
      }),
    ),
  );

const cover = (game) =>
  h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        padding: 80,
        fontFamily: "sans-serif",
        background: `linear-gradient(135deg, ${game.from} 0%, ${game.to} 100%)`,
      },
    },
    ridge(game, [
      { size: 380, lift: 0 },
      { size: 520, lift: 40 },
      { size: 300, lift: -20 },
      { size: 460, lift: 20 },
      { size: 340, lift: -10 },
    ]),
    h(
      "div",
      { style: { display: "flex", gap: 16, position: "relative" } },
      chip(game.engine, game),
      chip("PC", game),
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            fontSize: 18,
            letterSpacing: 3,
            color: `${game.ink}55`,
          },
        },
        "PLACEHOLDER ART",
      ),
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 18,
          position: "relative",
        },
      },
      h(
        "div",
        {
          style: {
            fontSize: 112,
            fontWeight: 800,
            letterSpacing: -3,
            color: game.ink,
          },
        },
        game.title,
      ),
      h(
        "div",
        { style: { fontSize: 38, color: game.accent } },
        game.tagline,
      ),
    ),
  );

/* the screenshot stands in for gameplay: a framed viewport with the kind of
   readout the game would draw over it */
const shot = (game) =>
  h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        padding: 56,
        fontFamily: "sans-serif",
        background: `linear-gradient(180deg, ${game.to} 0%, ${game.from} 70%)`,
      },
    },
    ridge(game, [
      { size: 460, lift: 30 },
      { size: 320, lift: -10 },
      { size: 540, lift: 60 },
      { size: 360, lift: 0 },
    ]),
    h(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          fontSize: 26,
          color: `${game.ink}cc`,
        },
      },
      h("div", { style: { display: "flex" } }, game.title),
      h("div", { style: { display: "flex", color: game.accent } }, "REC  ●"),
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          alignSelf: "center",
          width: 220,
          height: 220,
          borderRadius: 999,
          border: `4px solid ${game.accent}77`,
          position: "relative",
        },
      },
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          position: "relative",
          fontSize: 30,
          color: game.ink,
        },
      },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: 10 } },
        h(
          "div",
          { style: { fontSize: 20, letterSpacing: 3, color: `${game.ink}77` } },
          game.readout.label,
        ),
        h(
          "div",
          { style: { display: "flex", color: game.accent } },
          game.readout.value,
        ),
      ),
      h(
        "div",
        { style: { fontSize: 20, letterSpacing: 3, color: `${game.ink}66` } },
        "PLACEHOLDER ART",
      ),
    ),
  );

await mkdir("public/games", { recursive: true });

for (const game of games) {
  for (const [suffix, node] of [
    ["cover", cover(game)],
    ["shot", shot(game)],
  ]) {
    const file = `public/games/${game.slug}-${suffix}.png`;
    const buffer = Buffer.from(
      await new ImageResponse(node, SIZE).arrayBuffer(),
    );
    await writeFile(file, buffer);
    console.log(`wrote ${file} (${buffer.length} bytes)`);
  }
}
