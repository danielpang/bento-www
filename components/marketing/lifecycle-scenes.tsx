import { ArrowRight, Laptop, UsersThree } from "@phosphor-icons/react/dist/ssr";
import {
  marketingBoardCaption,
  marketingBoardCaptionMeta,
  marketingBoardSessions,
  marketingShareLocalBody,
  marketingShareLocalTitle,
  marketingShareRemoteBody,
  marketingShareRemoteTitle,
} from "@/lib/copy";

export function TeamBoardScene() {
  return (
    <figure className="m-scene-panel" aria-label="A shared board of agent sessions the team can view">
      <figcaption>
        <span>{marketingBoardCaption}</span>
        <span>{marketingBoardCaptionMeta}</span>
      </figcaption>
      <ul className="m-scene-sessions">
        {marketingBoardSessions.map((session) => (
          <li className="m-scene-session" data-state={session.state} key={session.title}>
            <span className="m-scene-session-label">{session.label}</span>
            <strong>{session.title}</strong>
            <span className="m-scene-session-viewers">
              <UsersThree size={14} aria-hidden="true" />
              {session.viewers}
            </span>
          </li>
        ))}
      </ul>
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
