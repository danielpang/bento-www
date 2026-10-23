import { expect, test, type Page } from "@playwright/test";

async function noHorizontalScroll(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
}

test("desktop docs keep a sticky sidebar with the guide's sections", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/docs/web-app");

  const sidebar = page.locator(".docs-nav-panel");
  await expect(sidebar).toBeVisible();
  await expect(page.locator(".docs-nav-menu")).toBeHidden();
  await expect(sidebar.getByRole("link", { name: "Web UI" })).toHaveAttribute("aria-current", "page");
  const sections = sidebar.getByRole("list", { name: "Web UI sections" });
  await expect(sections.getByRole("link", { name: "Troubleshooting" })).toHaveAttribute(
    "href",
    "#troubleshooting",
  );

  // Choosing a section lands its heading below the sticky header and marks it.
  await sections.getByRole("link", { name: "Modes" }).click();
  await expect(page).toHaveURL(/#modes$/);
  const heading = page.locator("#modes");
  await expect
    .poll(async () => (await heading.boundingBox())?.y ?? -1)
    .toBeGreaterThan(76);
  await expect(sections.getByRole("link", { name: "Modes" })).toHaveAttribute("aria-current", "location");

  // Reading further moves the mark; the sidebar stays put.
  const before = await sidebar.boundingBox();
  await page
    .locator("#log-export")
    .evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 100));
  await expect(sections.getByRole("link", { name: "Log export" })).toHaveAttribute("aria-current", "location");
  await expect(sections.getByRole("link", { name: "Modes" })).not.toHaveAttribute("aria-current");
  expect((await sidebar.boundingBox())!.y).toBeCloseTo(before!.y, 0);

  expect(await noHorizontalScroll(page)).toBe(true);
  expect(errors).toEqual([]);
});

test("mobile docs fold the guides and sections into one menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/tui");

  await expect(page.locator(".docs-nav-panel")).toBeHidden();
  const menu = page.locator("details.docs-nav-menu");
  const summary = menu.locator("summary");
  await expect(summary).toContainText("TUI");
  await expect(menu).not.toHaveAttribute("open", "");
  await expect(menu.getByRole("link", { name: "Pipelines" })).toBeHidden();

  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("open", "");
  await expect(menu.getByRole("link", { name: "TUI" })).toHaveAttribute("aria-current", "page");
  const section = menu.getByRole("link", { name: "Set up a project" });
  await expect(section).toBeVisible();
  expect(await noHorizontalScroll(page)).toBe(true);

  await section.click();
  await expect(page).toHaveURL(/#set-up-a-project$/);
  await expect(menu).not.toHaveAttribute("open", "");
  await expect
    .poll(async () => (await page.locator("#set-up-a-project").boundingBox())?.y ?? -1)
    .toBeGreaterThan(66);

  await page.goto("/docs");
  await expect(page.locator("details.docs-nav-menu summary")).toContainText("Overview");
  expect(await noHorizontalScroll(page)).toBe(true);
});
