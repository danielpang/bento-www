"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { ArrowRight, Check, Code, GitBranch, GitPullRequest, Stack } from "@phosphor-icons/react";
import { CtaLink } from "@/components/cta-link";
import { siteConfig } from "@/lib/site";

const scenes = [
  {
    title: "Build ambiguous features.", lines: ["Build ambiguous", "features."], core: "The brief",
    labels: ["Explore", "Design", "Plan", "Build", "Test", "Review"],
    positions: [[-235, -120], [0, -190], [235, -120], [-235, 120], [0, 190], [235, 120]],
    origin: [0, 0], edges: [[-1, 0], [-1, 1], [-1, 2], [-1, 3], [-1, 4], [-1, 5]],
    description: "A brief branches into exploration, design, planning, implementation, testing, and review.",
  },
  {
    title: "One-shot the migration.", lines: ["One-shot the", "migration."], core: "Migration",
    labels: ["Schema", "Inventory", "API", "Workers", "Verify", "Backfill"],
    positions: [[-100, -105], [-100, 105], [90, -105], [90, 105], [280, -105], [280, 105]],
    origin: [-280, 0], edges: [[-1, 0], [-1, 1], [0, 2], [1, 3], [2, 4], [3, 5]],
    description: "Agents coordinate a migration across schema, inventory, API, workers, verification, and backfill in two connected lanes.",
  },
  {
    title: "Ship the whole initiative.", lines: ["Ship the whole", "initiative."], core: "One PR",
    labels: ["Web", "API", "Data", "Tests", "Docs", "Review"],
    positions: [[-235, -140], [-235, 0], [-235, 140], [5, -140], [5, 0], [5, 140]],
    origin: [260, 0], edges: [[0, 3], [1, 4], [2, 5], [3, -1], [4, -1], [5, -1]],
    description: "Parallel agents handle web, API, data, tests, documentation, and review, then converge on a single pull request.",
  },
] as const;

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
  const [selected, setSelected] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (selected || preference.matches || document.hidden) return;
      timer = setInterval(() => setActive(index => (index + 1) % scenes.length), 7200);
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
  const scene = scenes[active];
  return <div className="swarm-experience" data-scene={active}>
    <div className="swarm-heading">
      <div className="swarm-eyebrow"><span /> BENTO SWARMS</div>
      <h1 aria-label={scene.title}>
        {scenes.map((item, index) => <span className="swarm-title" data-active={active === index} key={item.title} aria-hidden="true"><span>{item.lines[0]}</span><span>{item.lines[1]}</span></span>)}
      </h1>
      <p>One goal. A swarm of agents.</p>
    </div>
    <div className="swarm-stage" role="img" aria-label={scene.description}>
      <div className="swarm-halo" aria-hidden="true" />
      <div className="swarm-grid" aria-hidden="true" />
      <div className="swarm-world" aria-hidden="true">
        <svg className="swarm-connections" viewBox="-430 -300 860 600" fill="none">
          {scenes.map((item, index) => <g className="swarm-edges" data-active={active === index} key={item.title}>
            {item.edges.map(([from, to], edge) => {
              const path = connection(from === -1 ? item.origin : item.positions[from], to === -1 ? item.origin : item.positions[to], from === -1, to === -1);
              return <g key={edge}><path className="swarm-edge-track" d={path} /><path className="swarm-edge-signal" d={path} pathLength="100" style={{ "--order": edge } as CSSProperties} /></g>;
            })}
          </g>)}
        </svg>
        <div className="swarm-core" style={{ "--x": `${scene.origin[0]}px`, "--y": `${scene.origin[1]}px` } as CSSProperties}>
          <div className="swarm-core-floor" />
          <div className="swarm-core-face"><div className="swarm-core-mark">{active === 2 ? <GitPullRequest size={29} /> : <Stack size={29} />}</div><strong>{scene.core}</strong><div className="swarm-core-bars"><i /><i /><i /></div></div>
        </div>
        {scene.labels.map((label, index) => <div className="swarm-agent" key={index} style={{ "--x": `${scene.positions[index][0]}px`, "--y": `${scene.positions[index][1]}px`, "--order": index } as CSSProperties}>
          <div className="swarm-agent-shadow" />
          <div className="swarm-agent-face"><div className="swarm-agent-top"><Code size={16} /><span>0{index + 1}</span></div><strong>{label}</strong><div className="swarm-agent-activity"><i /><i /><i /><i /><i /></div><Check className="swarm-agent-check" size={14} /></div>
        </div>)}
      </div>
    </div>
    <div className="swarm-controls" role="group" aria-label="Explore swarm scenarios">
      {scenes.map((item, index) => <button type="button" aria-label={item.title} title={item.title} aria-pressed={active === index} key={item.title} onClick={() => { setActive(index); setSelected(true); }}><span /></button>)}
    </div>
    <div className="swarm-actions"><CtaLink href={siteConfig.signupUrl}>Start building <ArrowRight size={15} aria-hidden="true" /></CtaLink><Link href="/docs"><GitBranch size={14} aria-hidden="true" /> Explore Bento</Link></div>
  </div>;
}
