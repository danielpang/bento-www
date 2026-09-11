import { Cloud, Laptop } from "@phosphor-icons/react/dist/ssr";
import {
  marketingBoardCaption,
  marketingBoardCaptionMeta,
  marketingPipelineLanes,
  marketingShareLinkLabel,
  marketingShareLocalBody,
  marketingShareLocalTitle,
  marketingShareRemoteBody,
  marketingShareRemoteTitle,
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
    <figure className="m-share-diagram" aria-label="A local laptop talking to a cloud VM">
      <div className="m-share-node" data-kind="laptop">
        <Laptop size={22} aria-hidden="true" />
        <strong>{marketingShareLocalTitle}</strong>
        <span>{marketingShareLocalBody}</span>
      </div>
      <div className="m-share-link" aria-hidden="true">
        <span>{marketingShareLinkLabel}</span>
      </div>
      <div className="m-share-node" data-kind="vm">
        <Cloud size={22} aria-hidden="true" />
        <strong>{marketingShareRemoteTitle}</strong>
        <span>{marketingShareRemoteBody}</span>
        <ul>
          <li>Alex</li>
          <li>Sam</li>
        </ul>
      </div>
    </figure>
  );
}
