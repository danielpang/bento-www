"use client";

import { useHeroStory } from "./hero-story";
import { marketingHeroEndings, marketingHomeHeadline, marketingHomeHeadlineLines } from "@/lib/copy";

export function HeroHeadline() {
  const { active } = useHeroStory();

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
