import { ArrowRight, Laptop, UsersThree } from "@phosphor-icons/react/dist/ssr";
import {
  marketingBoardCaption,
  marketingBoardCaptionMeta,
  marketingPipelineLanes,
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
    <figure className="m-share-compare" aria-label="Laptop-only agents versus a shared remote board">
      <div className="m-share-panel" data-state="local">
        <Laptop size={22} aria-hidden="true" />
        <strong>{marketingShareLocalTitle}</strong>
        <span>{marketingShareLocalBody}</span>
        <ul>
          <li>You</li>
        </ul>
      </div>
      <ArrowRight className="m-share-arrow" size={20} aria-hidden="true" />
      <div className="m-share-panel" data-state="remote">
        <UsersThree size={22} aria-hidden="true" />
        <strong>{marketingShareRemoteTitle}</strong>
        <span>{marketingShareRemoteBody}</span>
        <ul>
          <li>You</li>
          <li>Alex</li>
          <li>Sam</li>
        </ul>
      </div>
    </figure>
  );
}
