"use client";

import {
  Brain,
  CheckCircle,
  Code,
  GitPullRequest,
  PaintBrush,
  Ruler,
} from "@phosphor-icons/react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const stages = [
  {
    agent: "Product Manager",
    icon: Brain,
    name: "Product investigation",
  },
  {
    agent: "Product Designer",
    icon: PaintBrush,
    name: "UI/UX design",
  },
  {
    agent: "Staff Engineer",
    icon: Ruler,
    name: "Engineering requirements",
  },
  {
    agent: "Software Engineer",
    icon: Code,
    name: "Implementation",
  },
  {
    agent: "Code Reviewer",
    icon: GitPullRequest,
    name: "Code review",
  },
  {
    agent: "QA Engineer",
    icon: CheckCircle,
    name: "Quality engineering",
  },
];

const settledCards: Record<
  number,
  {
    label: string;
    state: "done" | "gated" | "idle" | "running";
    title: string;
  }[]
> = {
  0: [{ label: "not started", state: "idle", title: "Invite team members" }],
  2: [{ label: "not started", state: "idle", title: "Usage-based billing" }],
  3: [
    {
      label: "agent working",
      state: "running",
      title: "Move audit log off hot path",
    },
  ],
  4: [
    {
      label: "waiting at gate",
      state: "gated",
      title: "Rate limit the public API",
    },
  ],
  5: [{ label: "done", state: "done", title: "Retry timed-out webhooks" }],
};

export function PipelineDemo() {
  const reduceMotion = useReducedMotion();
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setTimeout(() => {
      setActiveStage(1);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <section
      aria-labelledby="live-pipeline-title"
      className="pipeline-window"
    >
      <h2 className="sr-only" id="live-pipeline-title">
        Live feature pipeline
      </h2>
      <div className="pipeline-window-bar" aria-hidden="true">
        <span>Bento</span>
        <span>Payments platform</span>
        <span>Live</span>
      </div>
      <LayoutGroup>
        <div className="pipeline-board">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <section className="pipeline-lane" key={stage.name}>
                <header className="pipeline-lane-header">
                  <div className="pipeline-lane-title">
                    <span className="pipeline-ordinal">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{stage.name}</h3>
                  </div>
                  <span className="pipeline-agent">
                    <Icon aria-hidden="true" size={13} weight="bold" />
                    {stage.agent}
                  </span>
                </header>
                <div className="pipeline-cards">
                  {activeStage === index && (
                    <motion.article
                      animate={{ opacity: 1, y: 0 }}
                      aria-label={`Checkout recovery is in ${stage.name}`}
                      className="pipeline-card"
                      data-state="running"
                      initial={false}
                      layoutId="live-feature"
                      transition={{
                        duration: reduceMotion ? 0 : 0.42,
                        ease: [0.2, 0, 0, 1],
                      }}
                    >
                      <strong>Checkout recovery</strong>
                      <span>agent working</span>
                      <span className="activity-line" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                      </span>
                    </motion.article>
                  )}
                  {(settledCards[index] ?? []).map((card) => (
                    <article
                      className="pipeline-card"
                      data-state={card.state}
                      key={card.title}
                    >
                      <strong>{card.title}</strong>
                      <span>{card.label}</span>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </LayoutGroup>
      <p aria-live="polite" className="sr-only">
        Checkout recovery is in {stages[activeStage]?.name}.
      </p>
    </section>
  );
}
