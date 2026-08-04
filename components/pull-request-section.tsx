import {
  ChatCircleText,
  CheckCircle,
  GitCommit,
  GitPullRequest,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./reveal";

const publishFlow = [
  { icon: GitCommit, label: "Agent run succeeds" },
  { icon: GitPullRequest, label: "Pull request opens or updates" },
  { icon: CheckCircle, label: "Checks pass" },
  { icon: ChatCircleText, label: "Review threads resolve" },
];

export function PullRequestSection() {
  return (
    <section className="section pr-section">
      <div className="site-shell">
        <Reveal className="section-heading">
          <h2>From idea to pull request.</h2>
          <p>
            Successful runs open or update the pull request first. Checks
            and review threads then decide whether the stage advances.
          </p>
        </Reveal>

        <Reveal className="publish-flow">
          {publishFlow.map((step, index) => {
            const Icon = step.icon;
            return (
              <div className="publish-step" key={step.label}>
                <span className="publish-icon">
                  <Icon aria-hidden="true" size={22} weight="duotone" />
                </span>
                <span>{step.label}</span>
                {index < publishFlow.length - 1 && (
                  <span aria-hidden="true" className="publish-line" />
                )}
              </div>
            );
          })}
        </Reveal>

        <div className="review-proof">
          <Reveal className="review-copy">
            <h3>The branch carries the decision trail.</h3>
            <p>
              Stage write-ups stay in history while the pull request diff
              stays focused on code.
            </p>
          </Reveal>
          <Reveal className="diff-preview" delay={0.08}>
            <div className="diff-header">
              <code>src/checkout/idempotency.ts</code>
              <span>Ready for review</span>
            </div>
            <pre aria-label="Example code change">
              <span className="diff-muted">
                {"@@ checkout recovery @@\n"}
              </span>
              <span className="diff-add">
                {"+ const key = request.headers.get(\"Idempotency-Key\");\n"}
              </span>
              <span className="diff-add">
                {"+ return payments.create(input, { key });\n"}
              </span>
              <span className="diff-muted">
                {"  await ledger.record(payment);"}
              </span>
            </pre>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
