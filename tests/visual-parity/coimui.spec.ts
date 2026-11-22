import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const SHOWCASE_ORIGIN = "http://127.0.0.1:4174";
const STARTER_ORIGIN = "http://127.0.0.1:4175";

const SHOWCASE_ROUTES = [
  "/",
  "/dashboards/analytics",
  "/dashboards/commerce",
  "/dashboards/finance",
  "/components",
  "/components/foundation",
  "/components/surfaces",
  "/components/inputs",
  "/components/data-display",
  "/components/navigation",
  "/components/feedback",
  "/components/icons",
  "/data-grid",
  "/charts",
  "/date-pickers",
  "/plugins",
  "/forms",
  "/apps/kanban",
  "/apps/calendar",
  "/apps/chat",
  "/apps/invoices",
  "/apps/mail",
  "/pages/profile",
  "/pages/pricing",
  "/pages/faq",
  "/pages/auth/sign-in",
  "/pages/auth/sign-up",
  "/pages/auth/forgot-password",
  "/docs",
];

const STARTER_ROUTES = ["/", "/projects", "/forms", "/settings", "/auth/sign-in"];

const A11Y_ROUTES = [
  `${SHOWCASE_ORIGIN}/`,
  `${SHOWCASE_ORIGIN}/components/foundation`,
  `${SHOWCASE_ORIGIN}/components/surfaces`,
  `${SHOWCASE_ORIGIN}/components/inputs`,
  `${SHOWCASE_ORIGIN}/components/data-display`,
  `${SHOWCASE_ORIGIN}/components/navigation`,
  `${SHOWCASE_ORIGIN}/components/feedback`,
  `${SHOWCASE_ORIGIN}/data-grid`,
  `${SHOWCASE_ORIGIN}/charts`,
  `${SHOWCASE_ORIGIN}/date-pickers`,
  `${SHOWCASE_ORIGIN}/forms`,
  `${SHOWCASE_ORIGIN}/pages/pricing`,
  `${SHOWCASE_ORIGIN}/pages/faq`,
  `${SHOWCASE_ORIGIN}/pages/auth/sign-in`,
  `${SHOWCASE_ORIGIN}/docs`,
  `${STARTER_ORIGIN}/`,
  `${STARTER_ORIGIN}/forms`,
  `${STARTER_ORIGIN}/settings`,
];

function attachErrorCollectors(page: Page) {
  const errors: string[] = [];
  const failedResponses: string[] = [];

  page.on("pageerror", (err) => {
    errors.push(`pageerror: ${err.message}`);
  });
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(`console.error: ${msg.text()}`);
    }
  });
  page.on("response", (res) => {
    const status = res.status();
    const url = res.url();
    if (status >= 400 && !url.includes("favicon")) {
      failedResponses.push(`${status} ${url}`);
    }
  });

  return { errors, failedResponses };
}

test.describe("CoimUI Runtime, Visual, Accessibility & Responsiveness Suite", () => {
  test("every Showcase route renders cleanly without runtime or asset errors", async ({ page }) => {
    const { errors, failedResponses } = attachErrorCollectors(page);

    for (const route of SHOWCASE_ROUTES) {
      await page.goto(`${SHOWCASE_ORIGIN}${route}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 10_000 });
    }

    expect(errors, `Showcase runtime errors: ${errors.join("; ")}`).toEqual([]);
    expect(failedResponses, `Showcase HTTP failures: ${failedResponses.join("; ")}`).toEqual([]);
  });

  test("every Starter route renders cleanly without runtime or asset errors", async ({ page }) => {
    const { errors, failedResponses } = attachErrorCollectors(page);

    for (const route of STARTER_ROUTES) {
      await page.goto(`${STARTER_ORIGIN}${route}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 10_000 });
    }

    expect(errors, `Starter runtime errors: ${errors.join("; ")}`).toEqual([]);
    expect(failedResponses, `Starter HTTP failures: ${failedResponses.join("; ")}`).toEqual([]);
  });

  test("enforces design-system typography, dark mode toggle, 4 accent themes, and RTL switching", async ({ page }) => {
    await page.goto(`${SHOWCASE_ORIGIN}/docs`, { waitUntil: "networkidle" });

    const bodyFonts = await page.evaluate(() => {
      const html = document.documentElement;
      const body = document.body;
      const h1 = document.querySelector("h1");
      return {
        htmlThemeClass: html.className,
        bodyFont: getComputedStyle(body).fontFamily,
        headingFont: h1 ? getComputedStyle(h1).fontFamily : "",
        bgLight: getComputedStyle(body).backgroundColor,
      };
    });

    expect(bodyFonts.bodyFont.toLowerCase()).toContain("mulish");
    expect(bodyFonts.headingFont.toLowerCase()).toContain("urbanist");

    // Toggle dark color scheme via switch on Docs Theme Playground
    const darkSwitch = page.getByRole("switch", { name: /Dark Color Scheme/i });
    await darkSwitch.click();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);

    const bgDark = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bgDark).not.toBe(bodyFonts.bgLight);

    // Toggle back to light for RTL + theme verification
    await darkSwitch.click();
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);

    // Switch RTL direction
    const rtlSwitch = page.getByRole("switch", { name: /Right-to-Left/i });
    await rtlSwitch.click();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await rtlSwitch.click();
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");

    // Verify Accent Palette switching applies all 4 theme classes
    const themeSelect = page.getByRole("combobox", { name: /Accent Palette/i });
    await themeSelect.click();
    await page.getByRole("option", { name: "Green" }).click();
    await expect(page.locator("html")).toHaveClass(/theme-green/);
    await themeSelect.click();
    await page.getByRole("option", { name: "Orange" }).click();
    await expect(page.locator("html")).toHaveClass(/theme-orange/);
  });

  test("preserves zero horizontal overflow across desktop, tablet, and mobile viewports", async ({ page }) => {
    const viewports = [
      { name: "desktop", width: 1440, height: 900 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "mobile", width: 390, height: 844 },
    ];

    const keyRoutes = [`${SHOWCASE_ORIGIN}/`, `${SHOWCASE_ORIGIN}/components/inputs`, `${SHOWCASE_ORIGIN}/data-grid`, `${STARTER_ORIGIN}/`];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      for (const url of keyRoutes) {
        await page.goto(url, { waitUntil: "networkidle" });
        const overflow = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        }));
        expect(
          overflow.scrollWidth,
          `${url} overflowed on ${vp.name}: ${overflow.scrollWidth} > ${overflow.innerWidth}`,
        ).toBeLessThanOrEqual(overflow.innerWidth + 1);
      }
    }
  });

  test("supports keyboard navigation across skip link, tabs, dialog, and accordions", async ({ page }) => {
    // Tabs + Menu navigation on /components/navigation
    await page.goto(`${SHOWCASE_ORIGIN}/components/navigation`, { waitUntil: "networkidle" });
    const overviewTab = page.getByRole("tab", { name: "Overview" });
    await overviewTab.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Permissions" })).toBeFocused();

    // Native Dialog focus & Escape close on /components/feedback
    await page.goto(`${SHOWCASE_ORIGIN}/components/feedback`, { waitUntil: "networkidle" });
    const openDialogBtn = page.getByRole("button", { name: "Open Dialog" });
    await openDialogBtn.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    // Accordion keyboard toggle on /pages/faq
    await page.goto(`${SHOWCASE_ORIGIN}/pages/faq`, { waitUntil: "networkidle" });
    const secondTrigger = page.getByRole("button", { name: /Does CoimUI depend on external UI framework runtimes/i });
    await secondTrigger.focus();
    await page.keyboard.press("Enter");
    await expect(secondTrigger).toHaveAttribute("aria-expanded", "true");
  });

  for (const url of A11Y_ROUTES) {
    test(`axe-core WCAG 2.1 AA passes with 0 critical/serious violations on ${url}`, async ({ page }) => {
      await page.goto(url, { waitUntil: "networkidle" });

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const blockers = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );

      expect(
        blockers,
        blockers
          .map((v) => `[${v.impact}] ${v.id}: ${v.help} -> ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)
          .join("\n"),
      ).toEqual([]);
    });
  }
});
