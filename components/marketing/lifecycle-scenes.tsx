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
      <div className="m-share-art-wrap">
      <svg className="m-share-art" viewBox="0 0 720 248" role="img">
        <title>A user on a local laptop talking to a cloud VM</title>
        <defs>
          <linearGradient id="m-share-lid" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2a2a2e" />
            <stop offset="100%" stopColor="#1a1a1d" />
          </linearGradient>
          <linearGradient id="m-share-deck" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3a3734" />
            <stop offset="100%" stopColor="#1c1b1a" />
          </linearGradient>
        </defs>
        <g>
          <circle cx="118" cy="36" r="14" fill="#2a221c" stroke="#805537" strokeWidth="1.4" />
          <path
            d="M94 76c4-18 16-26 24-26s20 8 24 26"
            fill="#1a1613"
            stroke="#805537"
            strokeWidth="1.4"
          />
          <rect x="48" y="72" width="168" height="92" rx="8" fill="url(#m-share-lid)" stroke="#3a332f" />
          <rect x="60" y="84" width="144" height="68" rx="3" fill="#0d0d0f" />
          <path d="M72 100h32" stroke="#ff9858" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M72 110h86" stroke="#4a3d34" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M72 120h64" stroke="#4a3d34" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M72 130h78" stroke="#4a3d34" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M32 168h200l12 16H20z" fill="url(#m-share-deck)" />
          <rect x="116" y="172" width="36" height="4" rx="2" fill="#2f2b28" />
        </g>
        <g>
          <path d="M236 128h176" stroke="#805537" strokeWidth="1.5" strokeDasharray="6 6" />
          <path d="M404 128l12-6v12z" fill="#ff9858" />
          <path d="M244 128l-12-6v12z" fill="#ff9858" />
          <circle cx="286" cy="128" r="3.5" fill="#ff9858" />
          <circle cx="348" cy="128" r="3.5" fill="#ff9858" />
        </g>
        <g>
          <path
            d="M458 178c-30 0-52-18-50-42-4-20 14-36 38-32 10-28 48-42 74-20 18-22 58-22 74 8 28-12 56 10 50 36 22 4 28 30 6 44-14 12-154 18-192 6z"
            fill="#191410"
            stroke="#805537"
            strokeWidth="1.6"
          />
          <rect x="528" y="116" width="78" height="50" rx="5" fill="#1a1410" stroke="#805537" />
          <path d="M540 128h40" stroke="#ff9858" strokeWidth="2" strokeLinecap="round" />
          <path d="M540 136h54" stroke="#4a3d34" strokeWidth="2" strokeLinecap="round" />
          <path d="M540 144h32" stroke="#4a3d34" strokeWidth="2" strokeLinecap="round" />
          <circle cx="590" cy="154" r="3" fill="#ff9858" />
        </g>
      </svg>
      <span className="m-share-session">{marketingShareLinkLabel}</span>
      </div>
      <div className="m-share-legend">
        <div>
          <strong>{marketingShareLocalTitle}</strong>
          <span>{marketingShareLocalBody}</span>
        </div>
        <div>
          <strong>{marketingShareRemoteTitle}</strong>
          <span>{marketingShareRemoteBody}</span>
          <ul>
            <li>Alex</li>
            <li>Sam</li>
          </ul>
        </div>
      </div>
    </figure>
  );
}
