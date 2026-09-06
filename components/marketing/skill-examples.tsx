"use client";

import { Pause, Play } from "@phosphor-icons/react";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const examples = [
  {
    stage: "PM",
    agent: "Product manager",
    model: "Claude Sonnet 4.6",
    skill: "Define the user problem, scope, and acceptance criteria. Produce a product brief the team can build from.",
  },
  {
    stage: "Product design",
    agent: "Product designer",
    model: "Gemini 3.1 Pro",
    skill: "Design the user flow, interactions, and key states. Deliver a design handoff with accessibility requirements and clear acceptance criteria.",
  },
  {
    stage: "Tech exploration",
    agent: "Staff engineer",
    model: "DeepSeek V4 Pro",
    skill: "Explore the codebase, compare approaches, and document a technical plan with risks and tradeoffs.",
  },
  {
    stage: "Implementation",
    agent: "Software engineer",
    model: "GPT-5.4",
    skill: "Implement the agreed plan, add tests, and deliver working changes that satisfy the acceptance criteria.",
  },
  {
    stage: "QA",
    agent: "QA engineer",
    model: "Composer 2.5",
    skill: "Validate the feature against the acceptance criteria. Reproduce failures and report whether it is ready to ship.",
  },
  {
    stage: "DevOps",
    agent: "DevOps engineer",
    model: "Claude Opus 4.6",
    skill: "Plan the rollout and data migrations. Define deployment steps, verification checks, and a rollback plan for a safe release.",
  },
];

// Keep the server and first client render identical before applying motion preferences.
const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function SkillExamples() {
  const hydrated = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  const container = useRef<HTMLDivElement>(null);
  const inView = useInView(container, { amount: 0.5 });
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const motionEnabled = hydrated && reducedMotion === false;
  const playing = !paused && motionEnabled;

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (!playing || !inView || !pageVisible || hovered) return;
    const timer = window.setInterval(() => {
      setSelected(index => (index + 1) % examples.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [playing, inView, pageVisible, hovered]);

  const PlaybackIcon = playing ? Pause : Play;

  return (
    <div
      className="m-skill-carousel"
      ref={container}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={event => {
        // Keyboard users should be able to read without the example changing.
        if (
          event.target.matches(":focus-visible") &&
          !event.currentTarget.contains(event.relatedTarget as Node | null)
        ) {
          setPaused(true);
        }
      }}
    >
      <div className="m-skill-controls">
        <div className="m-skill-stages" role="group" aria-label="Choose a pipeline stage example">
          {examples.map((example, index) => (
            <button
              key={example.stage}
              type="button"
              aria-pressed={selected === index}
              onClick={() => {
                setSelected(index);
                setPaused(true);
              }}
            >
              {example.stage}
            </button>
          ))}
        </div>
        <button
          className="m-skill-playback"
          type="button"
          aria-label={playing ? "Pause stage examples" : "Play stage examples"}
          title={!motionEnabled ? "Automatic cycling is disabled for reduced motion" : playing ? "Pause examples" : "Play examples"}
          disabled={!motionEnabled}
          onClick={() => setPaused(value => !value)}
        >
          <PlaybackIcon size={14} aria-hidden="true" weight="fill" />
        </button>
      </div>
      <div className="m-skill-panels" aria-live={playing ? "off" : "polite"} aria-atomic="true">
        {examples.map((example, index) => (
          <dl
            key={example.stage}
            className="m-skill-example"
            aria-label={`${example.stage} stage, agent, model, and skill`}
            aria-hidden={selected !== index}
            data-active={selected === index}
          >
            <div><dt>Stage</dt><dd>{example.stage}</dd></div>
            <div><dt>Agent</dt><dd>{example.agent}</dd></div>
            <div><dt>Model</dt><dd>{example.model}</dd></div>
            <div><dt>Skill</dt><dd>{example.skill}</dd></div>
          </dl>
        ))}
      </div>
    </div>
  );
}
