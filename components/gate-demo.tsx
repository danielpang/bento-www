"use client";

import {
  ArrowCounterClockwise,
  Check,
  GitPullRequest,
  ShieldCheck,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

type GateState = "waiting" | "approved" | "returned";

const statusCopy: Record<GateState, string> = {
  approved: "Advanced to code review",
  returned: "Returned to engineering requirements",
  waiting: "Waiting for your approval",
};

const decisionCopy: Record<GateState, string> = {
  approved: "Manual approval recorded",
  returned: "Changes requested",
  waiting: "Waiting for human decision",
};

export function GateDemo() {
  const [state, setState] = useState<GateState>("waiting");
  const reduceMotion = useReducedMotion();

  return (
    <div className="gate-window">
      <header className="gate-window-header">
        <div>
          <span className="gate-kicker">Implementation</span>
          <h3>Prevent duplicate checkout charges</h3>
        </div>
        <span className="gate-branch">feature/checkout-idempotency</span>
      </header>

      <div className="gate-content">
        <div className="gate-summary">
          <ShieldCheck aria-hidden="true" size={22} weight="duotone" />
          <div>
            <span>Manual stage gate</span>
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              initial={false}
              key={state}
              role="status"
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            >
              {statusCopy[state]}
            </motion.p>
          </div>
        </div>

        <div
          aria-label="Manual stage activity"
          className="gate-checks"
          role="group"
        >
          <GateCheck label="Agent run finished" />
          <GateCheck label="Artifacts committed" />
          <GateCheck
            label={decisionCopy[state]}
            pending={state === "waiting"}
          />
        </div>

        <div className="gate-changes">
          <div>
            <GitPullRequest aria-hidden="true" size={18} weight="bold" />
            <span>Changes ready</span>
          </div>
          <code>diff available</code>
        </div>

        {state === "waiting" ? (
          <div className="gate-actions">
            <button
              className="demo-button demo-button-primary"
              onClick={() => setState("approved")}
              type="button"
            >
              <Check aria-hidden="true" size={15} weight="bold" />
              Approve
            </button>
            <button
              className="demo-button"
              onClick={() => setState("returned")}
              type="button"
            >
              Send back
            </button>
          </div>
        ) : (
          <button
            className="demo-button"
            onClick={() => setState("waiting")}
            type="button"
          >
            <ArrowCounterClockwise aria-hidden="true" size={15} weight="bold" />
            Reset demo
          </button>
        )}
      </div>
    </div>
  );
}

function GateCheck({
  label,
  pending = false,
}: {
  label: string;
  pending?: boolean;
}) {
  return (
    <div className="gate-check" data-pending={pending || undefined}>
      {pending ? (
        <span aria-hidden="true" className="gate-pending">
          …
        </span>
      ) : (
        <Check aria-hidden="true" size={14} weight="bold" />
      )}
      <span>{label}</span>
    </div>
  );
}
