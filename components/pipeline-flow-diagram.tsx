"use client";

import {
  ArrowCounterClockwise,
  Check,
  CheckCircle,
  FlowArrow,
  Pause,
  Play,
} from "@phosphor-icons/react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AgentLogo, type AgentName } from "@/components/agent-logo";

type GateMode = "auto" | "manual";

interface PipelineStage {
  slug: string;
  name: string;
  agent: string;
  harness: AgentName;
  model: string;
  gate: GateMode;
  /** The pass condition shown for the gate, in the docs' criterion vocabulary. */
  requirement: string;
  opensPullRequest?: boolean;
  outcome: string;
}

/**
 * The default six-stage pipeline a new project starts with, as the diagram
 * presents it. Stage names match the homepage demo; agents are harness and
 * model pairs like the pipeline file in /docs/pipeline.
 */
export const pipelineStages: readonly PipelineStage[] = [
  {
    slug: "product-investigation",
    name: "Product investigation",
    agent: "Product Manager",
    harness: "Claude Code",
    model: "Claude Sonnet 4.6",
    gate: "manual",
    requirement: "manual",
    outcome:
      "A product brief: the user problem, scope, and acceptance criteria the rest of the pipeline builds from.",
  },
  {
    slug: "ui-ux-design",
    name: "UI/UX design",
    agent: "Product Designer",
    harness: "Antigravity",
    model: "Gemini 3.1 Pro",
    gate: "manual",
    requirement: "manual",
    outcome:
      "A design handoff: user flow, key states, and accessibility requirements.",
  },
  {
    slug: "engineering-requirements",
    name: "Engineering requirements",
    agent: "Staff Engineer",
    harness: "DeepSeek",
    model: "DeepSeek V4 Pro",
    gate: "manual",
    requirement: "manual",
    outcome:
      "A technical plan: approaches compared, risks and tradeoffs written down.",
  },
  {
    slug: "implementation",
    name: "Implementation",
    agent: "Software Engineer",
    harness: "Codex CLI",
    model: "GPT-5.4",
    gate: "manual",
    requirement: "manual",
    opensPullRequest: true,
    outcome:
      "Working changes with tests on the card's branch, published as a pull request.",
  },
  {
    slug: "code-review",
    name: "Code review",
    agent: "Code Reviewer",
    harness: "OpenCode",
    model: "GPT-5.6",
    gate: "auto",
    requirement: "checks_pass",
    outcome:
      "Review findings against what the earlier stages asked for. The card advances on its own once GitHub checks pass.",
  },
  {
    slug: "quality-engineering",
    name: "Quality engineering",
    agent: "QA Engineer",
    harness: "Cursor CLI",
    model: "Composer 2.5",
    gate: "manual",
    requirement: "manual",
    outcome:
      "Validation against the acceptance criteria, with reproduced failures and a ready-to-ship verdict.",
  },
];

export const liveCardTitle = "Checkout recovery";

const DONE = pipelineStages.length;

type Phase = "gated" | "running";
type Playback = "auto" | "paused" | "playing";

interface Position {
  phase: Phase;
  stage: number;
}

const RUNNING_MS = 2200;
const GATED_MS = 1500;
const DONE_MS = 2600;

interface SettledCard {
  label: string;
  state: "done" | "gated" | "idle" | "running";
  title: string;
}

const settledCards: Record<number, SettledCard[]> = {
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
  [DONE]: [{ label: "done", state: "done", title: "Retry timed-out webhooks" }],
};

const gateCopy: Record<GateMode, string> = {
  auto: "Automatic: advances when every requirement passes",
  manual: "Manual: a person approves, sends back, or steers",
};

// Server and first client render must match; motion preferences apply after.
const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function ordinal(index: number): string {
  return String(index + 1).padStart(2, "0");
}

function liveCardLabel(position: Position): string {
  if (position.stage === DONE) return "done";
  if (position.phase === "running") return "agent working";
  return pipelineStages[position.stage]!.gate === "auto"
    ? "checks running"
    : "waiting for approval";
}

function locationName(stage: number): string {
  return stage === DONE ? "Done" : pipelineStages[stage]!.name;
}

export function PipelineFlowDiagram() {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    clientSnapshot,
    serverSnapshot,
  );
  const reduceMotion = useReducedMotion();
  const [position, setPosition] = useState<Position>({
    phase: "running",
    stage: 0,
  });
  const [playback, setPlayback] = useState<Playback>("auto");
  const [pinned, setPinned] = useState<number | null>(null);

  const reduced = hydrated && reduceMotion === true;
  const playing =
    playback === "playing" || (playback === "auto" && !reduced);

  useEffect(() => {
    if (!playing) return;

    const delay =
      position.stage === DONE
        ? DONE_MS
        : position.phase === "running"
          ? RUNNING_MS
          : GATED_MS;
    const timer = window.setTimeout(() => {
      setPosition((current) => {
        if (current.stage === DONE) return { phase: "running", stage: 0 };
        if (current.phase === "running")
          return { phase: "gated", stage: current.stage };
        return { phase: "running", stage: current.stage + 1 };
      });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [playing, position]);

  const approve = () => {
    setPosition((current) =>
      current.stage === DONE
        ? current
        : { phase: "running", stage: current.stage + 1 },
    );
  };

  const sendBack = () => {
    setPosition((current) =>
      current.stage === 0
        ? current
        : { phase: "running", stage: current.stage - 1 },
    );
  };

  const togglePlayback = () => {
    setPlayback(playing ? "paused" : "playing");
  };

  const selectStage = (index: number) => {
    setPinned((current) => (current === index ? null : index));
  };

  const shown = pinned ?? position.stage;
  const shownStage = shown === DONE ? null : pipelineStages[shown]!;
  const atDone = position.stage === DONE;
  const currentGate = atDone ? null : pipelineStages[position.stage]!.gate;
  const status = liveCardLabel(position);
  const PlaybackIcon = playing ? Pause : Play;
  const transition = {
    duration: reduceMotion ? 0 : 0.45,
    ease: [0.2, 0, 0, 1] as const,
  };

  const liveCard = (
    <motion.article
      animate={{ opacity: 1 }}
      aria-label={`${liveCardTitle}: ${status} in ${locationName(position.stage)}`}
      className="flow-card"
      data-live=""
      data-state={
        atDone ? "done" : position.phase === "running" ? "running" : "gated"
      }
      initial={false}
      layoutId="flow-live-card"
      transition={transition}
    >
      <strong>{liveCardTitle}</strong>
      <span>{status}</span>
      {!atDone && position.phase === "running" ? (
        <span aria-hidden="true" className="activity-line">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      ) : null}
    </motion.article>
  );

  return (
    <figure
      aria-labelledby="pipeline-flow-title"
      className="pipeline-flow"
      data-phase={position.phase}
    >
      <figcaption className="flow-caption">
        <span id="pipeline-flow-title">
          <FlowArrow aria-hidden="true" size={15} />
          Default pipeline: six stages, one card moving through them
        </span>
        <span className="flow-controls" role="group" aria-label="Card actions">
          <button
            className="flow-button"
            disabled={position.stage === 0}
            onClick={sendBack}
            type="button"
          >
            <ArrowCounterClockwise aria-hidden="true" size={13} weight="bold" />
            {atDone ? "Reopen" : "Send back"}
          </button>
          <button
            className="flow-button flow-button-primary"
            disabled={atDone}
            onClick={approve}
            type="button"
          >
            <Check aria-hidden="true" size={13} weight="bold" />
            {currentGate === "auto" ? "Re-check" : "Approve"}
          </button>
          <button
            aria-label={`${playing ? "Pause" : "Play"} pipeline diagram`}
            className="flow-button flow-playback"
            onClick={togglePlayback}
            type="button"
          >
            <PlaybackIcon aria-hidden="true" size={12} weight="fill" />
          </button>
        </span>
      </figcaption>

      <LayoutGroup>
        <ol aria-label="Pipeline stages" className="flow-track">
          {pipelineStages.map((stage, index) => {
            const holdsCard = position.stage === index;
            return (
              <li
                className="flow-stage"
                data-active={holdsCard ? "" : undefined}
                data-selected={shown === index ? "" : undefined}
                key={stage.slug}
              >
                <div className="flow-node">
                  <button
                    aria-pressed={shown === index}
                    className="flow-stage-button"
                    onClick={() => selectStage(index)}
                    type="button"
                  >
                    <span className="flow-ordinal">{ordinal(index)}</span>
                    <span className="flow-stage-name">{stage.name}</span>
                    <span className="flow-agent">{stage.agent}</span>
                    <span className="flow-harness">
                      <AgentLogo agent={stage.harness} className="agent-logo" />
                      <span>{stage.harness}</span>
                    </span>
                  </button>
                  <div className="flow-slot">
                    {holdsCard ? liveCard : null}
                    {(settledCards[index] ?? []).map((card) => (
                      <article
                        className="flow-card"
                        data-state={card.state}
                        key={card.title}
                      >
                        <strong>{card.title}</strong>
                        <span>{card.label}</span>
                      </article>
                    ))}
                  </div>
                </div>
                <span
                  aria-hidden="true"
                  className="flow-gate"
                  data-gate={stage.gate}
                  data-waiting={
                    holdsCard && position.phase === "gated" ? "" : undefined
                  }
                >
                  <i />
                  <span>{stage.gate}</span>
                </span>
              </li>
            );
          })}
          <li
            className="flow-stage flow-done"
            data-active={atDone ? "" : undefined}
            data-selected={shown === DONE ? "" : undefined}
          >
            <div className="flow-node">
              <button
                aria-pressed={shown === DONE}
                className="flow-stage-button"
                onClick={() => selectStage(DONE)}
                type="button"
              >
                <span className="flow-ordinal">
                  <CheckCircle aria-hidden="true" size={12} weight="bold" />
                </span>
                <span className="flow-stage-name">Done</span>
                <span className="flow-agent">No agent runs</span>
              </button>
              <div className="flow-slot">
                {atDone ? liveCard : null}
                {settledCards[DONE]!.map((card) => (
                  <article
                    className="flow-card"
                    data-state={card.state}
                    key={card.title}
                  >
                    <strong>{card.title}</strong>
                    <span>{card.label}</span>
                  </article>
                ))}
              </div>
            </div>
          </li>
        </ol>
      </LayoutGroup>

      <div className="flow-detail">
        <div className="flow-detail-head">
          <p className="flow-detail-title">
            <span className="flow-ordinal">
              {shownStage ? ordinal(shown) : "end"}
            </span>
            <strong>{shownStage ? shownStage.name : "Done"}</strong>
          </p>
          {pinned === null ? (
            <span className="flow-detail-mode">Following the card</span>
          ) : (
            <button
              className="flow-button"
              onClick={() => setPinned(null)}
              type="button"
            >
              Follow the card
            </button>
          )}
        </div>
        {shownStage ? (
          <dl className="flow-detail-grid">
            <div>
              <dt>Agent</dt>
              <dd>{shownStage.agent}</dd>
            </div>
            <div>
              <dt>Harness and model</dt>
              <dd>
                <AgentLogo agent={shownStage.harness} className="agent-logo" />
                {shownStage.harness} · {shownStage.model}
              </dd>
            </div>
            <div>
              <dt>Gate</dt>
              <dd>
                {gateCopy[shownStage.gate]}
                {" "}
                <code>{shownStage.requirement}</code>
              </dd>
            </div>
            <div>
              <dt>Writes</dt>
              <dd>
                <code>docs/bento/{shownStage.slug}.md</code>
                {shownStage.opensPullRequest ? " and opens a pull request" : ""}
              </dd>
            </div>
          </dl>
        ) : (
          <dl className="flow-detail-grid">
            <div>
              <dt>Agent</dt>
              <dd>None. After the last stage there are no further stage actions or agent runs.</dd>
            </div>
            <div>
              <dt>Reopen</dt>
              <dd>Returns the card to the stage it finished in, with its branch, sandbox, and artifacts intact.</dd>
            </div>
          </dl>
        )}
        <p className="flow-detail-outcome">
          {shownStage
            ? shownStage.outcome
            : "The card keeps its branch and committed stage write-ups, so the history of every decision stays with the code."}
        </p>
      </div>

      <ul className="flow-legend">
        <li>
          <i data-gate="manual" />
          Manual gate: a person reviews the stage output before the card moves on
        </li>
        <li>
          <i data-gate="auto" />
          Automatic gate: the card advances when its requirements pass
        </li>
        <li>Select a stage to inspect its agent and gate.</li>
      </ul>

      <p aria-atomic="true" aria-live="polite" className="sr-only">
        {liveCardTitle} is {status} in {locationName(position.stage)}.
      </p>
    </figure>
  );
}
