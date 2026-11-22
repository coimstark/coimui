import { expect, test, type Page } from "@playwright/test";

const SHOWCASE_ORIGIN = "http://127.0.0.1:4174";
const STARTER_ORIGIN = "http://127.0.0.1:4175";

async function prepareDeterministicPage(
  page: Page,
  origin: string,
  route: string,
  opts: { mode: "light" | "dark"; viewport: { width: number; height: number } },
) {
  await page.setViewportSize(opts.viewport);
  await page.addInitScript(() => {
    const fixedTime = new Date("2026-11-22T10:00:00Z").valueOf();
    const NativeDate = Date;
    class FixedDate extends NativeDate {
      constructor(...args: unknown[]) {
        if (args.length === 0) {
          super(fixedTime);
        } else {
          // @ts-expect-error forwarding arguments to Date constructor
          super(...args);
        }
      }
      static now() {
        return fixedTime;
      }
    }
    // @ts-expect-error deterministic clock for calendar visuals
    window.Date = FixedDate;
  });

  const isStarter = origin === STARTER_ORIGIN;
  const modeKey = isStarter ? "coimui-starter-theme-mode" : "coimui-showcase-theme-mode";
  const colorKey = isStarter ? "coimui-starter-theme-color" : "coimui-showcase-theme-color";

  await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
  await page.evaluate(
    ([mKey, cKey, mode]) => {
      localStorage.setItem(mKey, mode);
      localStorage.setItem(cKey, "theme-purple");
    },
    [modeKey, colorKey, opts.mode],
  );
  await page.reload({ waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
}

test.describe("CoimUI Visual Regression Baselines", () => {
  test("Showcase desktop light baselines", async ({ page }) => {
    const vp = { width: 1440, height: 900 };

    await prepareDeterministicPage(page, SHOWCASE_ORIGIN, "/", { mode: "light", viewport: vp });
    await expect(page).toHaveScreenshot("showcase-home-light.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });

    await prepareDeterministicPage(page, SHOWCASE_ORIGIN, "/components/inputs", { mode: "light", viewport: vp });
    await expect(page).toHaveScreenshot("showcase-inputs-light.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });

    await prepareDeterministicPage(page, SHOWCASE_ORIGIN, "/data-grid", { mode: "light", viewport: vp });
    await expect(page).toHaveScreenshot("showcase-datagrid-light.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });

    await prepareDeterministicPage(page, SHOWCASE_ORIGIN, "/charts", { mode: "light", viewport: vp });
    await expect(page).toHaveScreenshot("showcase-charts-light.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });

    await prepareDeterministicPage(page, SHOWCASE_ORIGIN, "/pages/auth/sign-in", { mode: "light", viewport: vp });
    await expect(page).toHaveScreenshot("showcase-signin-light.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });

    await prepareDeterministicPage(page, SHOWCASE_ORIGIN, "/", { mode: "light", viewport: vp });
    await page.getByRole("button", { name: "Theme configuration" }).click();
    await page.waitForTimeout(150);
    await expect(page).toHaveScreenshot("showcase-theme-drawer-light.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });

  test("Showcase desktop dark baselines", async ({ page }) => {
    const vp = { width: 1440, height: 900 };

    await prepareDeterministicPage(page, SHOWCASE_ORIGIN, "/", { mode: "dark", viewport: vp });
    await expect(page).toHaveScreenshot("showcase-home-dark.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });

    await prepareDeterministicPage(page, SHOWCASE_ORIGIN, "/apps/calendar", { mode: "dark", viewport: vp });
    await expect(page).toHaveScreenshot("showcase-calendar-dark.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });

  test("Showcase tablet & mobile responsive baselines", async ({ page }) => {
    await prepareDeterministicPage(page, SHOWCASE_ORIGIN, "/", {
      mode: "light",
      viewport: { width: 768, height: 1024 },
    });
    await expect(page).toHaveScreenshot("showcase-home-tablet-light.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });

    await prepareDeterministicPage(page, SHOWCASE_ORIGIN, "/", {
      mode: "light",
      viewport: { width: 390, height: 844 },
    });
    await expect(page).toHaveScreenshot("showcase-home-mobile-light.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });

    await prepareDeterministicPage(page, SHOWCASE_ORIGIN, "/", {
      mode: "dark",
      viewport: { width: 390, height: 844 },
    });
    await expect(page).toHaveScreenshot("showcase-home-mobile-dark.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });

  test("Starter desktop light & dark baselines", async ({ page }) => {
    const vp = { width: 1440, height: 900 };

    await prepareDeterministicPage(page, STARTER_ORIGIN, "/", { mode: "light", viewport: vp });
    await expect(page).toHaveScreenshot("starter-home-light.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });

    await prepareDeterministicPage(page, STARTER_ORIGIN, "/projects", { mode: "dark", viewport: vp });
    await expect(page).toHaveScreenshot("starter-projects-dark.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });
});
