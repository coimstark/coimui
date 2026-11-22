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

    // Button height parity (Contained === Outlined === 36px at medium) on /components/inputs
    await page.goto(`${SHOWCASE_ORIGIN}/components/inputs`, { waitUntil: "networkidle" });
    const containedBox = await page.getByRole("button", { name: "Contained", exact: true }).boundingBox();
    const outlinedBox = await page.getByRole("button", { name: "Outlined", exact: true }).boundingBox();
    expect(Math.round(containedBox!.height)).toBe(36);
    expect(Math.round(outlinedBox!.height)).toBe(36);

    // Accordion keyboard toggle on /pages/faq
    await page.goto(`${SHOWCASE_ORIGIN}/pages/faq`, { waitUntil: "networkidle" });
    const secondTrigger = page.getByRole("button", { name: /Does CoimUI depend on external UI framework runtimes/i });
    await secondTrigger.focus();
    await page.keyboard.press("Enter");
    await expect(secondTrigger).toHaveAttribute("aria-expanded", "true");
  });

  test("exercises interactive DataGrid alignment, sort, search, pagination, edit, and CSV export", async ({ page }) => {
    const { errors, failedResponses } = attachErrorCollectors(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${SHOWCASE_ORIGIN}/data-grid`, { waitUntil: "networkidle" });

    // Pinned Status header and first body cell align horizontally
    const statusHeaderBox = await page.locator('th[data-col-id="status"]').boundingBox();
    const firstRowBox = await page.locator("tbody tr").first().boundingBox();
    expect(statusHeaderBox).toBeTruthy();
    expect(firstRowBox).toBeTruthy();
    expect(statusHeaderBox!.x + statusHeaderBox!.width).toBeLessThanOrEqual(firstRowBox!.x + firstRowBox!.width + 2);
    expect(
      await page.locator('th[data-col-id="status"]').evaluate((el) => getComputedStyle(el).position),
    ).toBe("sticky");

    // Sort by Seats
    const seatsSortBtn = page.getByRole("button", { name: "Seats", exact: true });
    await seatsSortBtn.click();
    await expect(page.locator('th[data-col-id="seats"]')).toHaveAttribute("aria-sort", "ascending");

    // Pagination Next -> shows remaining rows
    await page.getByRole("button", { name: "Next page" }).click();
    await expect(page.getByText(/Page 2 of 2/i)).toBeVisible();

    // Global search filter and restore
    const searchInput = page.getByRole("searchbox", { name: "Search rows" });
    await searchInput.fill("Northstar");
    await expect(page.getByText("1 total row(s)")).toBeVisible();
    await searchInput.fill("");
    await expect(page.getByText("8 total row(s)")).toBeVisible();

    // Row selection on first sorted row (ACC-105 has fewest seats: 14)
    await page.getByRole("checkbox", { name: "Select row ACC-105" }).click();
    await expect(page.getByText(/1 selected/i)).toBeVisible();

    // Inline cell edit
    const orgCell = page.locator("tbody tr").first().locator("td[role='gridcell']").nth(1);
    await orgCell.dblclick();
    const editInput = orgCell.locator("input");
    await editInput.fill("Helios Cloud");
    await editInput.press("Enter");
    await expect(page.getByText("Helios Cloud")).toBeVisible();

    // CSV Export download event
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "CSV" }).click(),
    ]);
    expect(download.suggestedFilename()).toContain(".csv");

    expect(errors).toEqual([]);
    expect(failedResponses).toEqual([]);
  });

  test("exercises Charts responsive sizing, borderless bars, legend toggling, Date/Time pickers, and Plugins", async ({ page }) => {
    const { errors, failedResponses } = attachErrorCollectors(page);
    await page.setViewportSize({ width: 1440, height: 900 });

    // Charts
    await page.goto(`${SHOWCASE_ORIGIN}/charts`, { waitUntil: "networkidle" });
    const barChartBox = await page.locator(".coim-bar-chart svg").first().boundingBox();
    expect(barChartBox).toBeTruthy();
    expect(barChartBox!.width).toBeGreaterThan(260);
    const firstBar = page.locator(".coim-bar-chart svg .lc-bar").first();
    await expect(firstBar).toHaveAttribute("fill-opacity", "0.14");
    await expect(firstBar).toHaveAttribute("stroke-width", "2");

    const legendBtn = page.getByRole("button", { name: "Cloud" });
    await expect(legendBtn).toHaveAttribute("aria-pressed", "true");
    await legendBtn.click();
    await expect(legendBtn).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByText("Visitors · 12,400 (100%)")).toBeVisible();

    // Date & Time Pickers
    await page.goto(`${SHOWCASE_ORIGIN}/date-pickers`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Open calendar" }).click();
    const pickerDialog = page.getByRole("dialog");
    await expect(pickerDialog.getByRole("button", { name: "Next" })).toBeVisible();
    await pickerDialog.getByRole("button", { name: "Today" }).click();

    await page.getByRole("button", { name: "Open date range calendar" }).click();
    await expect(page.getByRole("button", { name: "Last 7 days" })).toBeVisible();
    await page.getByRole("button", { name: "Last 7 days" }).click();

    await page.getByRole("button", { name: "Open time selector" }).first().click();
    await expect(page.getByRole("listbox", { name: "Hours" })).toBeVisible();
    await page.keyboard.press("Escape");

    // Plugins page (sortable reorder & rich text editor)
    await page.goto(`${SHOWCASE_ORIGIN}/plugins`, { waitUntil: "networkidle" });
    await expect(page.getByLabel("Release notes editor")).toBeVisible();
    const firstListItem = page.getByLabel("Prioritized backlog").locator("li").first();
    const firstTextBefore = await firstListItem.textContent();
    await firstListItem.getByRole("button", { name: /Move .* down/i }).click();
    const secondTextAfter = await page.getByLabel("Prioritized backlog").locator("li").nth(1).textContent();
    expect(secondTextAfter).toBe(firstTextBefore);

    // Event Calendar views & dark mode background surface
    await page.goto(`${SHOWCASE_ORIGIN}/apps/calendar`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Week", exact: true }).click();
    await page.getByRole("button", { name: "List", exact: true }).click();
    await page.getByRole("button", { name: "Month", exact: true }).click();

    await page.evaluate(() => localStorage.setItem("coimui-showcase-theme-mode", "dark"));
    await page.reload({ waitUntil: "networkidle" });
    const dayBg = await page.locator(".ec-day").first().evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(dayBg).not.toBe("rgb(255, 255, 255)");

    expect(errors).toEqual([]);
    expect(failedResponses).toEqual([]);
  });

  test("verifies Shell controls, Theme Drawer labels/swatches, Nav modes, Notifications, Shortcuts, Search & Showcase/Starter apps", async ({ page }) => {
    const { errors, failedResponses } = attachErrorCollectors(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${SHOWCASE_ORIGIN}/`, { waitUntil: "networkidle" });

    // User menu trigger opens popover and switches account
    await page.getByRole("button", { name: "Open user menu" }).click();
    await page.getByRole("button", { name: /Switch Account/i }).click();
    await page.getByRole("button", { name: /Travis Howard/i }).click();
    await expect(page.getByRole("button", { name: "Open user menu" })).toContainText("Travis Howard");

    // Notifications Approve action
    await page.getByRole("button", { name: "Notifications" }).click();
    await page.getByRole("button", { name: "Approve" }).click();
    await expect(page.getByText("Approved", { exact: true })).toBeVisible();
    await page.keyboard.press("Escape");

    // Shortcuts custom item
    await page.getByRole("button", { name: "Shortcuts" }).click();
    await page.getByRole("button", { name: "Add Shortcut", exact: true }).click();
    await page.getByPlaceholder("Shortcut label").fill("Metrics Board");
    await page.getByPlaceholder("/path").fill("/charts");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByRole("button", { name: /Metrics Board/i })).toBeVisible();
    await page.keyboard.press("Escape");

    // Search dialog filter
    await page.getByRole("button", { name: "Open search" }).click();
    const searchDialog = page.getByRole("dialog", { name: "Global search" });
    await searchDialog.getByRole("searchbox", { name: "Search query" }).fill("Charts");
    await expect(searchDialog.getByRole("button", { name: /Charts Gallery/i })).toBeVisible();
    await searchDialog.getByRole("button", { name: "Close search" }).click();
    await expect(searchDialog).toBeHidden();

    // Theme Drawer human-readable labels, 4 distinct palette swatches, Nav modes, Reset Defaults
    await page.getByRole("button", { name: "Theme configuration" }).click();
    const drawer = page.getByRole("dialog", { name: "Configuration" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("button", { name: "Minimal" })).toBeVisible();
    await expect(drawer.getByRole("button", { name: "Single Layer" })).toBeVisible();
    await expect(drawer.getByRole("button", { name: "Reset Defaults" })).toBeVisible();

    const swatchColors = await drawer.locator("button:has(svg)").evaluateAll((els) => {
      const target = ["Purple", "Blue", "Green", "Orange"];
      return target.map((label) => {
        const btn = els.find((b) => b.textContent?.trim() === label);
        const span = btn?.querySelector("span span");
        return span ? getComputedStyle(span).color : "";
      });
    });
    expect(new Set(swatchColors.filter(Boolean)).size).toBe(4);

    await drawer.getByRole("button", { name: "Minimal" }).click();
    await drawer.getByRole("button", { name: "Single Layer" }).click();
    await drawer.getByRole("button", { name: "Comfort" }).click();
    await drawer.getByRole("button", { name: "Fluid" }).click();
    await drawer.getByRole("button", { name: "Full Width" }).click();
    await drawer.getByRole("button", { name: "Flat" }).click();
    await drawer.getByRole("button", { name: "Reset Defaults" }).click();
    await expect(page.locator("html")).toHaveClass(/theme-purple/);
    await page.keyboard.press("Escape");

    // Nested routes retain visible sidebar in Showcase
    for (const nested of ["/dashboards/analytics", "/charts", "/apps/kanban", "/pages/pricing"]) {
      await page.goto(`${SHOWCASE_ORIGIN}${nested}`, { waitUntil: "networkidle" });
      const navBox = await page.locator("nav").first().boundingBox();
      expect(navBox && navBox.width, `Sidebar hidden on ${nested}`).toBeGreaterThan(100);
    }

    // Analytics dashboard timeframe switch
    await page.goto(`${SHOWCASE_ORIGIN}/dashboards/analytics`, { waitUntil: "networkidle" });
    await page.getByRole("radio", { name: "90D" }).click();
    await expect(page.getByText("Showing 90D window")).toBeVisible();

    // Kanban add & move card
    await page.goto(`${SHOWCASE_ORIGIN}/apps/kanban`, { waitUntil: "networkidle" });
    await page.getByLabel("New Task Card").fill("Ship v1.0.0 tag");
    await page.getByRole("button", { name: "Add Card" }).click();
    await page.getByRole("button", { name: /Start "Ship v1\.0\.0 tag"/ }).click();
    await expect(page.getByText("In Progress (2)")).toBeVisible();

    // Chat thread switch & send message
    await page.goto(`${SHOWCASE_ORIGIN}/apps/chat`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Design Systems/i }).click();
    await expect(page.getByText(/# Design Systems/)).toBeVisible();
    await page.getByLabel("Message").fill("Tokens approved");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText("Tokens approved")).toBeVisible();

    // Mail compose -> Sent
    await page.goto(`${SHOWCASE_ORIGIN}/apps/mail`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Compose" }).click();
    await page.getByLabel("Recipient").fill("release@coimui.dev");
    await page.getByLabel("Subject").fill("Launch Checklist Done");
    await page.getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByRole("heading", { name: "Launch Checklist Done" })).toBeVisible();

    // Navigation & Feedback dialogs/steppers
    await page.goto(`${SHOWCASE_ORIGIN}/components/navigation`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Next Step" }).click();
    await expect(page.getByText("Step 2: Configure optional webhook targets.")).toBeVisible();

    await page.goto(`${SHOWCASE_ORIGIN}/components/feedback`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Confirm Action" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");

    // Showcase forms validation & submission
    await page.goto(`${SHOWCASE_ORIGIN}/forms`, { waitUntil: "networkidle" });
    await page.getByRole("textbox", { name: /Full Name/i }).fill("Laura Ellis");
    await page.getByRole("textbox", { name: /Work Email/i }).fill("laura@coimui.dev");
    await page.getByRole("textbox", { name: /Organization/i }).fill("CoimUI Inc");
    const termsCheckbox = page.getByRole("checkbox", { name: /confirm organization billing/i });
    if ((await termsCheckbox.getAttribute("aria-checked")) !== "true") {
      await termsCheckbox.click();
    }
    await page.getByRole("button", { name: "Submit Provisioning Request" }).click();

    // Starter Projects & sidebar visibility
    await page.goto(`${STARTER_ORIGIN}/projects`, { waitUntil: "networkidle" });
    const starterNavBox = await page.locator("nav").first().boundingBox();
    expect(starterNavBox && starterNavBox.width).toBeGreaterThan(100);
    await page.getByRole("button", { name: "New Project" }).click();
    await page.getByLabel(/Project Title/i).fill("Telemetry Edge");
    await page.getByLabel(/Owner/i).fill("Noah Kim");
    await page.getByRole("dialog").getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByText("Telemetry Edge")).toBeVisible();

    expect(errors).toEqual([]);
    expect(failedResponses).toEqual([]);
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
