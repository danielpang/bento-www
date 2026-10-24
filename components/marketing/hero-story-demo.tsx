"use client";

import { useState } from "react";
import { ArrowRight, Check, FileText, GitBranch, ShieldCheck } from "@phosphor-icons/react";
import { useHeroStory } from "./hero-story";

const chapters = ["Ship more", "Keep context", "Raise quality"];
const features = ["Billing empty states", "Checkout recovery", "Rate limit API"];
const artifacts = [
  { label: "Requirement", file: "plan.md", text: "Recover interrupted checkouts without charging a customer twice." },
  { label: "Decision", file: "decisions.md", text: "One checkout. One idempotency key." },
  { label: "Implementation", file: "checkout.ts", text: "Carry the checkout ID into every payment request." },
];

export function HeroStoryDemo() {
  const { active, selected, select, replay } = useHeroStory();
  const [artifact, setArtifact] = useState(0);
  const [approved, setApproved] = useState(false);
  return <div className="m-demo hero-visual hero-story-demo" id="product" data-chapter={active} data-approved={approved}>
    <div className="story-topbar"><span><GitBranch size={14} /> ONE FEATURE. EVERY LAYER.</span><span>Interactive example</span></div>
    <div className="feature-stage" aria-hidden="true">
      <div className="feature-orbit" />
      <div className="feature-world">
        {features.map((feature, index) => <div className={`feature-cluster feature-cluster-${index}`} key={feature}>
          <div className="feature-slab feature-slab-base"><span>REQUIREMENT</span><FileText size={18} /></div>
          <div className="feature-slab feature-slab-middle"><span>DECISIONS</span><GitBranch size={18} /></div>
          <div className="feature-slab feature-slab-top"><div className="feature-card-top"><span>FEATURE / 0{index + 1}</span><i /></div><strong>{feature}</strong><div className="feature-card-lines"><i /><i /><i /></div><div className="feature-card-bottom"><span>{active === 2 ? approved ? "APPROVED" : "REVIEWED" : "READY TO SHIP"}</span><Check size={14} /></div></div>
        </div>)}
        <div className="feature-scan"><ShieldCheck size={26} /><span>{approved ? "APPROVED" : "QUALITY CHECK"}</span></div>
      </div>
      <div className="feature-callout feature-callout-context"><span>03 / IMPLEMENTATION</span><span>02 / DECISION</span><span>01 / REQUIREMENT</span></div>
      <div className="feature-callout feature-callout-quality"><ShieldCheck size={14} />{approved ? "Your judgment. Built in." : "Edge case caught before merge."}</div>
      <span className="feature-stage-caption">{active === 0 ? "Independent features. Moving together." : active === 1 ? "The context stays with the feature." : "Every layer earns its way through."}</span>
    </div>
    <div className="story-chapters" role="group" aria-label="Explore Bento benefits">
      {chapters.map((label, index) => <button type="button" key={label} aria-pressed={active === index} onClick={() => select(index)}><span>0{index + 1}</span>{label}</button>)}
    </div>
    <div className="story-scenes">
      <section className="story-scene" data-active={active === 0} aria-hidden={active !== 0} inert={active !== 0} aria-label="Ship more">
        <h2>Big ideas. Small, shippable pieces.</h2>
        <p>Each feature moves independently, with its own agents, context, and review. Keep more work in flight.</p>
        <div className="story-shipping"><span><i /> 3 features in motion</span><span><Check size={13} /> Context included</span></div>
      </section>
      <section className="story-scene" data-active={active === 1} aria-hidden={active !== 1} inert={active !== 1} aria-label="Keep context">
        <h2>Peel back the change.</h2>
        <div className="story-artifact-tabs" role="group" aria-label="Explore change context">{artifacts.map((item, index) => <button type="button" key={item.file} aria-pressed={artifact === index} onClick={() => { setArtifact(index); select(1); }}>{item.label}</button>)}</div>
        <div className="story-artifact"><code>{artifacts[artifact].file}</code><p>{artifacts[artifact].text}</p></div>
      </section>
      <section className="story-scene" data-active={active === 2} aria-hidden={active !== 2} inert={active !== 2} aria-label="Raise quality">
        <h2>High standards. At every layer.</h2>
        <p>Review catches a duplicate-charge risk. The agent reuses the checkout ID and adds a retry regression test.</p>
        <div className="story-approval"><span role="status">{approved ? "Approved. Ready to merge." : "Checks passed. Your call."}</span><button type="button" disabled={approved} onClick={() => { setApproved(true); select(2); }}>{approved ? <><Check size={14} /> Approved</> : <>Approve example <ArrowRight size={14} /></>}</button></div>
      </section>
    </div>
    <div className="story-footer"><span>{selected ? "Exploring at your pace" : "One connected workflow"}</span><button type="button" onClick={() => { setApproved(false); setArtifact(0); replay(); }}>Replay story <ArrowRight size={12} /></button></div>
  </div>;
}
