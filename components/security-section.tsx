import {
  Key,
  LockKey,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./reveal";

const boundaries = [
  {
    copy: "Agents receive isolated worktrees, never host SSH keys or host git configuration.",
    icon: ShieldCheck,
    title: "Isolated workspaces",
  },
  {
    copy: "The server narrows short-lived GitHub tokens to the repository being published.",
    icon: Key,
    title: "Scoped publishing",
  },
  {
    copy: "Organization credentials are encrypted at rest and resolved only for the owning run.",
    icon: LockKey,
    title: "Encrypted credentials",
  },
];

export function SecuritySection() {
  return (
    <section className="section security-section" id="security">
      <div className="site-shell security-layout">
        <Reveal className="security-intro">
          <span className="section-eyebrow">Security model</span>
          <h2>The sandbox is the boundary.</h2>
          <p>
            Agent work stays inside a per-feature environment. Trusted
            services keep the credentials and publish the result.
          </p>
          <code>one card / one branch / one sandbox</code>
        </Reveal>

        <div className="boundary-list">
          {boundaries.map((boundary, index) => {
            const Icon = boundary.icon;
            return (
              <Reveal
                className="boundary-row"
                delay={index * 0.06}
                key={boundary.title}
              >
                <Icon aria-hidden="true" size={24} weight="duotone" />
                <div>
                  <h3>{boundary.title}</h3>
                  <p>{boundary.copy}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="deployment-note">
          <strong>Run it your way.</strong>
          <span>
            Self-host with Docker, or share the board while code and
            agents stay on your runner.
          </span>
        </Reveal>
      </div>
    </section>
  );
}
