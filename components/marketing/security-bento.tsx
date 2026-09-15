import {
  Check,
  GitBranch,
  Key,
  ShieldCheck,
  TerminalWindow,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";

export function SecurityBento() {
  return (
    <section className="m-section site-shell m-security" id="security">
      <Reveal className="m-section-heading">
        <ShieldCheck aria-hidden="true" size={32} />
        <h2>
          Control how agents move.{" "}
          <br />
          <span>Keep the boundaries clear.</span>
        </h2>
        <p>
          Choose how each stage clears, then run every feature in an isolated
          environment with access limited to what it needs.
        </p>
      </Reveal>

      <div className="m-security-bento">
        <Reveal className="m-security-card m-security-approvals">
          <div className="m-security-card-icon">
            <ShieldCheck aria-hidden="true" size={21} />
          </div>
          <h3>Manual when judgment matters. Automatic when requirements pass.</h3>
          <p>
            Set the gate for each stage. Review uncertain work yourself, or let
            clear requirements move routine work forward.
          </p>
          <figure
            className="m-approval-modes"
            aria-label="Manual and automatic stage approval options"
          >
            <div data-mode="manual">
              <header>
                <span>Manual approval</span>
                <code>human decision</code>
              </header>
              <p>Review the diff, approve it, or send the work back.</p>
              <div>
                <span><Check aria-hidden="true" size={13} />Agent run finished</span>
                <strong>Approve</strong>
              </div>
            </div>
            <div data-mode="automatic">
              <header>
                <span>Auto approval</span>
                <code>requirements</code>
              </header>
              <p>The card advances only when every requirement passes.</p>
              <ul>
                <li><Check aria-hidden="true" size={13} />Tests pass</li>
                <li><Check aria-hidden="true" size={13} />Artifacts committed</li>
                <li><Check aria-hidden="true" size={13} />Review complete</li>
              </ul>
            </div>
            <figcaption>
              <ShieldCheck aria-hidden="true" size={14} />
              Every decision stays in the feature history
            </figcaption>
          </figure>
        </Reveal>

        <Reveal className="m-security-card m-security-workspace" delay={0.06}>
          <div className="m-security-card-icon">
            <TerminalWindow aria-hidden="true" size={21} />
          </div>
          <h3>One feature. One isolated workspace.</h3>
          <p>
            Each card gets its own worktree and sandbox, so concurrent agents
            don’t interfere with your machine or one another.
          </p>
          <figure
            className="m-workspace-map"
            aria-label="One feature connected to two isolated repository workspaces"
          >
            <div className="m-workspace-feature">
              <span>feature card</span>
              <strong>Checkout recovery</strong>
              <code>feature/checkout-recovery</code>
            </div>
            <div className="m-workspace-branch" aria-hidden="true" />
            <ol>
              <li>
                <header>
                  <span>sandbox 01</span>
                  <code>running</code>
                </header>
                <GitBranch aria-hidden="true" size={16} />
                <strong>checkout/web</strong>
                <span>isolated worktree</span>
              </li>
              <li>
                <header>
                  <span>sandbox 02</span>
                  <code>running</code>
                </header>
                <GitBranch aria-hidden="true" size={16} />
                <strong>checkout/api</strong>
                <span>isolated worktree</span>
              </li>
            </ol>
          </figure>
        </Reveal>

        <Reveal className="m-security-card m-security-credentials" delay={0.12}>
          <div className="m-security-card-icon">
            <Key aria-hidden="true" size={21} />
          </div>
          <h3>Credentials stay outside the sandbox.</h3>
          <p>
            Encrypted organization credentials and short-lived GitHub tokens
            are supplied only when required.
          </p>
          <figure
            className="m-credential-panel"
            aria-label="A trusted credential service issuing scoped, short-lived access"
          >
            <figcaption>
              <ShieldCheck aria-hidden="true" size={15} />
              trusted service
            </figcaption>
            <div>
              <span>GitHub token</span>
              <strong>checkout/web</strong>
              <code>14m 32s</code>
            </div>
            <div>
              <span>Organization secret</span>
              <strong>runtime only</strong>
              <code>hidden</code>
            </div>
            <small>not stored in the agent workspace</small>
          </figure>
        </Reveal>

      </div>
    </section>
  );
}
