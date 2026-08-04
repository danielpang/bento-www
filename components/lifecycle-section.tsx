import {
  Brain,
  CheckCircle,
  Code,
  GitPullRequest,
  PaintBrush,
  Ruler,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./reveal";

const lifecycle = [
  {
    copy: "Investigate the problem before work begins.",
    icon: Brain,
    name: "Product investigation",
  },
  {
    copy: "Turn findings into a deliberate interaction.",
    icon: PaintBrush,
    name: "UI/UX design",
  },
  {
    copy: "Lock the system shape and acceptance criteria.",
    icon: Ruler,
    name: "Engineering requirements",
  },
  {
    copy: "Build inside the feature's isolated workspace.",
    icon: Code,
    name: "Implementation",
  },
  {
    copy: "Review the branch against every prior decision.",
    icon: GitPullRequest,
    name: "Code review",
  },
  {
    copy: "Prove the feature works before it is done.",
    icon: CheckCircle,
    name: "Quality engineering",
  },
];

export function LifecycleSection() {
  return (
    <section className="section lifecycle-section" id="product">
      <div className="site-shell">
        <Reveal className="section-heading">
          <h2>Every feature has a route.</h2>
          <p>
            Give each stage an agent, a skill, and a clear rule for what
            happens next.
          </p>
        </Reveal>
        <ol aria-label="Default product lifecycle" className="lifecycle-track">
          {lifecycle.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <li key={stage.name}>
                <span className="lifecycle-icon">
                  <Icon aria-hidden="true" size={20} weight="duotone" />
                </span>
                <h3>{stage.name}</h3>
                <p>{stage.copy}</p>
                {index < lifecycle.length - 1 && (
                  <span aria-hidden="true" className="lifecycle-connector" />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
