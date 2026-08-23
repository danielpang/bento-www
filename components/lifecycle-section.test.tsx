import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getLifecycleScrollTopForStage,
  getLifecycleStageFromScroll,
  LifecycleSection,
} from "./lifecycle-section";

const motionPreference = vi.hoisted(() => ({
  value: false,
}));

vi.mock("motion/react", async (importOriginal) => {
  const motion = await importOriginal<typeof import("motion/react")>();
  return {
    ...motion,
    useReducedMotion: () => motionPreference.value,
  };
});

describe("LifecycleSection", () => {
  afterEach(() => {
    motionPreference.value = false;
    vi.restoreAllMocks();
  });

  it("explains that the displayed pipeline is configurable", () => {
    render(<LifecycleSection />);

    const heading = screen.getByRole("heading", {
      name: "Every feature has a route.",
    });
    const sectionHeading = heading.closest(".lifecycle-heading");

    expect(sectionHeading).not.toBeNull();
    expect(
      within(sectionHeading as HTMLElement).getByText(
        "This is one example. Define any pipeline you want, with the stages, agents, skills, and rules that fit your team.",
      ),
    ).toBeInTheDocument();
  });

  it("preserves the semantic lifecycle order with sequence markers", () => {
    render(<LifecycleSection />);

    const lifecycle = screen.getByRole("list", {
      name: "Default product lifecycle",
    });
    const names = Array.from(
      lifecycle.querySelectorAll(".lifecycle-stage-name"),
      (name) => name.textContent?.trim(),
    );
    const markers = Array.from(
      lifecycle.querySelectorAll(".lifecycle-step"),
      (marker) => marker.textContent?.trim(),
    );

    expect(names).toEqual([
      "Product investigation",
      "UI/UX design",
      "Engineering requirements",
      "Implementation",
      "Code review",
      "Quality engineering",
    ]);
    expect(markers).toEqual(["01", "02", "03", "04", "05", "06"]);
    expect(lifecycle.querySelector(".lifecycle-connector")).toBeNull();
  });

  it("exposes each stage number as a button that can activate that slide", () => {
    render(<LifecycleSection />);

    const track = screen.getByRole("list", {
      name: "Default product lifecycle",
    });

    expect(
      within(track).getByRole("button", { name: "Implementation" }),
    ).toHaveTextContent("04");
  });

  it("switches to the matching slide when a stage number is activated", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<LifecycleSection />);

    const track = screen.getByRole("list", {
      name: "Default product lifecycle",
    });

    await user.click(within(track).getByText("04"));

    expect(
      within(
        screen.getByRole("group", { name: "Active lifecycle stage" }),
      ).getByText("Build with every prior decision in reach."),
    ).toBeInTheDocument();
    expect(
      within(track).getByRole("button", { name: "Implementation" }),
    ).toHaveAttribute("aria-current", "step");
  });

  it("scrolls the pinned scene to the chosen stage", async () => {
    const user = userEvent.setup();
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const view = render(<LifecycleSection />);
    const section = view.container.querySelector<HTMLElement>(
      ".lifecycle-section",
    );

    if (!section) throw new Error("Lifecycle section was not rendered");

    vi.spyOn(section, "getBoundingClientRect").mockReturnValue({
      bottom: 3000,
      height: 3000,
      left: 0,
      right: 1200,
      top: 0,
      width: 1200,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    vi.spyOn(window, "scrollY", "get").mockReturnValue(0);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(1000);

    const track = screen.getByRole("list", {
      name: "Default product lifecycle",
    });

    await user.click(within(track).getByText("04"));

    expect(scrollTo).toHaveBeenCalledWith({
      behavior: "auto",
      top: 1200,
    });
  });

  it("maps section scroll progress across all six stages", () => {
    expect(
      getLifecycleStageFromScroll({
        sectionHeight: 3000,
        sectionTop: 0,
        stageCount: 6,
        viewportHeight: 1000,
      }),
    ).toBe(0);
    expect(
      getLifecycleStageFromScroll({
        sectionHeight: 3000,
        sectionTop: -800,
        stageCount: 6,
        viewportHeight: 1000,
      }),
    ).toBe(2);
    expect(
      getLifecycleStageFromScroll({
        sectionHeight: 3000,
        sectionTop: -2000,
        stageCount: 6,
        viewportHeight: 1000,
      }),
    ).toBe(5);
  });

  it("maps each stage index back to the matching scroll offset", () => {
    const sectionHeight = 3000;
    const viewportHeight = 1000;

    for (const stageIndex of [0, 2, 5]) {
      const windowScrollY = getLifecycleScrollTopForStage({
        sectionHeight,
        sectionTop: 0,
        stageCount: 6,
        stageIndex,
        viewportHeight,
        windowScrollY: 0,
      });

      expect(
        getLifecycleStageFromScroll({
          sectionHeight,
          sectionTop: -windowScrollY,
          stageCount: 6,
          viewportHeight,
        }),
      ).toBe(stageIndex);
    }
  });

  it("keeps the editorial heading fixed as the route advances", () => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 1;
    });
    const view = render(<LifecycleSection />);
    const section = view.container.querySelector<HTMLElement>(
      ".lifecycle-section",
    );

    if (!section) throw new Error("Lifecycle section was not rendered");

    vi.spyOn(section, "getBoundingClientRect").mockReturnValue({
      bottom: 2200,
      height: 3000,
      left: 0,
      right: 1200,
      top: -800,
      width: 1200,
      x: 0,
      y: -800,
      toJSON: () => ({}),
    });

    fireEvent.scroll(window);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Every feature has a route.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "This is one example. Define any pipeline you want, with the stages, agents, skills, and rules that fit your team.",
      ),
    ).toBeInTheDocument();
    expect(
      within(
        screen.getByRole("group", { name: "Active lifecycle stage" }),
      ).getByText("Turn intent into an executable plan."),
    ).toBeInTheDocument();
    const activeStage = within(
      screen.getByRole("list", { name: "Default product lifecycle" }),
    ).getByRole("button", { name: "Engineering requirements" });

    expect(activeStage).toHaveAttribute("aria-current", "step");
  });

  it("does not hide stage art in short mobile viewports", () => {
    const styles = readFileSync(
      new URL("app/globals.css", `file://${process.cwd()}/`),
      "utf8",
    );

    expect(styles).not.toMatch(
      /\.lifecycle-active-stage \.lifecycle-stage-art\s*\{[^}]*display:\s*none/,
    );
  });

  it("fills the selected lifecycle step marker", () => {
    const styles = readFileSync(
      new URL("app/globals.css", `file://${process.cwd()}/`),
      "utf8",
    );

    expect(styles).toMatch(
      /\.lifecycle-track \.is-active \.lifecycle-step\s*\{[^}]*background:\s*var\(--brand\)/,
    );
    expect(styles).toMatch(
      /\.lifecycle-track \.is-active \.lifecycle-step\s*\{[^}]*color:\s*var\(--on-brand\)/,
    );
  });

  it("uses one pinned stage panel for desktop and mobile", () => {
    const view = render(<LifecycleSection />);

    expect(
      screen.getByRole("list", { name: "Default product lifecycle" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Active lifecycle stage" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("list", { name: "Product lifecycle on mobile" }),
    ).not.toBeInTheDocument();
    expect(
      view.container.querySelectorAll(".lifecycle-active-stage"),
    ).toHaveLength(1);
  });

  it("keeps every stage readable without scroll animation for reduced motion", () => {
    motionPreference.value = true;

    render(<LifecycleSection />);

    const staticRoute = screen.getByRole("list", {
      name: "Complete product lifecycle",
    });

    for (const stage of [
      "Product investigation",
      "UI/UX design",
      "Engineering requirements",
      "Implementation",
      "Code review",
      "Quality engineering",
    ]) {
      expect(within(staticRoute).getByText(stage)).toBeInTheDocument();
    }
  });

  it("removes its scroll listener when unmounted", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const view = render(<LifecycleSection />);

    act(() => view.unmount());

    expect(removeEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
  });
});
