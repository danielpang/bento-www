import { test, expect, type Page } from "@playwright/test";

async function pageColors(page: Page) {
  return page.evaluate(() => ({
    html: getComputedStyle(document.documentElement).backgroundColor,
    body: getComputedStyle(document.body).backgroundColor,
    scheme: getComputedStyle(document.documentElement).colorScheme,
    brand: getComputedStyle(document.documentElement).getPropertyValue("--brand").trim(),
    text: getComputedStyle(document.body).color,
  }));
}

for (const width of [375, 768, 1024, 1519]) {
  test(`marketing routes fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const path of ["/", "/pricing", "/changelog"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      if (path === "/") {
        await expect(page.getByRole("contentinfo").getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
        if (width > 800) {
          await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Docs" })).toBeVisible();
        }
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
          const agentsBottom = await page.locator(".m-agents").evaluate(element => element.getBoundingClientRect().bottom);
          const contextTop = await page.locator(".m-context").evaluate(element => element.getBoundingClientRect().top);
          const viewportHeight = await page.evaluate(() => window.innerHeight);
          expect(agentsBottom).toBeLessThanOrEqual(viewportHeight + 1);
          expect(contextTop).toBeGreaterThanOrEqual(viewportHeight);
          await page.getByRole("button", { name: "Pause pipeline animation" }).click();
          await expect(page.getByRole("button", { name: "Play pipeline animation" })).toBeVisible();
        } else {
          await page.getByLabel("Navigation menu").click();
          await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
          await page.getByLabel("Navigation menu").click();
        }
      }
      await page.screenshot({ path: `test-results/${path.replaceAll("/", "-")}-${width}.png`, fullPage: true });
    }
    expect(errors).toEqual([]);
  });
}

test("the homepage copies the CLI install command from under the signup CTA", async ({ page }) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const install = page.locator(".hero-copy .install-command");
    await expect(install).toContainText("curl -fsSL https://usebento.ai/install.sh | sh");
    const cta = await page.locator(".hero-copy .hero-actions").boundingBox();
    const box = await install.boundingBox();
    expect(box!.y).toBeGreaterThanOrEqual(cta!.y + cta!.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await install.getByRole("button", { name: "Copy install command" }).click();
    await expect(install.getByRole("button", { name: "Copied install command" })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("curl -fsSL https://usebento.ai/install.sh | sh");
    await page.locator(".hero-copy").screenshot({ path: `test-results/install-home-${width}.png` });
  }
});

test("the homepage follows the device color scheme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  expect(await pageColors(page)).toMatchObject({
    html: "rgb(11, 11, 12)",
    body: "rgb(11, 11, 12)",
    scheme: "dark",
    brand: "#ff9858",
    text: "rgb(237, 237, 238)",
  });

  await page.emulateMedia({ colorScheme: "light" });
  await page.reload();
  expect(await pageColors(page)).toMatchObject({
    html: "rgb(255, 255, 255)",
    body: "rgb(255, 255, 255)",
    scheme: "light",
    brand: "#c24e16",
    text: "rgb(23, 23, 26)",
  });
});

test("pricing and docs follow the same device color scheme", async ({ page }) => {
  for (const path of ["/pricing", "/docs"]) {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto(path);
    expect(await pageColors(page)).toMatchObject({
      html: "rgb(255, 255, 255)",
      body: "rgb(255, 255, 255)",
      scheme: "light",
    });

    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload();
    expect(await pageColors(page)).toMatchObject({
      html: "rgb(11, 11, 12)",
      body: "rgb(11, 11, 12)",
      scheme: "dark",
    });
  }
});

test("team board cards line up on desktop", async ({ page }) => {
  for (const width of [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const cards = page
      .getByRole("figure", { name: "A pipeline board with one card in each stage" })
      .locator(".m-scene-card");
    await expect(cards).toHaveCount(6);

    const tops = await cards.evaluateAll(elements =>
      elements.map(element => element.getBoundingClientRect().top),
    );
    expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(1);
  }
});

test("the homepage ends with a responsive FAQ", async ({ page }) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const faq = page.getByRole("region", { name: "Questions?" });
    const items = faq.locator(".marketing-faq-item");
    await expect(faq).toBeVisible();
    const brandColor = await page.evaluate(() => {
      const probe = document.createElement("span");
      probe.style.color = "var(--brand)";
      document.body.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    });
    await expect(faq.locator(".marketing-faq-eyebrow")).toHaveCSS("color", brandColor);
    await expect(items).toHaveCount(4);
    for (const item of await items.all()) {
      await expect(item).not.toHaveAttribute("open", "");
    }

    await items.nth(1).locator("summary").click();
    await expect(items.nth(1)).toHaveAttribute("open", "");
    await items.nth(1).locator("summary").click();
    await expect(items.nth(1)).not.toHaveAttribute("open", "");

    await expect(page.locator(".final-cta, .m-bottom-cta")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test("stage examples are selectable without changing the section height", async ({ page }) => {
  await page.goto("/");
  const showcase = page.locator(".m-skill-showcase");
  await showcase.scrollIntoViewIfNeeded();
  const height = (await showcase.boundingBox())!.height;
  for (const stage of ["PM", "Product design", "Tech exploration", "Implementation", "QA", "DevOps"]) {
    await page.getByRole("button", { name: stage, exact: true }).click();
    await expect(page.locator('.m-skill-example[data-active="true"]')).toContainText(stage);
    expect((await showcase.boundingBox())!.height).toBe(height);
  }
  await expect(page.locator(".m-context-handoff")).toContainText("The context goes with the code.");
});

test("visible stage examples advance automatically", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("console", message => {
    if (message.type() === "error" && /hydrat/i.test(message.text())) hydrationErrors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.locator(".m-skill-showcase").scrollIntoViewIfNeeded();
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

test("docs diagram keeps a stable height as the card enters occupied stages", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/docs/concepts");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Documentation" })).toHaveCount(0);

  const figure = page.locator(".pipeline-flow");
  await expect(figure).toBeVisible();
  const start = await figure.boundingBox();
  expect(start).not.toBeNull();

  for (const name of [
    "Approve",
    "Approve",
    "Approve",
    "Approve",
    "Re-check",
    "Approve",
  ]) {
    await page.getByRole("button", { name }).click();
    const next = await figure.boundingBox();
    expect(Math.abs(next!.height - start!.height)).toBeLessThan(1);
  }
});
