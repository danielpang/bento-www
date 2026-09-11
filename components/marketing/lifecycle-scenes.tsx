import { Cloud } from "@phosphor-icons/react/dist/ssr";
import {
  marketingBoardCaption,
  marketingBoardCaptionMeta,
  marketingPipelineLanes,
  marketingShareRemoteTitle,
  marketingShareSandboxes,
} from "@/lib/copy";

export function TeamBoardScene() {
  return (
    <figure className="m-scene-panel" aria-label="A pipeline board with one card in each stage">
      <figcaption>
        <span>{marketingBoardCaption}</span>
        <span>{marketingBoardCaptionMeta}</span>
      </figcaption>
      <ol className="m-scene-board">
        {marketingPipelineLanes.map((lane, index) => (
          <li className="m-scene-lane" key={lane.stage}>
            <header>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{lane.stage}</strong>
            </header>
            <article className="m-scene-card" data-state={lane.state}>
              <strong>{lane.title}</strong>
              <span>{lane.label}</span>
            </article>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function RemoteShareScene() {
  return (
    <figure className="m-share-diagram" aria-label="Many isolated sandboxes running in the cloud">
      <header className="m-share-cloud-bar">
        <Cloud size={14} weight="regular" aria-hidden="true" />
        <span>cloud</span>
        <code>{marketingShareSandboxes.length} sandboxes</code>
      </header>
      <ol className="m-share-fleet">
        {marketingShareSandboxes.map(sandbox => (
          <li className="m-share-sandbox" data-state={sandbox.state} key={sandbox.title}>
            <header>
              <span>sandbox</span>
              <code>{sandbox.state}</code>
            </header>
            <strong>{sandbox.title}</strong>
            <span>{sandbox.runtime} · {sandbox.stage}</span>
          </li>
        ))}
      </ol>
      <p>{marketingShareRemoteTitle}</p>
    </figure>
  );
}
