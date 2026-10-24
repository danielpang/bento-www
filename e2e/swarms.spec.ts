import { test, expect } from "@playwright/test";

test("scenarios remain accessible and fit desktop and mobile", async ({ page }) => {
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({width, height: 1000});
    await page.goto("/swarms");
    await expect(page.getByRole("heading", {level: 1})).toHaveAccessibleName("Build ambiguous features.");
    const titles = ["Build ambiguous features.", "One-shot the migration.", "Ship the whole initiative."];
    for (const title of titles) {
      await page.getByRole("button", {name: title, exact: true}).click();
      await expect(page.getByRole("heading", {level: 1})).toHaveAccessibleName(title);
      await expect(page.getByRole("button", {name: title, exact: true})).toHaveAttribute("aria-pressed", "true");
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
  }
});

test("automatically rotates and holds a manually selected scenario", async ({ page }) => {
  await page.emulateMedia({reducedMotion: "no-preference"});
  await page.goto("/swarms");
  await expect(page.getByRole("heading", {level: 1})).toHaveAccessibleName("One-shot the migration.", {timeout: 12000});
  await page.clock.install();
  await page.getByRole("button", {name: "Ship the whole initiative.", exact: true}).click();
  await page.clock.fastForward(15000);
  await expect(page.getByRole("heading", {level: 1})).toHaveAccessibleName("Ship the whole initiative.");
});

test("reduced motion keeps the opening scene still and supports keyboard selection", async ({ page }) => {
  await page.clock.install();
  await page.goto("/swarms");
  await page.clock.fastForward(15000);
  await expect(page.getByRole("heading", {level: 1})).toHaveAccessibleName("Build ambiguous features.");
  await page.getByRole("button", {name: "One-shot the migration.", exact: true}).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", {level: 1})).toHaveAccessibleName("One-shot the migration.");
});
