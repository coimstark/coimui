import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const SHOWCASE_ORIGIN = "http://127.0.0.1:4174";
const STARTER_ORIGIN = "http://127.0.0.1:4175";

const SHOWCASE_NEW_ROUTES = [
  "/apps",
  "/apps/ai-chat",
  "/apps/ai-chat/new-chat",
  "/apps/ai-chat/recent-chat",
  "/apps/ai-chat/extensions",
  "/apps/ai-chat/extension-detail",
  "/apps/ai-chat/api-access",
  "/apps/ai-chat/premium-plans",
  "/apps/ai-chat/settings",
  "/apps/ai-content",
  "/apps/ai-content/home",
  "/apps/ai-content/ai-image",
  "/apps/ai-content/ai-video",
  "/apps/ai-content/ai-upscale",
  "/apps/ai-content/ai-models",
  "/apps/ai-content/ai-models/detail",
  "/apps/ai-content/library",
  "/apps/ai-content/uploads",
  "/apps/ai-content/learn",
  "/apps/ai-content/faq",
  "/apps/ai-content/api-access",
  "/apps/ai-content/premium-plans",
  "/apps/ai-content/settings",
  "/apps/drive",
  "/apps/drive/home",
  "/apps/drive/files",
  "/apps/drive/folder",
  "/apps/drive/favorites",
  "/apps/drive/shared",
  "/apps/drive/label",
  "/apps/drive/workspaces",
  "/apps/drive/organizations",
  "/apps/drive/spam",
  "/apps/drive/trash",
  "/apps/drive/premium-plans",
  "/apps/drive/settings",
  "/apps/messages",
  "/apps/messages/home",
  "/apps/messages/chat",
  "/apps/messages/chat-new",
  "/apps/messages/call",
  "/apps/calendar/home",
  "/apps/calendar/add-event",
  "/dashboards",
  "/dashboards/default",
  "/dashboards/booking",
  "/dashboards/health",
  "/dashboards/visual",
  "/dashboards/default/default-titles-inside",
  "/dashboards/analytics/analytics-titles-inside",
  "/dashboards/booking/booking-titles-inside",
  "/dashboards/commerce/commerce-titles-inside",
  "/dashboards/finance/finance-titles-inside",
  "/dashboards/health/health-titles-inside",
  "/dashboards/learning/learning-titles-inside",
  "/dashboards/visual/visual-titles-inside",
  "/pages",
  "/settings",
  "/pages/ecommerce",
  "/pages/ecommerce/products",
  "/pages/ecommerce/products-cards",
  "/pages/ecommerce/products-dense",
  "/pages/ecommerce/products-filters",
  "/pages/ecommerce/product-detail",
  "/pages/ecommerce/orders",
  "/pages/ecommerce/order-detail",
  "/pages/ecommerce/invoice",
  "/pages/support",
  "/pages/support/overview",
  "/pages/support/issues",
  "/pages/support/add-issue",
  "/pages/support/issue-detail",
  "/pages/user",
  "/pages/user/overview",
  "/pages/user/friends",
  "/pages/user/permissions",
  "/pages/user/projects",
  "/pages/user/social",
  "/pages/miscellaneous",
  "/pages/miscellaneous/article",
  "/pages/miscellaneous/email-templates",
  "/pages/miscellaneous/empty",
  "/pages/miscellaneous/empty-tabs",
  "/pages/miscellaneous/knowledge-base",
  "/pages/miscellaneous/search",
  "/pages/auth",
  "/pages/auth/get-verification",
  "/pages/auth/set-verification",
  "/pages/auth/password-new",
  "/pages/auth/password-sent",
  "/pages/auth/privacy-policy",
  "/pages/auth/terms-and-conditions",
  "/menu-levels",
  "/menu-levels/level-two",
  "/menu-levels/level-two-subs",
  "/menu-levels/level-two-subs/level-three",
  "/menu-levels/level-two-subs/level-three-subs",
  "/menu-levels/level-two-subs/level-three-subs/level-four",
  "/menu-levels/level-two-subs/level-three-subs/level-four-subs",
  "/menu-levels/level-two-subs/level-three-subs/level-four-subs/level-five",
  "/docs/welcome",
  "/docs/welcome/introduction",
  "/docs/welcome/faq",
  "/docs/welcome/changelog",
  "/docs/getting-started",
  "/docs/getting-started/installation",
  "/docs/getting-started/file-structure",
  "/docs/getting-started/routing-and-menu",
  "/docs/getting-started/multi-language",
  "/docs/theme",
  "/docs/theme/theme-provider",
  "/docs/theme/styling",
  "/docs/theme/settings",
];

const STARTER_NEW_ROUTES = [
  "/home/sub",
  "/single-menu",
  "/auth",
  "/auth/get-verification",
  "/auth/set-verification",
  "/auth/password-new",
  "/auth/password-sent",
  "/auth/privacy-policy",
  "/auth/terms-and-conditions",
];

function attachErrorCollectors(page: Page) {
  const errors: string[] = [];
  const failedResponses: string[] = [];

  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(`console.error: ${msg.text()}`);
    }
  });
  page.on("response", (res) => {
    if (res.status() >= 400 && !res.url().includes("favicon")) {
      failedResponses.push(`${res.status()} ${res.url()}`);
    }
  });

  return { errors, failedResponses };
}

test.describe("CoimUI Applications & Extended Pages Verification", () => {
  test("every newly added Showcase route returns 200 with visible heading and zero errors", async ({ page }) => {
    const { errors, failedResponses } = attachErrorCollectors(page);

    for (const route of SHOWCASE_NEW_ROUTES) {
      const response = await page.goto(`${SHOWCASE_ORIGIN}${route}`, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `Unexpected status for ${route}`).toBe(200);
      await expect(page.locator("h1").first(), `Missing h1 on ${route}`).toBeVisible({ timeout: 10_000 });
    }

    expect(errors, `Showcase runtime errors: ${errors.join("; ")}`).toEqual([]);
    expect(failedResponses, `Showcase asset/HTTP errors: ${failedResponses.join("; ")}`).toEqual([]);
  });

  test("every newly added Starter route returns 200 with visible heading and zero errors", async ({ page }) => {
    const { errors, failedResponses } = attachErrorCollectors(page);

    for (const route of STARTER_NEW_ROUTES) {
      const response = await page.goto(`${STARTER_ORIGIN}${route}`, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `Unexpected status for ${route}`).toBe(200);
      await expect(page.locator("h1").first(), `Missing h1 on ${route}`).toBeVisible({ timeout: 10_000 });
    }

    expect(errors, `Starter runtime errors: ${errors.join("; ")}`).toEqual([]);
    expect(failedResponses, `Starter asset/HTTP errors: ${failedResponses.join("; ")}`).toEqual([]);
  });

  test("verifies AI Chat & AI Content honest unconfigured provider flows", async ({ page }) => {
    const { errors, failedResponses } = attachErrorCollectors(page);

    await page.goto(`${SHOWCASE_ORIGIN}/apps/ai-chat`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "New Chat", exact: true }).click();
    await expect(page.getByText("Ready for a new workspace thread")).toBeVisible();

    await page.getByRole("textbox", { name: "Message Prompt" }).fill("Verify workspace telemetry token rules");
    await page.getByRole("button", { name: "Send", exact: true }).click();
    await expect(page.getByText("Verify workspace telemetry token rules")).toBeVisible();
    await expect(page.getByText("Provider Notice")).toBeVisible();

    await page.goto(`${SHOWCASE_ORIGIN}/apps/ai-content/ai-image`, { waitUntil: "networkidle" });
    await expect(page.getByRole("button", { name: "Generate Image" })).toBeDisabled();
    await expect(page.getByText(/Generation is disabled until a media provider endpoint/i)).toBeVisible();

    await page.goto(`${SHOWCASE_ORIGIN}/apps/ai-content/library`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Favorites Only" }).click();
    await page.getByRole("textbox", { name: "Search library" }).fill("Ceramic");
    await expect(page.getByText("Ceramic Desk Series", { exact: true })).toBeVisible();

    expect(errors).toEqual([]);
    expect(failedResponses).toEqual([]);
  });

  test("verifies File Drive create, star, trash, and restore workflow", async ({ page }) => {
    const { errors, failedResponses } = attachErrorCollectors(page);

    await page.goto(`${SHOWCASE_ORIGIN}/apps/drive/files`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "New Folder" }).click();
    const createDialog = page.getByRole("dialog", { name: "Create Folder" });
    await createDialog.getByRole("textbox", { name: "Folder Name" }).fill("Q4 Audits");
    await createDialog.getByRole("button", { name: "Create", exact: true }).click();

    await expect(page.getByText("Q4 Audits", { exact: true })).toBeVisible();

    // Locate the card containing "Q4 Audits" and trash it
    const folderCard = page
      .locator(".coim-card")
      .filter({ has: page.getByText("Q4 Audits", { exact: true }) })
      .first();
    await folderCard.getByRole("button", { name: "Trash", exact: true }).click();

    await page.getByRole("navigation", { name: "Cloud Drive sections" }).getByRole("link", { name: "Trash" }).click();
    await expect(page).toHaveURL(/\/apps\/drive\/trash$/);
    await expect(page.getByText("Q4 Audits", { exact: true })).toBeVisible();

    const trashCard = page
      .locator(".coim-card")
      .filter({ has: page.getByText("Q4 Audits", { exact: true }) })
      .first();
    await trashCard.getByRole("button", { name: "Restore", exact: true }).click();
    await expect(page.getByText("Q4 Audits", { exact: true })).toBeHidden();

    expect(errors).toEqual([]);
    expect(failedResponses).toEqual([]);
  });

  test("verifies Messages, Calendar Add Event, Ecommerce, Support, User, Menu Levels & Starter interactions", async ({
    page,
  }) => {
    const { errors, failedResponses } = attachErrorCollectors(page);

    // Messages: add contact, send message, call toggle
    await page.goto(`${SHOWCASE_ORIGIN}/apps/messages/chat`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Add Contact" }).click();
    const contactDialog = page.getByRole("dialog", { name: "Add Workspace Contact" });
    await contactDialog.getByRole("textbox", { name: "Full Name" }).fill("Maya Lin");
    await contactDialog.getByRole("textbox", { name: "Email" }).fill("maya.lin@coimui.dev");
    await contactDialog.getByRole("button", { name: "Save Contact" }).click();
    await expect(contactDialog).toBeHidden();

    await page.getByRole("textbox", { name: "Reply" }).fill("Syncing release checklist");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByRole("paragraph").filter({ hasText: "Syncing release checklist" })).toBeVisible();

    await page.getByRole("navigation", { name: "Messages sections" }).getByRole("link", { name: "Voice & Video Call" }).click();
    await expect(page).toHaveURL(/\/apps\/messages\/call$/);
    await page.getByRole("button", { name: "Mute Mic" }).click();
    await expect(page.getByRole("button", { name: "Unmute Mic" })).toBeVisible();

    // Calendar: create event on add-event route -> navigates to calendar/home
    await page.goto(`${SHOWCASE_ORIGIN}/apps/calendar/add-event`, { waitUntil: "networkidle" });
    await page.getByRole("textbox", { name: "Event Title" }).fill("Release Review Sync");
    await page.getByRole("button", { name: "Save Event" }).click();
    await expect(page).toHaveURL(/\/apps\/calendar\/home$/);
    await expect(page.getByText("Release Review Sync", { exact: true }).first()).toBeVisible();

    // Ecommerce: filter, review, and order status update
    await page.goto(`${SHOWCASE_ORIGIN}/pages/ecommerce/products-filters`, { waitUntil: "networkidle" });
    await page.getByRole("textbox", { name: "Search SKUs" }).fill("Studio");
    await expect(page.locator("main").getByText("Reference Studio Monitors")).toBeVisible();

    await page.goto(`${SHOWCASE_ORIGIN}/pages/ecommerce/product-detail`, { waitUntil: "networkidle" });
    await page.getByRole("textbox", { name: "Add Review Comment" }).fill("Excellent acoustic isolation.");
    await page.getByRole("button", { name: "Post Review" }).click();
    await expect(page.getByText("Excellent acoustic isolation.")).toBeVisible();

    await page.goto(`${SHOWCASE_ORIGIN}/pages/ecommerce/order-detail`, { waitUntil: "networkidle" });
    await page.getByRole("combobox", { name: /Update Status/i }).click();
    await page.getByRole("option", { name: "Fulfilled" }).click();
    await expect(page.getByText("Fulfilled").first()).toBeVisible();

    // Support: submit issue -> issue-detail + post comment
    await page.goto(`${SHOWCASE_ORIGIN}/pages/support/add-issue`, { waitUntil: "networkidle" });
    await page.getByRole("textbox", { name: "Issue Title" }).fill("Audit Log Filter Slow");
    await page.getByRole("textbox", { name: "Reproduction / Context" }).fill("Large CSV export delays table filter.");
    await page.getByRole("button", { name: "Submit Issue" }).click();
    await expect(page).toHaveURL(/\/pages\/support\/issue-detail$/);
    await expect(page.getByRole("heading", { name: /Audit Log Filter Slow/i })).toBeVisible();
    await page.getByRole("textbox", { name: "Add Update Comment" }).fill("Assigned to platform profiling team.");
    await page.getByRole("button", { name: "Post Comment" }).click();
    await expect(page.getByText("Assigned to platform profiling team.")).toBeVisible();

    // User: permissions switch & social post
    await page.goto(`${SHOWCASE_ORIGIN}/pages/user/permissions`, { waitUntil: "networkidle" });
    const firstSwitch = page.getByRole("switch").first();
    const initialChecked = await firstSwitch.getAttribute("aria-checked");
    await firstSwitch.click();
    await expect(firstSwitch).toHaveAttribute("aria-checked", initialChecked === "true" ? "false" : "true");

    await page.goto(`${SHOWCASE_ORIGIN}/pages/user/social`, { waitUntil: "networkidle" });
    await page.getByRole("textbox", { name: "Share an engineering note" }).fill("Completed cross-app UI pass.");
    await page.getByRole("button", { name: "Publish Update" }).click();
    await expect(page.getByText("Completed cross-app UI pass.")).toBeVisible();

    // Menu levels down to level-five
    await page.goto(`${SHOWCASE_ORIGIN}/menu-levels/level-two-subs/level-three-subs/level-four-subs/level-five`, {
      waitUntil: "networkidle",
    });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Starter: single-menu layout switcher & set-verification 6-digit OTP
    await page.goto(`${STARTER_ORIGIN}/single-menu`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Minimal", exact: true }).click();
    await expect(page.getByText("Active menu mode: minimal")).toBeVisible();
    await page.getByRole("button", { name: "Comfort", exact: true }).click();
    await expect(page.getByText("Active menu mode: comfort")).toBeVisible();

    await page.goto(`${STARTER_ORIGIN}/auth/set-verification`, { waitUntil: "networkidle" });
    for (let i = 1; i <= 6; i += 1) {
      await page.getByRole("textbox", { name: `Digit ${i} of 6` }).fill(String(i));
    }
    await page.getByRole("button", { name: "Verify Account" }).click();
    await expect(page).toHaveURL(/\/auth\/sign-in$/);

    expect(errors).toEqual([]);
    expect(failedResponses).toEqual([]);
  });

  test("checks dark theme, responsive overflow, keyboard navigation, and Axe a11y across key new apps/pages", async ({
    page,
  }) => {
    const keyRoutes = [
      `${SHOWCASE_ORIGIN}/apps/ai-chat`,
      `${SHOWCASE_ORIGIN}/apps/ai-content/home`,
      `${SHOWCASE_ORIGIN}/apps/drive/files`,
      `${SHOWCASE_ORIGIN}/apps/messages/chat`,
      `${SHOWCASE_ORIGIN}/dashboards/booking`,
      `${SHOWCASE_ORIGIN}/pages/ecommerce/products`,
      `${SHOWCASE_ORIGIN}/pages/support/overview`,
      `${SHOWCASE_ORIGIN}/pages/user/overview`,
      `${SHOWCASE_ORIGIN}/settings`,
      `${STARTER_ORIGIN}/single-menu`,
    ];

    const viewports = [
      { width: 1440, height: 900 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      for (const url of [keyRoutes[0], keyRoutes[2], keyRoutes[4], keyRoutes[9]]) {
        await page.goto(url, { waitUntil: "networkidle" });
        const overflow = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        }));
        expect(
          overflow.scrollWidth,
          `${url} overflowed at ${vp.width}px: ${overflow.scrollWidth} > ${overflow.innerWidth}`,
        ).toBeLessThanOrEqual(overflow.innerWidth + 1);
      }
    }

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${SHOWCASE_ORIGIN}/settings`, { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName ?? "");
    expect(focusedTag).not.toBe("");

    // Light-mode Axe WCAG 2.1 AA scan across representative new routes
    for (const url of keyRoutes) {
      await page.goto(url, { waitUntil: "networkidle" });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const blockers = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );
      expect(
        blockers,
        `Axe blockers on ${url}: ${blockers.map((b) => `${b.id} (${b.nodes.length})`).join(", ")}`,
      ).toEqual([]);
    }

    // Verify dark theme applies dark surfaces across Drive & Booking without errors
    const { errors, failedResponses } = attachErrorCollectors(page);
    await page.goto(`${SHOWCASE_ORIGIN}/apps/drive/files`, { waitUntil: "networkidle" });
    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    await page.evaluate(() => localStorage.setItem("coimui-showcase-theme-mode", "dark"));
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(darkBg).not.toBe(lightBg);

    await page.goto(`${SHOWCASE_ORIGIN}/dashboards/booking`, { waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(page.locator("h1").first()).toBeVisible();
    expect(errors).toEqual([]);
    expect(failedResponses).toEqual([]);
  });

  test("enforces WCAG 2.1 AA dark-mode contrast across all 4 themes in Showcase and Starter", async ({ page }) => {
    const darkShowcasePurpleRoutes = [
      "/",
      "/components/inputs",
      "/components/data-display",
      "/components/feedback",
      "/components/navigation",
      "/apps/ai-chat",
      "/apps/drive/files",
      "/dashboards/booking",
      "/settings",
    ];

    for (const route of darkShowcasePurpleRoutes) {
      await page.goto(`${SHOWCASE_ORIGIN}${route}`, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => {
        localStorage.setItem("coimui-showcase-theme-mode", "dark");
        localStorage.setItem("coimui-showcase-theme-color", "theme-purple");
      });
      await page.reload({ waitUntil: "networkidle" });
      const res = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const blockers = res.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
      expect(
        blockers,
        `Dark theme-purple Axe blockers on ${route}: ${blockers
          .map((b) => `${b.id} (${b.nodes.map((n) => n.html.slice(0, 60)).join("; ")})`)
          .join(", ")}`,
      ).toEqual([]);
    }

    for (const theme of ["theme-blue", "theme-green", "theme-orange"] as const) {
      for (const route of ["/", "/components/inputs", "/components/data-display"]) {
        await page.goto(`${SHOWCASE_ORIGIN}${route}`, { waitUntil: "domcontentloaded" });
        await page.evaluate(([t]) => {
          localStorage.setItem("coimui-showcase-theme-mode", "dark");
          localStorage.setItem("coimui-showcase-theme-color", t);
        }, [theme]);
        await page.reload({ waitUntil: "networkidle" });
        const res = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        const blockers = res.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
        expect(
          blockers,
          `Dark ${theme} Axe blockers on ${route}: ${blockers
            .map((b) => `${b.id} (${b.nodes.map((n) => n.html.slice(0, 60)).join("; ")})`)
            .join(", ")}`,
        ).toEqual([]);
      }
    }

    for (const route of ["/", "/single-menu"]) {
      await page.goto(`${STARTER_ORIGIN}${route}`, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => {
        localStorage.setItem("coimui-starter-theme-mode", "dark");
        localStorage.setItem("coimui-starter-theme-color", "theme-purple");
      });
      await page.reload({ waitUntil: "networkidle" });
      const res = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const blockers = res.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
      expect(
        blockers,
        `Starter dark theme-purple Axe blockers on ${route}: ${blockers
          .map((b) => `${b.id} (${b.nodes.map((n) => n.html.slice(0, 60)).join("; ")})`)
          .join(", ")}`,
      ).toEqual([]);
    }
  });
});
