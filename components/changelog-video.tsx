"use client";

import { CornersIn, CornersOut, Pause, Play } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangelogVideo } from "@/lib/changelog";

/**
 * A demo recording that behaves like the GIF it replaces: silent, looping,
 * and playing as soon as it is on screen, with a control bar over it for
 * anyone who wants to stop, scrub, or fill the screen with it.
 *
 * The markup always asks to autoplay so the server and the client agree on
 * it; a reader who prefers reduced motion gets it paused on the first frame
 * once the preference is known.
 */
interface ChangelogVideoFigureProps {
  media: ChangelogVideo;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

export function ChangelogVideoFigure({ media }: ChangelogVideoFigureProps) {
  const figure = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = video.current;
    if (!node) return;
    // React does not always reflect `muted` into the DOM, and a video that
    // is not muted is never allowed to autoplay.
    node.muted = true;
    if (reducedMotion) node.pause();
    // Autoplay is a request, not a promise: the controls have to say what
    // the element is actually doing, not what the markup asked for.
    setPlaying(!node.paused);
    if (Number.isFinite(node.duration)) setDuration(node.duration);
  }, [reducedMotion]);

  useEffect(() => {
    function onFullscreenChange() {
      setFullscreen(document.fullscreenElement === figure.current);
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggle = useCallback(() => {
    const node = video.current;
    if (!node) return;
    if (node.paused) {
      void node.play();
    } else {
      node.pause();
    }
  }, []);

  function seek(seconds: number) {
    const node = video.current;
    if (!node) return;
    node.currentTime = seconds;
    setCurrentTime(seconds);
  }

  function toggleFullscreen() {
    const node = figure.current;
    if (!node) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void node.requestFullscreen?.();
    }
  }

  // An unknown duration would divide by zero and leave the scrubber stuck.
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <figure className="changelog-entry-media" ref={figure}>
      <video
        aria-label={media.alt}
        autoPlay
        height={media.height}
        loop
        muted
        onClick={toggle}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        playsInline
        poster={media.poster}
        preload="metadata"
        ref={video}
        width={media.width}
      >
        <source src={media.src} type="video/mp4" />
      </video>
      <div className="changelog-entry-media-controls">
        <span className="changelog-entry-media-time">
          {formatTime(currentTime)}
        </span>
        <input
          aria-label="Seek"
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          className="changelog-entry-media-scrubber"
          max={duration || 0}
          min={0}
          onChange={(event) => seek(Number(event.target.value))}
          step={0.1}
          style={{ "--progress": `${progress}%` } as React.CSSProperties}
          type="range"
          value={currentTime}
        />
        <button
          aria-label={playing ? "Pause the demo" : "Play the demo"}
          className="changelog-entry-media-button"
          onClick={toggle}
          type="button"
        >
          {playing ? (
            <Pause aria-hidden="true" size={15} weight="fill" />
          ) : (
            <Play aria-hidden="true" size={15} weight="fill" />
          )}
        </button>
        <button
          aria-label={fullscreen ? "Exit full screen" : "Play full screen"}
          className="changelog-entry-media-button"
          onClick={toggleFullscreen}
          type="button"
        >
          {fullscreen ? (
            <CornersIn aria-hidden="true" size={15} />
          ) : (
            <CornersOut aria-hidden="true" size={15} />
          )}
        </button>
      </div>
    </figure>
  );
}
