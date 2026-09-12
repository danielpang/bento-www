import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ChangelogVideo } from "@/lib/changelog";
import { ChangelogVideoFigure } from "./changelog-video";

const motionPreference = vi.hoisted(() => ({ value: null as boolean | null }));

vi.mock("motion/react", async (importOriginal) => {
  const motion = await importOriginal<typeof import("motion/react")>();
  return { ...motion, useReducedMotion: () => motionPreference.value };
});

const media: ChangelogVideo = {
  type: "video",
  src: "/changelog/demo.mp4",
  alt: "A screen recording of the demo",
  width: 1716,
  height: 964,
};

// jsdom has no media pipeline, so playback is stubbed and the element's own
// paused state is driven by hand.
function stubPlayback(video: HTMLVideoElement) {
  // jsdom never autoplays, so the element starts where jsdom leaves it.
  let paused = true;
  Object.defineProperty(video, "paused", { get: () => paused, configurable: true });
  video.play = vi.fn(async () => {
    paused = false;
    video.dispatchEvent(new Event("play"));
  });
  video.pause = vi.fn(() => {
    paused = true;
    video.dispatchEvent(new Event("pause"));
  });
  return video;
}

describe("ChangelogVideoFigure", () => {
  beforeEach(() => {
    motionPreference.value = null;
  });

  it("autoplays silently on a loop, so it reads as a moving screenshot", () => {
    const { container } = render(<ChangelogVideoFigure media={media} />);
    const video = container.querySelector("video") as HTMLVideoElement;

    expect(video).toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");
    expect(video).not.toHaveAttribute("controls");
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute("aria-label", media.alt);
    expect(container.querySelector("source")).toHaveAttribute("src", media.src);
  });

  it("shows elapsed time and progress, and seeks when the scrubber moves", async () => {
    const { container } = render(<ChangelogVideoFigure media={media} />);
    const video = container.querySelector("video") as HTMLVideoElement;

    Object.defineProperty(video, "duration", { value: 33.4, configurable: true });
    let currentTime = 0;
    Object.defineProperty(video, "currentTime", {
      get: () => currentTime,
      set: (value) => { currentTime = value; },
      configurable: true,
    });

    fireEvent.loadedMetadata(video);
    fireEvent.timeUpdate(video, { target: { currentTime: 67 } });
    expect(screen.getByText("1:07")).toBeInTheDocument();

    const scrubber = screen.getByRole("slider", { name: "Seek" });
    expect(scrubber).toHaveAttribute("max", "33.4");
    fireEvent.change(scrubber, { target: { value: "12" } });
    expect(video.currentTime).toBe(12);
    expect(screen.getByText("0:12")).toBeInTheDocument();
  });

  it("asks for full screen on the figure, so the controls come along", async () => {
    const user = userEvent.setup();
    const requestFullscreen = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "requestFullscreen", {
      value: requestFullscreen,
      configurable: true,
      writable: true,
    });
    const { container } = render(<ChangelogVideoFigure media={media} />);

    await user.click(screen.getByRole("button", { name: "Play full screen" }));
    expect(requestFullscreen).toHaveBeenCalled();
    expect(requestFullscreen.mock.instances[0]).toBe(
      container.querySelector(".changelog-entry-media"),
    );
  });

  it("toggles between pausing and playing from the one button", async () => {
    const user = userEvent.setup();
    const { container } = render(<ChangelogVideoFigure media={media} />);
    const video = stubPlayback(container.querySelector("video") as HTMLVideoElement);
    // jsdom never starts playback, so play it first to reach the pause label.
    await user.click(screen.getByRole("button", { name: "Play the demo" }));
    expect(video.play).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Pause the demo" }));
    expect(video.pause).toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Play the demo" }),
    ).toBeInTheDocument();
  });

  it("holds still for a reader who asked for reduced motion", () => {
    const pause = vi.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    motionPreference.value = true;
    render(<ChangelogVideoFigure media={media} />);

    expect(pause).toHaveBeenCalled();
    pause.mockRestore();
  });

  it("leaves the recording running for everyone else", () => {
    const pause = vi.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    motionPreference.value = false;
    render(<ChangelogVideoFigure media={media} />);

    expect(pause).not.toHaveBeenCalled();
    pause.mockRestore();
  });
});
