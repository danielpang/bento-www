import Link from "next/link";
import { ArrowRight, FileText, GitBranch, Laptop, TerminalWindow, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { AgentLogo, type AgentName } from "@/components/agent-logo";
import dynamic from "next/dynamic";
import { CtaLink } from "@/components/cta-link";
import { InstallCommand } from "@/components/install-command";
import { IntegrationsSection } from "@/components/integrations-section";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { MarketingHeader } from "./header";
import { FeatureArtifacts } from "./feature-artifacts";
import { MarketingFaq } from "./faq-section";
import { RemoteShareScene, TeamBoardScene } from "./lifecycle-scenes";
import { SecurityBento } from "./security-bento";
import {
  marketingAgentsLabel,
  marketingHomeHeadlineLines,
  marketingHomePromise,
  marketingProblemBeats,
  marketingProblemHeading,
  marketingProblemLead,
} from "@/lib/copy";
import { siteConfig } from "@/lib/site";
// The animated demos carry the motion library. They are server-rendered as
// usual but hydrate from their own chunks, so the page's initial script graph
// is the framework plus a few small islands.
const PipelineDemo = dynamic(() => import("@/components/pipeline-demo").then(m => m.PipelineDemo));
const SkillExamples = dynamic(() => import("./skill-examples").then(m => m.SkillExamples));
const agents: AgentName[] = ["Claude Code", "Codex CLI", "Cursor CLI", "Antigravity", "DeepSeek", "OpenCode", "Pi", "Poolside"];
export function MarketingHome() {
  return <div className="marketing-page">
    <MarketingHeader />
    <main id="main-content">
      <div className="m-above-fold">
        <section className="m-hero site-shell">
          <Link className="m-announcement" href="/changelog">See what’s new <ArrowRight size={14} aria-hidden="true" /></Link>
          <div className="m-hero-heading">
            <div className="hero-copy">
              <h1>{marketingHomeHeadlineLines[0]}{" "}<br /><span>{marketingHomeHeadlineLines[1]}</span></h1>
              <p>{marketingHomePromise}</p>
              <div className="hero-actions">
                <CtaLink href={siteConfig.signupUrl}>Start building for free</CtaLink>
                <CtaLink href="/download" variant="secondary">Download for Mac</CtaLink>
              </div>
              <InstallCommand />
            </div>
            <div className="m-demo hero-visual" id="product">
              <div className="m-demo-caption"><span><TerminalWindow size={16} aria-hidden="true" /> A feature, moving forward.</span><span>Interactive pipeline demo</span></div>
              <PipelineDemo />
            </div>
          </div>
        </section>
        <section className="site-shell m-agents" aria-label="Supported coding agents">
          <p>{marketingAgentsLabel}</p>
          <div>{agents.map(agent => <span className="m-agent" key={agent}><AgentLogo agent={agent} className="agent-logo" /><span>{agent.replace(" CLI", "")}</span></span>)}</div>
        </section>
      </div>
      <section className="m-section site-shell m-context">
        <Reveal className="m-section-heading">
          <h2>{marketingProblemHeading}</h2>
          <p>{marketingProblemLead}</p>
        </Reveal>
        <Reveal className="m-stage-showcase">
          <div className="m-stage-intro">
            <UsersThree size={25} aria-hidden="true" />
            <h3>{marketingProblemBeats[0].title}</h3>
            <p>{marketingProblemBeats[0].body}</p>
          </div>
          <TeamBoardScene />
        </Reveal>
        <Reveal className="m-stage-showcase m-skill-showcase">
          <div className="m-stage-intro">
            <FileText size={25} aria-hidden="true" />
            <h3>{marketingProblemBeats[1].title}</h3>
            <p>{marketingProblemBeats[1].body}</p>
          </div>
          <SkillExamples />
        </Reveal>
        <Reveal className="m-stage-showcase">
          <div className="m-stage-intro">
            <Laptop size={25} aria-hidden="true" />
            <h3>{marketingProblemBeats[2].title}</h3>
            <p>{marketingProblemBeats[2].body}</p>
          </div>
          <RemoteShareScene />
        </Reveal>
        <Reveal className="m-context-handoff">
          <div>
            <GitBranch size={25} aria-hidden="true" />
            <h3>The context goes with the code.</h3>
            <p>Each feature keeps its own plans, designs, and review artifacts. Stage write-ups are committed alongside the code, so the next agent starts with what the last one learned.</p>
          </div>
          <FeatureArtifacts />
        </Reveal>
      </section>
      <SecurityBento />
      <IntegrationsSection redesigned />
      <MarketingFaq />
    </main>
    <SiteFooter {...siteConfig} showFinalCta={false} />
  </div>;
}
