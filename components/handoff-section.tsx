import {
  FileText,
  GitBranch,
  TerminalWindow,
} from "@phosphor-icons/react/dist/ssr";
import { AgentLogo, type AgentName } from "./agent-logo";
import { Reveal } from "./reveal";

const agentTools = [
  "Claude Code",
  "Codex CLI",
  "Cursor CLI",
  "Antigravity",
  "DeepSeek",
  "OpenCode",
  "Pi",
  "Poolside",
] as const satisfies readonly AgentName[];

export function HandoffSection() {
  return (
    <section className="section handoff-section" id="agents">
      <div className="site-shell">
        <Reveal className="section-heading">
          <h2>Different agents. One handoff.</h2>
          <p>
            Pick the right tool and model for each stage without losing
            what the last agent learned. Bring your own model provider API
            keys.
          </p>
        </Reveal>

        <div className="handoff-grid">
          <Reveal className="handoff-cell handoff-tools">
            <div className="cell-icon">
              <TerminalWindow aria-hidden="true" size={22} weight="duotone" />
            </div>
            <h3>Use the agents you already trust</h3>
            <p>Every stage pairs a coding tool with a model and a skill.</p>
            <div aria-label="Supported coding agents" className="tool-list">
              {agentTools.map((tool) => (
                <code key={tool}>
                  <AgentLogo agent={tool} className="agent-logo" />
                  <span>{tool}</span>
                </code>
              ))}
            </div>
          </Reveal>

          <Reveal className="handoff-cell handoff-artifact" delay={0.06}>
            <div className="cell-icon">
              <FileText aria-hidden="true" size={22} weight="duotone" />
            </div>
            <h3>Context becomes an artifact</h3>
            <p>
              Each stage commits a durable write-up for the next agent to
              read.
            </p>
            <div className="artifact-preview">
              <code>docs/bento/ui-ux-design.md</code>
              <span>Interaction states</span>
              <span>Acceptance criteria</span>
              <span>Open decisions</span>
            </div>
          </Reveal>

          <Reveal className="handoff-cell handoff-repos" delay={0.12}>
            <div className="cell-icon">
              <GitBranch aria-hidden="true" size={22} weight="duotone" />
            </div>
            <h3>Keep one feature across repositories</h3>
            <p>
              Frontend and backend worktrees share one branch, one card,
              and one history.
            </p>
            <div className="repo-stack" aria-label="Example feature workspace">
              <code>checkout/web</code>
              <code>checkout/api</code>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
