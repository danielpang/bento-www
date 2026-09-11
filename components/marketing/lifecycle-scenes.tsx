import { Cloud } from "@phosphor-icons/react/dist/ssr";
import {
  marketingBoardCaption,
  marketingBoardCaptionMeta,
  marketingPipelineLanes,
  marketingShareLinkLabel,
  marketingShareLocalBody,
  marketingShareLocalTitle,
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
      <div className="m-share-window" data-kind="local">
        <header>
          <span>{marketingShareLocalTitle}</span>
          <code>console</code>
        </header>
        <article className="m-share-card">
          <span>Implementation</span>
          <strong>Checkout recovery</strong>
          <em>agent working</em>
          <p>{marketingShareLocalBody}</p>
        </article>
      </div>
      <div className="m-share-link" aria-hidden="true">
        <span>{marketingShareLinkLabel}</span>
      </div>
      <div className="m-share-cloud">
        <header className="m-share-cloud-bar">
          <Cloud size={14} weight="regular" aria-hidden="true" />
          <span>cloud</span>
          <code>isolated</code>
        </header>
        <div className="m-share-window" data-kind="guest">
          <header>
            <span>sandbox</span>
            <code>running</code>
          </header>
          <dl className="m-share-meta">
            <div>
              <dt>runtime</dt>
              <dd>docker</dd>
            </div>
            <div>
              <dt>workspace</dt>
              <dd>worktree</dd>
            </div>
            <div>
              <dt>card</dt>
              <dd>Checkout recovery</dd>
            </div>
          </dl>
        </div>
        <p>{marketingShareRemoteTitle}</p>
      </div>
    </figure>
  );
}
