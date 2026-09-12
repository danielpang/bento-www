"use client";

import { Pause, Play } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ChangelogVideo } from "@/lib/changelog";

/**
 * A demo recording that behaves like the GIF it replaces: silent, looping,
 * and playing as soon as it is on screen, with one button to stop it.
 *
 * The markup always asks to autoplay so the server and the client agree on
 * it; a reader who prefers reduced motion gets it paused on the first frame
 * once the preference is known.
 */
interface ChangelogVideoFigureProps {
  media: ChangelogVideo;
}

export function ChangelogVideoFigure({ media }: ChangelogVideoFigureProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = video.current;
    if (!node) return;
    // React does not always reflect `muted` into the DOM, and a video that
    // is not muted is never allowed to autoplay.
    node.muted = true;
    if (reducedMotion) node.pause();
    // Autoplay is a request, not a promise: the button has to say what the
    // element is actually doing, not what the markup asked for.
    setPlaying(!node.paused);
  }, [reducedMotion]);

  function toggle() {
    const node = video.current;
    if (!node) return;
    if (node.paused) {
      void node.play();
    } else {
      node.pause();
    }
  }

  return (
    <figure className="changelog-entry-media">
      <video
        aria-label={media.alt}
        autoPlay
        height={media.height}
        loop
        muted
        onClick={toggle}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        playsInline
        poster={media.poster}
        preload="metadata"
        ref={video}
        width={media.width}
      >
        <source src={media.src} type="video/mp4" />
      </video>
      <button
        aria-label={playing ? "Pause the demo" : "Play the demo"}
        className="changelog-entry-media-toggle"
        onClick={toggle}
        type="button"
      >
        {playing ? (
          <Pause aria-hidden="true" size={14} weight="fill" />
        ) : (
          <Play aria-hidden="true" size={14} weight="fill" />
        )}
      </button>
    </figure>
  );
}
