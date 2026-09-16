import { expect, test } from "@playwright/test";

const guides = [
  "/docs/tui",
  "/docs/web-app",
  "/docs/pipeline",
  "/docs/agents",
  "/docs/clients",
  "/docs/concepts",
];

test("docs pages put a copy control on the right of every fenced command", async ({ page }) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);

  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of guides) {
      await page.goto(path);
      const blocks = page.locator(".docs-body .docs-code");
      const count = await blocks.count();
      expect(count, path).toBeGreaterThan(0);
      for (let index = 0; index < count; index += 1) {
        const block = blocks.nth(index);
        const button = block.getByRole("button", { name: "Copy command" });
        await expect(button).toBeVisible();
        const preBox = await block.locator("pre").boundingBox();
        const buttonBox = await button.boundingBox();
        const blockBox = await block.boundingBox();
        expect(preBox).not.toBeNull();
        expect(buttonBox).not.toBeNull();
        expect(blockBox).not.toBeNull();
        expect(buttonBox!.x).toBeGreaterThan(preBox!.x);
        expect(blockBox!.x + blockBox!.width - (buttonBox!.x + buttonBox!.width)).toBeLessThan(20);
        if (width === 375) {
          expect(
            await block.locator("pre").evaluate((el) => el.scrollWidth <= el.clientWidth + 2),
          ).toBe(true);
        }
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  }
});

test("copying a TUI command writes it to the clipboard", async ({ page }) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/docs/tui");

  const first = page.locator(".docs-body .docs-code").first();
  await expect(first).toContainText("curl -fsSL https://usebento.ai/install.sh | sh");
  await first.getByRole("button", { name: "Copy command" }).click();
  await expect(first.getByRole("button", { name: "Copied command" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "curl -fsSL https://usebento.ai/install.sh | sh",
  );
});
