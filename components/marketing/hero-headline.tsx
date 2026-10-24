"use client";

import { useEffect, useState } from "react";
import { marketingHeroEndings, marketingHomeHeadline, marketingHomeHeadlineLines } from "@/lib/copy";

export function HeroHeadline() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (preference.matches || document.hidden) return;
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
  }, []);

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
    </div>
  );
}
