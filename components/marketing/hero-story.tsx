"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const HeroStoryContext = createContext<{ active: number; selected: boolean; select: (index: number) => void }>({ active: 0, selected: false, select: () => {} });
export const useHeroStory = () => useContext(HeroStoryContext);

export function HeroStory({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (selected || preference.matches || document.hidden) return;
      timer = setInterval(() => setActive(index => (index + 1) % 3), 6000);
    };
    sync();
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      clearInterval(timer);
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [selected]);
  return <HeroStoryContext.Provider value={{ active, selected, select: index => { setActive(index); setSelected(true); } }}>
    <div className="m-hero-heading">{children}</div>
  </HeroStoryContext.Provider>;
}
