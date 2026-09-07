import { FileText, FolderOpen } from "@phosphor-icons/react/dist/ssr";

const features = ["Team invitations", "Activity exports"];
const artifacts = ["product-investigation.md", "ui-ux-design.md", "qa-report.md"];

export function FeatureArtifacts() {
  return (
    <figure className="m-feature-artifacts" aria-label="Example artifacts stored separately for each feature">
      <figcaption>Artifacts by feature<span>Example</span></figcaption>
      <ul className="m-feature-folders">
        {features.map(feature => (
          <li key={feature}>
            <div className="m-feature-folder">
              <FolderOpen size={19} aria-hidden="true" />
              <span>{feature}</span>
              <span className="m-artifact-count">3 artifacts</span>
            </div>
            <ul className="m-feature-files" aria-label={`${feature} artifacts`}>
              {artifacts.map(artifact => (
                <li key={artifact}><FileText size={15} aria-hidden="true" /><code>{artifact}</code></li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </figure>
  );
}
