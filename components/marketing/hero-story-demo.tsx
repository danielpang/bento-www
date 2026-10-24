"use client";

import { Check, FileText, GitBranch, LockKey, ShieldCheck } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useHeroStory } from "./hero-story";

const chapters = ["Ship more", "Keep context", "Secure agents"];
const features = ["Billing empty states", "Checkout recovery", "Rate limit API"];

export function HeroStoryDemo() {
  const { active, selected, select } = useHeroStory();
  const reducedMotion = useReducedMotion();
  return <div className="m-demo hero-visual hero-story-demo" id="product" data-chapter={active}>

    <div className="feature-stage">
      <div className="feature-orbit" aria-hidden="true" />
      <AnimatePresence initial={false}>
      <motion.div
        className="feature-scene"
        aria-hidden="true"
        key={active}
        data-chapter={active}
        initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: reducedMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
      <div className="feature-world">
        {active === 0 && <div className="feature-pipeline">
          <svg className="pipeline-connectors" viewBox="-260 -100 520 200" fill="none" aria-hidden="true">
            <path d="M-102 0 H-78 M-84 -4 L-78 0 L-84 4 M78 0 H102 M96 -4 L102 0 L96 4" />
          </svg>
          {["Plan", "Build", "PR"].map((stage, index) => <div className={`pipeline-stop pipeline-stop-${index}`} key={stage}><span>{stage}</span></div>)}
        </div>}
        {features.map((feature, index) => (active === 2 || index === 1) && <div className={`feature-cluster feature-cluster-${index}`} key={feature}>
          {active !== 1 && <div className="feature-slab feature-slab-base"><FileText size={18} /></div>}
          {active !== 1 && <div className="feature-slab feature-slab-middle"><GitBranch size={18} /></div>}
          <div className="feature-slab feature-slab-top"><div className="feature-card-top"><i /><LockKey className="feature-lock" size={17} weight="fill" /></div><strong>{feature}</strong><div className="feature-card-lines"><i /><i /><i /></div><div className="feature-card-bottom"><Check size={14} /></div></div>
          {active === 2 && <div className="feature-scan"><ShieldCheck size={26} /></div>}
        </div>)}
        {active === 1 && <div className="feature-artifacts">
          <svg className="artifact-connectors" viewBox="-250 -200 500 400" fill="none" aria-hidden="true">
            <path d="M-24 -38 C5 -38 0 -105 36 -105 M30 -109 L36 -105 L30 -101" />
            <path d="M-24 0 H53 M47 -4 L53 0 L47 4" />
            <path d="M-24 38 C15 38 20 105 70 105 M64 101 L70 105 L64 109" />
          </svg>
          {["plan.md", "decisions.md", "review.md"].map((file, index) => <div className={`feature-artifact feature-artifact-${index}`} key={file}><FileText size={22} /><strong>{file}</strong><div className="feature-card-lines"><i /><i /></div></div>)}
        </div>}
      </div>
      </motion.div>
      </AnimatePresence>
      <div className="story-dots" role="group" aria-label="Explore Bento benefits" data-playing={!selected}>
        {chapters.map((label, index) => <button type="button" key={label} aria-label={label} title={label} aria-pressed={active === index} onClick={() => select(index)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle className="story-dot-track" cx="12" cy="12" r="8" /><circle className="story-dot-progress" cx="12" cy="12" r="8" /><circle className="story-dot-center" cx="12" cy="12" r="2.5" /></svg>
        </button>)}
      </div>
    </div>
    <div className="sr-only">
      {[
        "A feature block moves left to right through planning, implementation, and a pull request.",
        "One feature card produces a plan, decisions, and review artifacts.",
        "Orange security planes descend over all three feature cards, locking each agent workspace.",
      ].map((description, index) => <div className="story-scene" key={description} data-active={active === index} hidden={active !== index} aria-label={chapters[index]}>{description}</div>)}
    </div>
  </div>;
}
