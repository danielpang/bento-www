"use client";

import { useState } from "react";
import { ArrowRight, Check, CheckCircle, FileText, GitBranch, GitPullRequest, ShieldCheck } from "@phosphor-icons/react";
import { useHeroStory } from "./hero-story";

const chapters = ["Ship more", "Keep context", "Raise quality"];
const artifacts = [
  { label: "Requirement", file: "plan.md", text: "Recover interrupted checkouts without charging a customer twice.", detail: "Success means a retry resumes the existing payment, even when the first response times out." },
  { label: "Decision", file: "decisions.md", text: "One checkout. One idempotency key.", detail: "Reuse the checkout ID across retries. A timeout does not mean the original payment failed." },
  { label: "Implementation", file: "checkout.ts", text: "Carry the checkout ID into every payment request.", detail: "The implementation links back to the plan and decision, so a reviewer can follow why this changed." },
];

export function HeroStoryDemo() {
  const { active, selected, select, replay } = useHeroStory();
  const [artifact, setArtifact] = useState(0);
  const [approved, setApproved] = useState(false);
  return <div className="m-demo hero-visual hero-story-demo" id="product">
    <div className="story-topbar"><span><GitBranch size={15} /> One feature. The whole story.</span><span className="story-example">Interactive example</span></div>
    <div className="story-chapters" role="group" aria-label="Explore Bento benefits">
      {chapters.map((label, index) => <button type="button" key={label} aria-pressed={active === index} onClick={() => select(index)}><span>0{index + 1}</span>{label}</button>)}
    </div>
    <div className="story-scenes">
      <section className="story-scene" data-active={active === 0} aria-hidden={active !== 0} inert={active !== 0} aria-label="Ship more">
        <div className="story-eyebrow">FROM IDEA TO PULL REQUEST</div>
        <h2>More work moving. Less chasing.</h2>
        <p className="story-intro">Agents work in parallel. You see the whole graph.</p>
        <div className="story-graph" aria-label="Checkout recovery flows from plan to implementation and tests, then review">
          <div className="story-node"><FileText size={18} /><strong>Plan</strong><span>Context captured</span><Check size={13} /></div>
          <div className="story-branches"><div className="story-node story-node-working"><GitBranch size={18} /><strong>Implement</strong><span>Checkout recovery</span><i /></div><div className="story-node story-node-working"><ShieldCheck size={18} /><strong>Test</strong><span>Retry edge cases</span><i /></div></div>
          <div className="story-node"><GitPullRequest size={18} /><strong>Review</strong><span>Ready for your eye</span></div>
        </div>
        <div className="story-queue"><span><i /> Checkout recovery</span><span>Implementation + tests</span></div>
        <div className="story-queue"><span><CheckCircle size={14} /> Billing empty states</span><span>PR ready</span></div>
        <div className="story-queue"><span><i /> Rate limit API</span><span>In review</span></div>
      </section>
      <section className="story-scene" data-active={active === 1} aria-hidden={active !== 1} inert={active !== 1} aria-label="Keep context">
        <div className="story-eyebrow">THE WHY TRAVELS WITH THE DIFF</div>
        <h2>A change you can trace.</h2>
        <p className="story-intro">From the original request to the line that changed.</p>
        <div className="story-pr"><GitPullRequest size={18} /><div><strong>Recover interrupted checkouts</strong><span>Plan, decisions, and code. Together.</span></div><span className="story-badge">+24 −8</span></div>
        <div className="story-artifact-tabs" role="group" aria-label="Explore change context">{artifacts.map((item, index) => <button type="button" key={item.file} aria-pressed={artifact === index} onClick={() => { setArtifact(index); select(1); }}>{item.label}</button>)}</div>
        <div className="story-artifact"><code><FileText size={13} />{artifacts[artifact].file}</code><strong>{artifacts[artifact].text}</strong><p>{artifacts[artifact].detail}</p><span className="story-linked"><GitBranch size={13} /> Linked to this pull request</span></div>
      </section>
      <section className="story-scene" data-active={active === 2} aria-hidden={active !== 2} inert={active !== 2} aria-label="Raise quality">
        <div className="story-eyebrow">A SECOND LOOK BEFORE IT SHIPS</div>
        <h2>Catch the bug. Keep the bar.</h2>
        <p className="story-intro">Review finds an edge case. The agent fixes it.</p>
        <div className="story-finding"><ShieldCheck size={19} /><div><strong>A retry could charge the customer twice.</strong><p>The first payment may succeed even if its response times out.</p></div></div>
        <div className="story-diff"><code className="story-removed">− idempotencyKey: randomUUID()</code><code className="story-added">+ idempotencyKey: checkout.id</code></div>
        <div className="story-check"><CheckCircle size={16} /> Retry regression test passed</div>
        <div className="story-approval"><span role="status">{approved ? "Approved. Ready to merge." : "The final call is yours."}</span><button type="button" disabled={approved} onClick={() => { setApproved(true); select(2); }}>{approved ? <><Check size={14} /> Approved</> : <>Approve example <ArrowRight size={14} /></>}</button></div>
      </section>
    </div>
    <div className="story-footer"><span><span className="story-dot" /> {selected ? "Exploring at your pace" : "One connected workflow"}</span><button type="button" onClick={() => { setApproved(false); setArtifact(0); replay(); }}>Replay story <ArrowRight size={12} /></button></div>
  </div>;
}
