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
      <div className="m-share-endpoint" data-kind="laptop">
        <div className="m-share-laptop" aria-hidden="true">
          <div className="m-share-laptop-lid">
            <div className="m-share-laptop-screen">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="m-share-laptop-hinge" />
          <div className="m-share-laptop-deck">
            <span />
          </div>
        </div>
        <strong>{marketingShareLocalTitle}</strong>
        <span>{marketingShareLocalBody}</span>
      </div>
      <div className="m-share-link" aria-hidden="true">
        <span className="m-share-packet" data-dir="out" />
        <span className="m-share-packet" data-dir="in" />
        <strong>{marketingShareLinkLabel}</strong>
      </div>
      <div className="m-share-endpoint" data-kind="vm">
        <div className="m-share-cloud" aria-hidden="true">
          <svg viewBox="0 0 168 112" fill="none">
            <path
              d="M40 82c-16.5 0-28-12-26.5-25.5C12 46 24 36 39 39c5.5-18 30-27.5 47-15 11-14 36-14.5 47 3 18-7 35 7 33 24 14 2.5 17.5 20 4 28-9 7-98 11.5-130 3z"
              fill="#191410"
              stroke="#805537"
              strokeWidth="1.4"
            />
          </svg>
          <div className="m-share-vm">
            <b />
            <b />
            <b />
          </div>
        </div>
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
