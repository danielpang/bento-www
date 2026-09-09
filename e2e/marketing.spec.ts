import { test, expect } from "@playwright/test";

for (const width of [375, 768, 1024, 1519]) {
  test(`marketing routes fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    const captures: string[] = [];
    page.on("request", request => { if (request.url().includes("posthog.com")) captures.push(request.url()); });
    for (const path of ["/preview/redesign", "/pricing", "/changelog"]) {
      captures.length = 0;
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      if (path === "/preview/redesign") {
        await expect(page.locator('a[href^="/docs"]')).toHaveCount(0);
        if (width > 980) {
          const linear = await page.getByRole("list", { name: "Linear integration flow" }).boundingBox();
          const slack = await page.getByRole("list", { name: "Slack integration flow" }).boundingBox();
          expect(Math.abs(linear!.y - slack!.y)).toBeLessThan(1);
          const linearCta = await page.getByRole("link", { name: "Sign up to connect Linear" }).boundingBox();
          const slackCta = await page.getByRole("link", { name: "Add to Slack" }).boundingBox();
          expect(Math.abs(linearCta!.y - slackCta!.y)).toBeLessThan(1);
        }
        if (width > 800) {
          const heading = await page.locator(".hero-copy").boundingBox();
          const workflow = await page.locator(".m-demo").boundingBox();
          expect(workflow!.x).toBeGreaterThan(heading!.x + heading!.width);
          expect(Math.abs(workflow!.y - heading!.y)).toBeLessThan(120);
          const h1Height = await page.locator("h1").evaluate(e => e.clientHeight / parseFloat(getComputedStyle(e).lineHeight));
          expect(h1Height).toBeLessThan(2.1);
          await page.getByRole("button", { name: "Pause pipeline animation" }).click();
          await expect(page.getByRole("button", { name: "Play pipeline animation" })).toBeVisible();
        } else {
          await page.getByLabel("Navigation menu").click();
          await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
          await page.getByLabel("Navigation menu").click();
        }
      }
      await page.screenshot({ path: `test-results/${path.replaceAll("/", "-")}-${width}.png`, fullPage: true });
      // Previews never load analytics. Public pages record pageviews when NEXT_PUBLIC_POSTHOG_KEY is set.
      if (path.startsWith("/preview")) expect(captures).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}

test("control preview preserves the current homepage", async ({ page }) => {
  await page.goto("/preview/control");
  await expect(page.locator("h1")).toContainText("Automate your software");
  await expect(page.locator('[data-marketing-variant="control"]')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
});

test("stage examples are selectable without changing the section height", async ({ page }) => {
  await page.goto("/preview/redesign");
  const showcase = page.locator(".m-stage-showcase");
  await showcase.scrollIntoViewIfNeeded();
  const height = (await showcase.boundingBox())!.height;
  for (const stage of ["PM", "Product design", "Tech exploration", "Implementation", "QA", "DevOps"]) {
    await page.getByRole("button", { name: stage, exact: true }).click();
    await expect(page.locator('.m-skill-example[data-active="true"]')).toContainText(stage);
    expect((await showcase.boundingBox())!.height).toBe(height);
  }
  await expect(page.locator("#how-it-works")).toContainText("The context goes with the code.");
});

test("visible stage examples advance automatically", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("console", message => {
    if (message.type() === "error" && /hydrat/i.test(message.text())) hydrationErrors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/preview/redesign");
  await page.locator(".m-stage-showcase").scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(page.getByRole("button", { name: "Product design", exact: true })).toHaveAttribute("aria-pressed", "true", { timeout: 10000 });
  await page.getByRole("button", { name: "Pause stage examples" }).click();
  await page.mouse.move(0, 0);
  await expect(page.getByRole("button", { name: "Play stage examples" })).toBeVisible();
  await page.clock.install();
  await page.clock.fastForward(12000);
  expect(hydrationErrors).toEqual([]);
  await expect(page.getByRole("button", { name: "Product design", exact: true })).toHaveAttribute("aria-pressed", "true");
});
