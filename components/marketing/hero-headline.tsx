"use client";

import { useEffect, useState } from "react";
import { marketingHeroEndings, marketingHomeHeadline, marketingHomeHeadlineLines } from "@/lib/copy";

export function HeroHeadline() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (paused || preference.matches || document.hidden) return;
      timer = setInterval(() => setActive(index => (index + 1) % marketingHeroEndings.length), 4000);
    };
    sync();
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      clearInterval(timer);
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [paused]);

  return (
    <div className="hero-headline">
      {/* A stable accessible name avoids repeatedly announcing the animation. */}
      <h1 aria-label={marketingHomeHeadline}>
        {marketingHomeHeadlineLines[0]}{" "}
        <span className="hero-endings" aria-hidden="true">
          {marketingHeroEndings.map((ending, index) => (
            <span className="hero-ending" data-active={active === index} key={ending}>{ending}</span>
          ))}
        </span>
      </h1>
      <button
        className="hero-playback"
        type="button"
        aria-label={paused ? "Play headline animation" : "Pause headline animation"}
        onClick={() => setPaused(value => !value)}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
          {paused ? <path d="M3 1.5 10 6l-7 4.5z" /> : <path d="M2 2h3v8H2zm5 0h3v8H7z" />}
        </svg>
      </button>
    </div>
  );
}
