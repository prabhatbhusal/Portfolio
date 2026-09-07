"use client";

import { Moon, Sun } from "lucide-react";

// icons are swapped with the dark: variant instead of state, so there is
// nothing to hydrate and no flash on first paint
const ThemeToggle = ({ className = "" }: { className?: string }) => {
  function toggle() {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";

    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;

    try {
      localStorage.setItem("theme", next);
    } catch {
      // private mode, nothing to do
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle colour theme"
      className={className}
    >
      <Sun size={18} strokeWidth={2} className="hidden dark:block" />
      <Moon size={18} strokeWidth={2} className="block dark:hidden" />
    </button>
  );
};

export default ThemeToggle;
