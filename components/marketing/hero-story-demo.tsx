"use client";

import { ArrowCounterClockwise, Check, FileText, GitBranch, ShieldCheck } from "@phosphor-icons/react";
import { useHeroStory } from "./hero-story";

const chapters = ["Ship more", "Keep context", "Raise quality"];
const features = ["Billing empty states", "Checkout recovery", "Rate limit API"];

export function HeroStoryDemo() {
  const { active, select, replay } = useHeroStory();
  return <div className="m-demo hero-visual hero-story-demo" id="product" data-chapter={active}>

    <div className="feature-stage" aria-hidden="true">
      <div className="feature-orbit" />
      <div className="feature-world">
        {features.map((feature, index) => <div className={`feature-cluster feature-cluster-${index}`} key={feature}>
          <div className="feature-slab feature-slab-base"><FileText size={18} /></div>
          <div className="feature-slab feature-slab-middle"><GitBranch size={18} /></div>
          <div className="feature-slab feature-slab-top"><div className="feature-card-top"><i /></div><strong>{feature}</strong><div className="feature-card-lines"><i /><i /><i /></div><div className="feature-card-bottom"><Check size={14} /></div></div>
        </div>)}
        <div className="feature-scan"><ShieldCheck size={26} /></div>
      </div>

    </div>
    <div className="story-chapters" role="group" aria-label="Explore Bento benefits">
      {chapters.map((label, index) => <button type="button" key={label} aria-pressed={active === index} onClick={() => select(index)}>{label}</button>)}
    </div>
    <div className="sr-only">
      {[
        "Independent feature blocks move in parallel.",
        "A feature separates into requirement, decision, and implementation layers.",
        "A review plane checks each layer before the feature ships.",
      ].map((description, index) => <div className="story-scene" key={description} data-active={active === index} hidden={active !== index} aria-label={chapters[index]}>{description}</div>)}
    </div>
    <div className="story-footer"><span>Interactive example</span><button type="button" aria-label="Replay story" title="Replay story" onClick={replay}><ArrowCounterClockwise size={15} /></button></div>
  </div>;
}
