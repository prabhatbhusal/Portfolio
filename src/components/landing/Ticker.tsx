/* a tilted strip of game words running across the page. two copies of the
   list, so the loop wraps at -50% without a seam */
const words = [
  "press start",
  "walk the real place",
  "build the world",
  "ship the game",
  "respawn",
  "new level unlocked",
  "save & continue",
];

const Ticker = () => (
  <div aria-hidden="true" className="ticker my-12 md:my-20">
    <div className="ticker-track py-4 md:py-5">
      {[0, 1].map((copy) => (
        <span key={copy} className="flex shrink-0 items-center">
          {words.map((word) => (
            <span
              key={word}
              className="flex items-center gap-10 whitespace-nowrap pr-10 text-[clamp(1.3rem,3.2vw,2.5rem)] font-extrabold uppercase tracking-[-0.03em] text-ink/80"
            >
              {word}
              <span className="size-2.5 shrink-0 bg-(--hud) shadow-[0_0_10px_var(--hud)]" />
            </span>
          ))}
        </span>
      ))}
    </div>
  </div>
);

export default Ticker;
