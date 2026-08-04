"use client";

import {
  Brain,
  CheckCircle,
  Code,
  GitPullRequest,
  PaintBrush,
  Pause,
  Play,
  Ruler,
} from "@phosphor-icons/react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const [isPaused, setIsPaused] = useState(false);
  const [previousReduceMotion, setPreviousReduceMotion] =
    useState(reduceMotion);
  const boardRef = useRef<HTMLDivElement>(null);
  const laneRefs = useRef<(HTMLElement | null)[]>([]);
  const activeStageRef = useRef(activeStage);
  const reduceMotionRef = useRef(reduceMotion);

  if (reduceMotion !== previousReduceMotion) {
    setPreviousReduceMotion(reduceMotion);
    if (reduceMotion) setActiveStage(0);
  }

  useEffect(() => {
    activeStageRef.current = activeStage;
    reduceMotionRef.current = reduceMotion;
  }, [activeStage, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || isPaused) return;
    const timer = window.setInterval(() => {
      setActiveStage((stage) => (stage + 1) % stages.length);
    }, 2500);
    return () => window.clearInterval(timer);
  }, [isPaused, reduceMotion]);

  const centerActiveLane = useCallback(() => {
    const board = boardRef.current;
    const lane = laneRefs.current[activeStageRef.current];

    if (!board || !lane) return;

    const centeredLeft =
      lane.offsetLeft + lane.offsetWidth / 2 - board.clientWidth / 2;
    const maximumLeft = Math.max(0, board.scrollWidth - board.clientWidth);

    board.scrollTo?.({
      behavior: reduceMotionRef.current ? "instant" : "smooth",
      left: Math.min(maximumLeft, Math.max(0, centeredLeft)),
    });
  }, []);

  useEffect(() => {
    centerActiveLane();
  }, [activeStage, centerActiveLane, reduceMotion]);

  useEffect(() => {
    const board = boardRef.current;

    if (!board || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(centerActiveLane);
    observer.observe(board);
    laneRefs.current.forEach((lane) => {
      if (lane) observer.observe(lane);
    });

    return () => observer.disconnect();
  }, [centerActiveLane]);

  const togglePaused = () => {
    setIsPaused((paused) => !paused);
  };

  const AnimationIcon = isPaused ? Play : Pause;

  return (
    <section
      aria-labelledby="live-pipeline-title"
      className="pipeline-window"
    >
      <h2 className="sr-only" id="live-pipeline-title">
        Live feature pipeline
      </h2>
      <div className="pipeline-window-bar">
        <span aria-hidden="true">Bento</span>
        <span aria-hidden="true">Payments platform</span>
        <div className="pipeline-window-status">
          <span aria-hidden="true">Live</span>
          <button
            aria-label={`${isPaused ? "Play" : "Pause"} pipeline animation`}
            className="pipeline-animation-control"
            onClick={togglePaused}
            type="button"
          >
            <AnimationIcon aria-hidden="true" size={11} weight="bold" />
            <span aria-hidden="true">{isPaused ? "Play" : "Pause"}</span>
          </button>
        </div>
      </div>
      <LayoutGroup>
        <div className="pipeline-board" ref={boardRef}>
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <section
                className="pipeline-lane"
                key={stage.name}
                ref={(lane) => {
                  laneRefs.current[index] = lane;
                }}
              >
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
      <p aria-atomic="true" aria-live="polite" className="sr-only">
        Checkout recovery is in {stages[activeStage]?.name}.
      </p>
    </section>
  );
}
