import { expect, test } from "@playwright/test";

test("homepage and mobile navigation expose Mac downloads", async ({ page }) => {
  await page.goto("/");
  await page.locator(".hero-actions").getByRole("link", { name: "Download for Mac" }).click();
  await expect(page).toHaveURL(/\/download$/);
  await expect(page.getByRole("heading", { name: "Bento for Mac." })).toBeVisible();
  await page.setViewportSize({ width: 375, height: 900 });
  await page.getByLabel("Navigation menu").click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Download", exact: true })).toHaveAttribute("href", "/download");
});

test("download choices and chip help fit mobile and desktop in both themes", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/download");
      await expect(page.getByRole("heading", { name: "Apple silicon", exact: true })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Intel", exact: true })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Which chip does my Mac have?" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Open Bento in your browser" })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await page.screenshot({ path: `test-results/download-${colorScheme}-${width}.png`, fullPage: true });
    }
  }
  expect(errors).toEqual([]);
});

test("Safari-style legacy Intel identifiers never imply an Intel chip", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "userAgentData", { value: undefined });
    Object.defineProperty(navigator, "platform", { value: "MacIntel" });
    Object.defineProperty(navigator, "userAgent", { value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Version/18.0 Safari/605.1.15" });
  });
  await page.goto("/download");
  await expect(page.locator(".mac-download-hint")).toContainText("Choose the version that matches your Mac");
  await expect(page.locator(".mac-download-hint")).not.toContainText("suggests Intel");
});

test("an explicit browser architecture is a suggestion with both choices retained", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "userAgentData", { value: {
      platform: "macOS", mobile: false,
      getHighEntropyValues: async () => ({ architecture: "arm", bitness: "64" }),
    } });
  });
  await page.goto("/download");
  await expect(page.locator(".mac-download-hint")).toContainText("Your browser suggests Apple silicon");
  await expect(page.getByRole("heading", { name: "Intel", exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/download$/);
});

test("stable download routes either resolve a real DMG or explain availability", async ({ request, page }) => {
  for (const arch of ["arm64", "x64"]) {
    const response = await request.get(`/download/mac/${arch}`, { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers()["cache-control"]).toBe("no-store");
    const destination = response.headers().location;
    if (destination.includes("github.com")) {
      expect(destination).toMatch(new RegExp(`^https://github.com/danielpang/bento/releases/download/v?\\d+\\.\\d+\\.\\d+/Bento-\\d+\\.\\d+\\.\\d+-${arch}\\.dmg$`));
      const asset = await request.head(destination);
      expect(asset.ok()).toBe(true);
    } else {
      expect(destination).toMatch(/\/download\?download=(unavailable|retry)$/);
      await page.goto(destination);
      await expect(page.getByRole("status")).toBeVisible();
    }
  }
  expect((await request.get("/download/mac/universal")).status()).toBe(404);
});
