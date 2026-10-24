import { test, expect } from "@playwright/test";

test("one planner and six workers fit desktop and mobile", async ({ page }) => {
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({width, height: 1000});
    await page.goto("/swarms");
    await expect(page.getByRole("img", {name: /planner agent spawns six worker agents/})).toBeVisible();
    await expect(page.locator(".swarm-core")).toHaveText("Planner");
    await expect(page.locator(".swarm-agent")).toHaveCount(6);
    await expect(page.locator(".swarm-controls")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const stage = await page.locator(".swarm-stage").boundingBox();
    for (const card of await page.locator(".swarm-agent, .swarm-core").all()) {
      const box = await card.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      expect(box!.y).toBeGreaterThanOrEqual(stage!.y);
      expect(box!.y + box!.height).toBeLessThanOrEqual(stage!.y + stage!.height);
    }
  }
});

test("workers spawn out of the planner while headlines rotate independently", async ({ page }) => {
  await page.emulateMedia({reducedMotion: "no-preference"});
  await page.goto("/swarms");
  const worker = page.locator(".swarm-agent").first();
  const sample = async (time: number) => worker.evaluate((element, currentTime) => {
    const animation = element.getAnimations().find(item => (item as CSSAnimation).animationName === "swarm-spawn")!;
    animation.pause();
    animation.currentTime = currentTime;
    return {opacity: getComputedStyle(element).opacity, transform: getComputedStyle(element).transform};
  }, time);
  const initial = await sample(0);
  const spawned = await sample(3000);
  expect(initial.opacity).toBe("0");
  expect(spawned.opacity).toBe("1");
  expect(spawned.transform).not.toBe(initial.transform);
  await expect(page.getByRole("heading", {level: 1})).toHaveAccessibleName("One-shot the migration.", {timeout: 12000});
  await expect(page.locator(".swarm-core")).toHaveText("Planner");
  await expect(page.locator(".swarm-agent")).toHaveCount(6);
});

test("reduced motion shows the complete static swarm", async ({ page }) => {
  await page.goto("/swarms");
  for (const worker of await page.locator(".swarm-agent").all()) {
    await expect(worker).toHaveCSS("opacity", "1");
    await expect(worker).toHaveCSS("animation-name", "none");
  }
  await expect(page.getByRole("heading", {level: 1})).toHaveAccessibleName("Build ambiguous features.");
});
