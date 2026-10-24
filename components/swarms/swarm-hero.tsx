"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { ArrowRight, Check, Code, GitBranch, Stack } from "@phosphor-icons/react";
import { CtaLink } from "@/components/cta-link";
import { siteConfig } from "@/lib/site";

const headlines = [
  { title: "Build ambiguous features.", lines: ["Build ambiguous", "features."] },
  { title: "One-shot the migration.", lines: ["One-shot the", "migration."] },
  { title: "Ship the whole initiative.", lines: ["Ship the whole", "initiative."] },
] as const;

const workers = [[-235, -120], [0, -190], [235, -120], [-235, 120], [0, 190], [235, 120]] as const;

function connection(from: readonly number[], to: readonly number[], fromCore: boolean, toCore: boolean) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  // Stop at the edge of each square so connections never cross the cards.
  const span = Math.max(Math.abs(dx), Math.abs(dy));
  const start = (fromCore ? 75 : 58) / span;
  const end = (toCore ? 75 : 58) / span;
  const x1 = from[0] + dx * start, y1 = from[1] + dy * start;
  const x2 = to[0] - dx * end, y2 = to[1] - dy * end;
  return `M${x1} ${y1} C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`;
}

export function SwarmHero() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (preference.matches || document.hidden) return;
      timer = setInterval(() => setActive(index => (index + 1) % headlines.length), 7200);
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
  const headline = headlines[active];
  return <div className="swarm-experience">
    <div className="swarm-heading">
      <div className="swarm-eyebrow"><span /> BENTO SWARMS</div>
      <h1 aria-label={headline.title}>
        {headlines.map((item, index) => <span className="swarm-title" data-active={active === index} key={item.title} aria-hidden="true"><span>{item.lines[0]}</span><span>{item.lines[1]}</span></span>)}
      </h1>
      <p>One goal. A swarm of agents.</p>
    </div>
    <div className="swarm-stage" role="img" aria-label="A planner agent spawns six worker agents, delegating parallel tasks through connected branches.">
      <div className="swarm-halo" aria-hidden="true" />
      <div className="swarm-grid" aria-hidden="true" />
      <div className="swarm-world" aria-hidden="true">
        <svg className="swarm-connections" viewBox="-430 -300 860 600" fill="none">
          {workers.map((position, index) => {
            const path = connection([0, 0], position, true, false);
            return <g className="swarm-branch" key={index} style={{ "--order": index } as CSSProperties}>
              <path className="swarm-edge-track" d={path} pathLength="100" />
              <path className="swarm-edge-signal" d={path} pathLength="100" />
            </g>;
          })}
        </svg>
        <div className="swarm-core" style={{ "--x": "0px", "--y": "0px" } as CSSProperties}>
          <div className="swarm-core-floor" />
          <div className="swarm-core-face"><div className="swarm-core-mark"><Stack size={29} /></div><strong>Planner</strong><div className="swarm-core-bars"><i /><i /><i /></div></div>
        </div>
        {workers.map((position, index) => <div className="swarm-agent" key={index} style={{ "--x": `${position[0]}px`, "--y": `${position[1]}px`, "--order": index } as CSSProperties}>
          <div className="swarm-agent-shadow" />
          <div className="swarm-agent-face"><div className="swarm-agent-top"><Code size={16} /><span>0{index + 1}</span></div><strong>Worker</strong><div className="swarm-agent-activity"><i /><i /><i /><i /><i /></div><Check className="swarm-agent-check" size={14} /></div>
        </div>)}
      </div>
    </div>
    <div className="swarm-actions"><CtaLink href={siteConfig.signupUrl}>Start building <ArrowRight size={15} aria-hidden="true" /></CtaLink><Link href="/docs"><GitBranch size={14} aria-hidden="true" /> Explore Bento</Link></div>
  </div>;
}
