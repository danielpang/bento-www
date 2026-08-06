"use client";

import {
  Brain,
  CheckCircle,
  Code,
  GitPullRequest,
  PaintBrush,
  Ruler,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const lifecycleIntro = {
  eyebrow: "A pipeline shaped by your team",
  heading: "Every feature has a route.",
  summary:
    "This is one example. Define any pipeline you want, with the stages, agents, skills, and rules that fit your team.",
};

const lifecycle = [
  {
    agent: "Research agent exploring",
    copy: "Research the product surface, reproduce the behavior, and turn scattered context into a clear opportunity.",
    headline: "Understand the problem before touching the code.",
    icon: Brain,
    name: "Product investigation",
    phase: "Discover",
    shortName: "Investigate",
  },
  {
    agent: "Design agent shaping",
    copy: "Translate the findings into flows, interfaces, and decisions the whole team can inspect.",
    headline: "Turn findings into a deliberate experience.",
    icon: PaintBrush,
    name: "UI/UX design",
    phase: "Shape",
    shortName: "Design",
  },
  {
    agent: "Planning agent structuring",
    copy: "Map the system, define acceptance criteria, and give the implementation agent the context it needs.",
    headline: "Turn intent into an executable plan.",
    icon: Ruler,
    name: "Engineering requirements",
    phase: "Define",
    shortName: "Requirements",
  },
  {
    agent: "Coding agent building",
    copy: "Work inside an isolated branch with the requirements, skills, and repository rules already in context.",
    headline: "Build with every prior decision in reach.",
    icon: Code,
    name: "Implementation",
    phase: "Build",
    shortName: "Build",
  },
  {
    agent: "Review agent checking",
    copy: "Inspect the branch against the plan, the intended experience, and every decision made along the route.",
    headline: "Review more than the final diff.",
    icon: GitPullRequest,
    name: "Code review",
    phase: "Review",
    shortName: "Review",
  },
  {
    agent: "QA agent verifying",
    copy: "Exercise the experience end-to-end, capture proof, and leave the feature ready for a confident review.",
    headline: "Close the route with evidence.",
    icon: CheckCircle,
    name: "Quality engineering",
    phase: "Verify",
    shortName: "Quality",
  },
];

type ScrollStageInput = {
  sectionHeight: number;
  sectionTop: number;
  stageCount: number;
  viewportHeight: number;
};

export function getLifecycleStageFromScroll({
  sectionHeight,
  sectionTop,
  stageCount,
  viewportHeight,
}: ScrollStageInput) {
  const scrollableDistance = Math.max(sectionHeight - viewportHeight, 1);
  const progress = Math.min(
    1,
    Math.max(0, -sectionTop / scrollableDistance),
  );

  return Math.round(progress * Math.max(stageCount - 1, 0));
}

export function LifecycleSection() {
  const reduceMotion = useReducedMotion();
  const [activeStage, setActiveStage] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const displayedStage = reduceMotion ? 0 : activeStage;
  const stage = lifecycle[displayedStage] ?? lifecycle[0];

  useEffect(() => {
    if (reduceMotion) return;

    let animationFrame = 0;

    const updateActiveStage = () => {
      const section = sectionRef.current;
      if (!section) return;

      const bounds = section.getBoundingClientRect();
      const nextStage = getLifecycleStageFromScroll({
        sectionHeight: bounds.height,
        sectionTop: bounds.top,
        stageCount: lifecycle.length,
        viewportHeight: window.innerHeight,
      });

      setActiveStage((currentStage) =>
        currentStage === nextStage ? currentStage : nextStage,
      );
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateActiveStage);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [reduceMotion]);

  const renderStageContent = (
    item: (typeof lifecycle)[number],
    index: number,
  ) => {
    const Icon = item.icon;

    return (
      <>
        <div className="lifecycle-number-panel">
          <span aria-hidden="true" className="lifecycle-giant-number">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="lifecycle-phase">{item.phase}</span>
          <h3>{item.name}</h3>
        </div>
        <div className="lifecycle-stage-story">
          <div>
            <h4>{item.headline}</h4>
            <p>{item.copy}</p>
            <span className="lifecycle-agent-status">
              <i aria-hidden="true" />
              {item.agent}
            </span>
          </div>
          <div aria-hidden="true" className="lifecycle-stage-art">
            <span className="lifecycle-art-icon">
              <Icon size={22} weight="duotone" />
            </span>
            <span className="lifecycle-art-card">
              <i />
              <i />
              <i />
            </span>
          </div>
        </div>
      </>
    );
  };

  return (
    <section
      className="section lifecycle-section"
      id="product"
      ref={sectionRef}
    >
      <div className="lifecycle-scroll-scene">
        <div className="lifecycle-sticky">
          <div className="site-shell lifecycle-shell">
            <header className="lifecycle-heading">
              <div>
                <span className="lifecycle-eyebrow">
                  {lifecycleIntro.eyebrow}
                </span>
                <h2>{lifecycleIntro.heading}</h2>
              </div>
              <p>{lifecycleIntro.summary}</p>
            </header>

            {reduceMotion ? (
              <ol
                aria-label="Complete product lifecycle"
                className="lifecycle-static-route"
              >
                {lifecycle.map((item, index) => (
                  <li key={item.name}>
                    {renderStageContent(item, index)}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="lifecycle-desktop-route">
                  <ol
                    aria-label="Default product lifecycle"
                    className="lifecycle-track"
                    style={
                      {
                        "--lifecycle-progress":
                          activeStage / (lifecycle.length - 1),
                      } as CSSProperties
                    }
                  >
                    {lifecycle.map((item, index) => (
                      <li
                        aria-current={
                          activeStage === index ? "step" : undefined
                        }
                        className={
                          index < activeStage
                            ? "is-complete"
                            : activeStage === index
                              ? "is-active"
                              : undefined
                        }
                        key={item.name}
                      >
                        <span aria-hidden="true" className="lifecycle-step">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="lifecycle-stage-name">
                          {item.name}
                        </span>
                      </li>
                    ))}
                  </ol>

                  <motion.article
                    animate={{ opacity: 1, y: 0 }}
                    aria-label="Active lifecycle stage"
                    className="lifecycle-active-stage"
                    initial={{ opacity: 0, y: 12 }}
                    key={stage.name}
                    role="group"
                    transition={{
                      duration: 0.32,
                      ease: [0.2, 0, 0, 1],
                    }}
                  >
                    {renderStageContent(stage, activeStage)}
                  </motion.article>
                </div>
            )}

            <p aria-atomic="true" aria-live="polite" className="sr-only">
              Stage {displayedStage + 1} of {lifecycle.length}: {stage.name}.{" "}
              {stage.headline}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
