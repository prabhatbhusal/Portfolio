import React from "react";

/*
  Decorative backdrop. A triangulated irregular network is the one shape
  that means all three things I do at once: it is how terrain gets modelled
  in geomatics, how meshes get built in a game engine, and it draws as
  cleanly as a wireframe. Contours and a point scatter sit over the top.
*/

// three rows of vertices, hand-placed so the mesh has some slope to it
const rows = [
  [
    { x: 40, y: 138 },
    { x: 188, y: 96 },
    { x: 342, y: 152 },
    { x: 498, y: 92 },
    { x: 648, y: 146 },
    { x: 792, y: 104 },
  ],
  [
    { x: 24, y: 300 },
    { x: 172, y: 258 },
    { x: 318, y: 314 },
    { x: 472, y: 252 },
    { x: 622, y: 302 },
    { x: 776, y: 262 },
  ],
  [
    { x: 62, y: 468 },
    { x: 206, y: 428 },
    { x: 358, y: 482 },
    { x: 512, y: 422 },
    { x: 664, y: 472 },
    { x: 800, y: 436 },
  ],
];

// scattered returns, the way a point cloud actually looks
const cloud = [
  { x: 118, y: 196, r: 2.4 },
  { x: 262, y: 168, r: 1.6 },
  { x: 404, y: 214, r: 2.8 },
  { x: 552, y: 176, r: 1.8 },
  { x: 700, y: 208, r: 2.2 },
  { x: 96, y: 372, r: 1.8 },
  { x: 244, y: 344, r: 2.6 },
  { x: 392, y: 392, r: 1.6 },
  { x: 540, y: 340, r: 2.4 },
  { x: 690, y: 386, r: 2 },
  { x: 158, y: 262, r: 1.5 },
  { x: 468, y: 296, r: 1.5 },
  { x: 736, y: 292, r: 1.7 },
];

const HeroBackdrop = ({ className = "" }: { className?: string }) => {
  const edges: string[] = [];

  rows.forEach((row, r) => {
    row.forEach((point, i) => {
      // along the row
      if (i < row.length - 1) {
        const nextPoint = row[i + 1];
        edges.push(`M${point.x} ${point.y}L${nextPoint.x} ${nextPoint.y}`);
      }

      // down to the row below, plus the diagonal that closes each triangle
      if (r < rows.length - 1) {
        const below = rows[r + 1][i];
        edges.push(`M${point.x} ${point.y}L${below.x} ${below.y}`);

        if (i < row.length - 1) {
          const belowNext = rows[r + 1][i + 1];
          edges.push(`M${point.x} ${point.y}L${belowNext.x} ${belowNext.y}`);
        }
      }
    });
  });

  return (
    <svg
      viewBox="0 0 820 580"
      fill="none"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <defs>
        {/* fades the whole thing out at the edges so it never fights the text */}
        <radialGradient id="hb-fade" cx="50%" cy="45%" r="62%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="60%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        <mask id="hb-mask">
          <rect width="820" height="580" fill="url(#hb-fade)" />
        </mask>

        <pattern
          id="hb-grid"
          width="41"
          height="41"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M41 0H0V41"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.28"
          />
        </pattern>
      </defs>

      <g mask="url(#hb-mask)" className="text-ink-faint">
        {/* graticule */}
        <rect width="820" height="580" fill="url(#hb-grid)" />

        <g className="mesh-drift">
          {/* contours, drawn as a slow scan */}
          <g className="text-brand" stroke="currentColor" fill="none">
            <path
              d="M-20 232C120 196 214 268 332 250s196-84 320-62 176 6 208-12"
              strokeWidth="1.4"
              opacity="0.5"
              className="contour-scan"
            />
            <path
              d="M-20 302C126 268 220 340 340 320s194-82 318-60 178 8 210-10"
              strokeWidth="1.1"
              opacity="0.36"
              className="contour-scan"
              style={{ animationDelay: "-6s" }}
            />
            <path
              d="M-20 372C132 340 226 412 348 392s192-80 316-58 180 10 212-8"
              strokeWidth="0.9"
              opacity="0.24"
              className="contour-scan"
              style={{ animationDelay: "-12s" }}
            />
          </g>

          {/* the mesh itself */}
          <g stroke="currentColor" strokeWidth="0.85" opacity="0.42">
            {edges.map((d, idx) => (
              <path key={idx} d={d} />
            ))}
          </g>

          {/* vertices */}
          <g className="text-brand" fill="currentColor">
            {rows.flat().map((point, idx) => (
              <circle
                key={idx}
                cx={point.x}
                cy={point.y}
                r="2.6"
                className="vtx"
                style={{ animationDelay: `${(idx % 7) * 0.55}s` }}
              />
            ))}
          </g>

          {/* point cloud returns */}
          <g fill="currentColor" opacity="0.5">
            {cloud.map((point, idx) => (
              <circle
                key={idx}
                cx={point.x}
                cy={point.y}
                r={point.r}
                className="vtx"
                style={{ animationDelay: `${(idx % 5) * 0.8 + 0.3}s` }}
              />
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
};

export default HeroBackdrop;
