"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light"));
    return () => cancelAnimationFrame(frame);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try { localStorage.setItem("atlas-theme", next); } catch { /* The switch still works for this visit. */ }
  }

  return <button type="button" className="theme-toggle" onClick={toggle} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} title={theme === "dark" ? "Light mode" : "Dark mode"}>
    {theme === "dark" ? <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.3A8.7 8.7 0 0 1 8.7 3.8 8.7 8.7 0 1 0 20.2 15.3Z"/></svg>}
    <span>{theme === "dark" ? "Light" : "Dark"}</span>
  </button>;
}
