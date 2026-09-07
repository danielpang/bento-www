import Link from "next/link";
import { ArrowRight, Check, FileText, GitBranch, ShieldCheck, TerminalWindow, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { AgentLogo, type AgentName } from "@/components/agent-logo";
import { CtaLink } from "@/components/cta-link";
import { GateDemo } from "@/components/gate-demo";
import { PipelineDemo } from "@/components/pipeline-demo";
import { IntegrationsSection } from "@/components/integrations-section";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { MarketingHeader } from "./header";
import { SkillExamples } from "./skill-examples";
import { FeatureArtifacts } from "./feature-artifacts";
import { siteConfig } from "@/lib/site";
const agents: AgentName[] = ["Claude Code", "Codex CLI", "Cursor CLI", "Antigravity", "DeepSeek", "OpenCode", "Pi", "Poolside"];
export function MarketingHome() {
  return <div className="marketing-page" data-marketing-variant="redesign">
    <MarketingHeader />
    <main id="main-content">
      <section className="m-hero site-shell">
        <Link className="m-announcement" href="/changelog">See what’s new <ArrowRight size={14} aria-hidden="true" /></Link>
        <div className="m-hero-heading">
          <div className="hero-copy">
            <h1>Your agents.<br /><span>One shipping team.</span></h1>
            <p>Orchestrate coding agents from idea to pull request. Track all your open features while keeping the context.</p>
            <div className="hero-actions">
              <CtaLink href={siteConfig.signupUrl}>Start building for free</CtaLink>
            </div>
          </div>
          <div className="m-demo hero-visual" id="product">
          <div className="m-demo-caption"><span><TerminalWindow size={16} aria-hidden="true" /> A feature, moving forward.</span><span>Interactive pipeline demo</span></div>
            <PipelineDemo />
          </div>
        </div>
      </section>
      <section className="site-shell m-agents" aria-label="Supported coding agents">
        <p>Your favourite harnesses and models</p>
        <div>{agents.map(agent => <span className="m-agent" key={agent}><AgentLogo agent={agent} className="agent-logo" /><span>{agent.replace(" CLI", "")}</span></span>)}</div>
      </section>
      <section className="m-section site-shell m-context">
        <Reveal className="m-section-heading"><h2>Model coding agents around your existing software development lifecycle</h2><p>Coordinate agents across many features at once. Your team shares one board, so progress and context stay visible.</p></Reveal>
        <Reveal className="m-stage-showcase">
          <div className="m-stage-intro">
            <FileText size={25} aria-hidden="true" />
            <h3>Give every stage a clear outcome.</h3>
            <p>Assign an agent to each pipeline stage, then give it a skill that describes the outcome you expect.</p>
          </div>
          <SkillExamples />
        </Reveal>
        <Reveal className="m-shared-board">
          <UsersThree size={28} aria-hidden="true" />
          <div>
            <h3>Many features. One shared board.</h3>
            <p>Track each feature as it moves through the pipeline. Teammates see the same board, including progress, agent work, and decisions, so everyone can follow along with the context.</p>
          </div>
        </Reveal>
      </section>
      <section className="m-section m-gates" id="how-it-works">
        <div className="site-shell m-gate-layout">
          <Reveal className="m-section-heading"><span className="m-eyebrow">Human judgment, built in</span><h2>Move fast.<br /><span>Keep the final say.</span></h2><p>Every stage starts with a manual gate. Review, approve, or steer the work. Automate when you’re ready.</p><ul className="m-check-list"><li><Check size={17} aria-hidden="true" />Approve work before it moves forward</li><li><Check size={17} aria-hidden="true" />Set requirements for automatic gates</li><li><Check size={17} aria-hidden="true" />Keep a history of every decision</li></ul></Reveal>
          <Reveal className="m-gate-demo" delay={0.08}><GateDemo /></Reveal>
        </div>
        <Reveal className="site-shell m-context-handoff">
          <div>
            <GitBranch size={25} aria-hidden="true" />
            <h3>The context goes with the code.</h3>
            <p>Each feature keeps its own plans, designs, and review artifacts. Stage write-ups are committed alongside the code, so the next agent starts with what the last one learned.</p>
          </div>
          <FeatureArtifacts />
        </Reveal>
      </section>
      <section className="m-section site-shell m-security" id="security">
        <Reveal className="m-section-heading"><ShieldCheck size={32} aria-hidden="true" /><h2>A sandbox for agents.<br /><span>A boundary you control.</span></h2><p>Each feature gets its own environment. Trusted services hold the credentials and publish the result.</p></Reveal>
        <div className="m-boundaries">
          <div><h3>Isolated workspaces</h3><p>Per-feature worktrees. No host SSH keys or host git configuration in the agent’s environment.</p></div>
          <div><h3>Scoped credentials</h3><p>Encrypted organization credentials and short-lived GitHub tokens scoped to the repository being published.</p></div>
          <div><h3>Run it your way</h3><p>Self-host with Docker, or use a shared board with code and agents running on your own machine.</p></div>
        </div>
      </section>
      <IntegrationsSection redesigned />
      <section className="m-bottom-cta site-shell"><div><h2>Put your agents<br /><span>on the same team.</span></h2><p>Start free with 3 members and 5 agent hours a month.</p></div><div><CtaLink href={siteConfig.signupUrl}>Start building for free</CtaLink><Link className="m-text-link" href="/pricing">Find your plan</Link></div></section>
    </main>
    <SiteFooter {...siteConfig} showFinalCta={false} hideDocsLink />
  </div>;
}
