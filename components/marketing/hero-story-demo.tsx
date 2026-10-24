"use client";

import { ArrowCounterClockwise, Check, FileText, GitBranch, LockKey, ShieldCheck } from "@phosphor-icons/react";
import { useHeroStory } from "./hero-story";

const chapters = ["Ship more", "Keep context", "Secure agents"];
const features = ["Billing empty states", "Checkout recovery", "Rate limit API"];

export function HeroStoryDemo() {
  const { active, select, replay } = useHeroStory();
  return <div className="m-demo hero-visual hero-story-demo" id="product" data-chapter={active}>

    <div className="feature-stage" aria-hidden="true">
      <div className="feature-orbit" />
      <div className="feature-world">
        <div className="feature-pipeline">
          {["Plan", "Build", "PR"].map((stage, index) => <div className={`pipeline-stop pipeline-stop-${index}`} key={stage}><span>{stage}</span></div>)}
        </div>
        {features.map((feature, index) => <div className={`feature-cluster feature-cluster-${index}`} key={feature}>
          <div className="feature-slab feature-slab-base"><FileText size={18} /></div>
          <div className="feature-slab feature-slab-middle"><GitBranch size={18} /></div>
          <div className="feature-slab feature-slab-top"><div className="feature-card-top"><i /><LockKey className="feature-lock" size={17} weight="fill" /></div><strong>{feature}</strong><div className="feature-card-lines"><i /><i /><i /></div><div className="feature-card-bottom"><Check size={14} /></div></div>
          <div className="feature-scan"><ShieldCheck size={26} /></div>
        </div>)}
        <div className="feature-artifacts">
          {["plan.md", "decisions.md", "review.md"].map((file, index) => <div className={`feature-artifact feature-artifact-${index}`} key={file}><FileText size={22} /><strong>{file}</strong><div className="feature-card-lines"><i /><i /></div></div>)}
        </div>
      </div>

    </div>
    <div className="story-chapters" role="group" aria-label="Explore Bento benefits">
      {chapters.map((label, index) => <button type="button" key={label} aria-pressed={active === index} onClick={() => select(index)}>{label}</button>)}
    </div>
    <div className="sr-only">
      {[
        "A feature block moves left to right through planning, implementation, and a pull request.",
        "One feature card produces a plan, decisions, and review artifacts.",
        "Orange security planes descend over all three feature cards, locking each agent workspace.",
      ].map((description, index) => <div className="story-scene" key={description} data-active={active === index} hidden={active !== index} aria-label={chapters[index]}>{description}</div>)}
    </div>
    <div className="story-footer"><span>Interactive example</span><button type="button" aria-label="Replay story" title="Replay story" onClick={replay}><ArrowCounterClockwise size={15} /></button></div>
  </div>;
}
