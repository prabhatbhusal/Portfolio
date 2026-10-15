"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const ease = [0.22, 0.7, 0.25, 1] as const;

/* long enough to read as deliberate rather than as a flicker */
const MIN_MS = 550;

/* if `load` never fires — a stalled font or image — leave anyway */
const MAX_MS = 2500;

const Loader = () => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const started = performance.now();
    let settle: ReturnType<typeof setTimeout>;

    const finish = () => setDone(true);

    const onLoad = () => {
      settle = setTimeout(finish, Math.max(0, MIN_MS - (performance.now() - started)));
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    const cap = setTimeout(finish, MAX_MS);

    return () => {
      clearTimeout(settle);
      clearTimeout(cap);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  // nothing should scroll behind the overlay
  useEffect(() => {
    if (done) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          data-loader=""
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease }}
          className="fixed inset-0 z-100 grid place-items-center bg-canvas"
        >
          <div className="flex flex-col items-center gap-7">
            <span className="text-[15px] font-extrabold tracking-tighter text-ink">
              {"<"}
              <span className="text-brand">pb</span>
              {"/>"}
            </span>

            <span className="block h-px w-40 overflow-hidden bg-line">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, ease }}
                style={{ originX: 0 }}
                className="block h-full w-full bg-brand"
              />
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
