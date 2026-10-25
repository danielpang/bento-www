import { test, expect } from "@playwright/test";

test("a three-level feature tree fit desktop and mobile", async ({ page }) => {
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({width, height: 1000});
    await page.goto("/swarms");
    await expect(page.getByRole("img", {name: /A feature tree: Checkout branches/})).toBeVisible();
    await expect(page.locator(".swarm-core")).toHaveText("Checkout");
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

test("features expand from their parents one level at a time", async ({ page }) => {
  await page.emulateMedia({reducedMotion: "no-preference"});
  await page.goto("/swarms");
  const sample = async (time: number) => {
    await page.locator(".swarm-world").evaluate((element, currentTime) => {
      element.getAnimations({subtree: true}).forEach(animation => {
        animation.pause();
        animation.currentTime = currentTime;
      });
    }, time);
  };
  await sample(0);
  await expect(page.locator('[data-node="cart"]')).toHaveCSS("opacity", "0");
  await sample(2600);
  await expect(page.locator('[data-node="cart"]')).toHaveCSS("opacity", "1");
  await expect(page.locator('[data-node="items"]')).toHaveCSS("opacity", "0");
  await sample(5000);
  for (const node of await page.locator(".swarm-agent").all()) {
    await expect(node).toHaveCSS("opacity", "1");
  }
  const edges = await page.locator(".swarm-branch").evaluateAll(elements =>
    elements.map(element => [element.getAttribute("data-parent"), element.getAttribute("data-child")]));
  expect(edges).toEqual([
    ["checkout", "cart"], ["checkout", "payments"],
    ["cart", "items"], ["cart", "totals"],
    ["payments", "cards"], ["payments", "wallets"],
  ]);
  await expect(page.getByRole("heading", {level: 1})).toHaveAccessibleName("One-shot the migration.", {timeout: 12000});
  await expect(page.locator(".swarm-core")).toHaveText("Checkout");
});

test("reduced motion shows the complete static swarm", async ({ page }) => {
  await page.goto("/swarms");
  for (const worker of await page.locator(".swarm-agent").all()) {
    await expect(worker).toHaveCSS("opacity", "1");
    await expect(worker).toHaveCSS("animation-name", "none");
  }
  await expect(page.getByRole("heading", {level: 1})).toHaveAccessibleName("Build ambiguous features.");
});

test("the tree becomes a sixteen-block swarm grid, then restarts", async ({ page }) => {
  await page.emulateMedia({reducedMotion: "no-preference"});
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({width, height: 1000});
    await page.goto("/swarms");
    const sample = async (time: number) => page.locator(".swarm-world").evaluate((world, time) => {
      world.getAnimations({subtree: true}).forEach(animation => {
        animation.pause();
        animation.currentTime = time;
      });
    }, time);
    await sample(5000);
    await expect(page.locator(".swarm-extra").first()).toHaveCSS("opacity", "0");
    const treePosition = await page.locator('[data-node="cart"]').boundingBox();
    await sample(12000);
    const nodes = page.locator(".swarm-agent, .swarm-core, .swarm-extra");
    await expect(nodes).toHaveCount(16);
    const stage = await page.locator(".swarm-stage").boundingBox();
    for (const node of await nodes.all()) {
      await expect(node).toHaveCSS("opacity", "1");
      const box = await node.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      expect(box!.y).toBeGreaterThanOrEqual(stage!.y);
      expect(box!.y + box!.height).toBeLessThanOrEqual(stage!.y + stage!.height);
    }
    expect(await page.locator('[data-node="cart"]').boundingBox()).not.toEqual(treePosition);
    for (const edge of await page.locator(".swarm-branch").all()) {
      await expect(edge).toHaveCSS("opacity", "0");
    }
    await sample(16000);
    await expect(page.locator(".swarm-extra").first()).toHaveCSS("opacity", "0");
    await expect(page.locator(".swarm-core")).toHaveCSS("opacity", "1");
  }
});
