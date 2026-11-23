import { expect, test } from "@playwright/test";

const SHOWCASE_ORIGIN = "http://127.0.0.1:4174";
const STARTER_ORIGIN = "http://127.0.0.1:4175";

test.describe("CoimUI Feature Parity Interactive Verification", () => {
  test("verifies DateTimeRangePicker, TimeRangePicker, and inline clearable pickers", async ({ page }) => {
    await page.goto(`${SHOWCASE_ORIGIN}/date-pickers`, { waitUntil: "networkidle" });

    // TimeRangePicker opens synchronized Start/End hours listboxes
    const timeRangeTrigger = page.getByRole("button", { name: "Open time range selector" });
    await timeRangeTrigger.click();
    await expect(page.getByRole("listbox", { name: "Start hours" })).toBeVisible();
    await expect(page.getByRole("listbox", { name: "End hours" })).toBeVisible();
    await page.getByRole("button", { name: "Done" }).click();

    // DateTimeRangePicker opens range calendar + start/end time fields
    const dtRangeTrigger = page.getByRole("button", { name: "Open date and time range picker" });
    await dtRangeTrigger.click();
    await expect(page.getByRole("button", { name: "Last 7 Days" })).toBeVisible();
    await page.keyboard.press("Escape");

    // Inline clearable button clears Single Date value
    const clearSingleBtn = page.getByRole("button", { name: "Clear Single Date" });
    await expect(clearSingleBtn).toBeVisible();
    await clearSingleBtn.click();
    await expect(clearSingleBtn).toBeHidden();
  });

  test("verifies DataGrid column groups, summary footer, pinned rows, row reorder, cell selection, and toolbar dismiss", async ({
    page,
  }) => {
    await page.goto(`${SHOWCASE_ORIGIN}/data-grid`, { waitUntil: "networkidle" });

    // Columns toolbar popover closes on Escape
    const columnsBtn = page.getByRole("button", { name: "Columns" }).first();
    await columnsBtn.click();
    await expect(columnsBtn).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(columnsBtn).toHaveAttribute("aria-expanded", "false");

    // Second advanced enterprise DataGrid card
    await expect(page.getByText("Service Identity")).toBeVisible();
    await expect(page.getByText("Governance & Spend")).toBeVisible();
    await expect(page.getByText("Sum: $46,900")).toBeVisible();

    const opsPinnedTop = page.locator('tr[data-pinned-row="top"]');
    await expect(opsPinnedTop).toContainText("API Gateway");

    // Cell selection highlights selected cell
    const targetCell = page.getByRole("gridcell", { name: "Search Index" });
    await targetCell.click();
    await expect(targetCell).toHaveAttribute("data-cell-selected", "true");

    // Row reordering via Alt+ArrowDown on reorder handle
    const reorderBtn = page.getByRole("button", { name: "Reorder row OPS-2" });
    await reorderBtn.focus();
    await page.keyboard.press("Alt+ArrowDown");
    await expect(page.getByText("Updated service priority order")).toBeVisible();

    const opsGrid = page.locator(".coim-data-grid").nth(1);

    // Collapsible column group toggle
    const ownerHeader = opsGrid.getByRole("columnheader", { name: /Owner/i });
    await expect(ownerHeader).toBeVisible();
    await opsGrid.getByRole("button", { name: "Collapse group Service Identity" }).click();
    await expect(ownerHeader).toBeHidden();
    await opsGrid.getByRole("button", { name: "Expand group Service Identity" }).click();
    await expect(ownerHeader).toBeVisible();

    // Full-row editing (editMode="row"): Edit -> Save and Edit -> Cancel
    await opsGrid.getByRole("button", { name: "Edit row OPS-2" }).click();
    await opsGrid.getByLabel("Edit Owner").fill("Mateo Silva");
    await opsGrid.getByRole("button", { name: "Save row OPS-2" }).click();
    await expect(opsGrid.getByText("Mateo Silva")).toBeVisible();
    await expect(page.getByText("Saved changes to Search Index")).toBeVisible();

    await opsGrid.getByRole("button", { name: "Edit row OPS-3" }).click();
    await opsGrid.getByRole("button", { name: "Cancel row OPS-3" }).click();
    await expect(opsGrid.getByLabel("Edit Service")).toHaveCount(0);

    // Client-side Pivot mode toggle + Pivot Field Configurator
    const pivotBtn = opsGrid.getByRole("button", { name: "Pivot", exact: true });
    await pivotBtn.click();
    await expect(pivotBtn).toHaveAttribute("aria-pressed", "true");
    await expect(opsGrid.getByText("Annual Budget (sum) by SLA Verified")).toBeVisible();
    await expect(opsGrid.getByRole("columnheader", { name: /Total/i })).toBeVisible();

    await opsGrid.getByRole("button", { name: "Pivot Fields", exact: true }).click();
    const pivotPanel = opsGrid.getByRole("region", { name: "Pivot field configurator" });
    await expect(pivotPanel).toBeVisible();
    await pivotPanel.getByLabel("Add row field", { exact: true }).selectOption("renewal");
    await pivotPanel.getByRole("button", { name: "Confirm add row field" }).click();
    await pivotPanel.getByLabel("Pivot aggregation").selectOption("mean");
    await expect(opsGrid.getByText("Annual Budget (mean) by SLA Verified")).toBeVisible();
    await pivotPanel.getByRole("button", { name: "Close pivot field configurator" }).click();

    await pivotBtn.click();
    await expect(pivotBtn).toHaveAttribute("aria-pressed", "false");
    await expect(opsGrid.getByText("Service Identity")).toBeVisible();

    // Provider-agnostic AI Assistant bar (unconfigured state)
    await opsGrid.getByRole("button", { name: "AI Assistant", exact: true }).click();
    const aiBar = opsGrid.getByRole("region", { name: "Data grid AI assistant" });
    await expect(aiBar).toBeVisible();
    await expect(aiBar.getByText(/AI provider not configured/i)).toBeVisible();
    await expect(aiBar.getByRole("textbox", { name: "AI query prompt" })).toBeDisabled();
    await aiBar.getByRole("button", { name: "Close AI assistant" }).click();
    await expect(aiBar).toBeHidden();
  });

  test("verifies RichTreeView keyboard reordering and Charts extended variants", async ({ page }) => {
    await page.goto(`${SHOWCASE_ORIGIN}/components/data-display`, { waitUntil: "networkidle" });
    const dragHandles = page.locator("[data-tree-drag-handle]");
    await expect(dragHandles.first()).toBeVisible();

    const packagesItem = page.locator('[data-item-id="packages"]');
    await packagesItem.focus();
    await page.keyboard.press("Alt+ArrowDown");
    await expect(page.getByText("Updated tree hierarchy")).toBeVisible();

    await page.goto(`${SHOWCASE_ORIGIN}/charts`, { waitUntil: "networkidle" });
    await expect(page.getByText("Quarterly Deal Size Range")).toBeVisible();
    await expect(page.getByTestId("gauge-pointer")).toBeVisible();
    await expect(page.locator('[data-axis="right"]').first()).toBeVisible();
  });

  test("verifies Plugins VideoPlayer playable source and Bubble RichTextEditor theme", async ({ page }) => {
    await page.goto(`${SHOWCASE_ORIGIN}/plugins`, { waitUntil: "networkidle" });

    const videoSource = page.locator("video source");
    await expect(videoSource).toHaveAttribute("src", "/videos/products/product-1.mp4");

    await page.getByRole("button", { name: "Bubble", exact: true }).click();
    await expect(page.getByRole("region", { name: "Release notes editor" })).toHaveAttribute(
      "data-theme",
      "bubble",
    );
  });

  test("verifies i18n locale persistence, RTL switch, full translations, and preserved CoimSearchDialog", async ({
    page,
  }) => {
    await page.goto(`${SHOWCASE_ORIGIN}/`, { waitUntil: "networkidle" });

    // Preserved CoimSearchDialog
    await page.getByRole("button", { name: "Open search" }).click();
    const searchDialog = page.getByRole("dialog", { name: "Global search" });
    await expect(searchDialog).toBeVisible();
    const searchInput = searchDialog.getByRole("searchbox", { name: "Search query" });
    await searchInput.fill("Data Grid Engine");
    await expect(searchDialog.getByText(/TanStack v9 filtering/i)).toBeVisible();
    await searchDialog.getByRole("button", { name: "Close search" }).click();
    await expect(searchDialog).toBeHidden();

    // Switch locale to Arabic via User Menu and verify RTL + reload persistence
    await page.getByRole("button", { name: "Open user menu" }).click();
    await page.getByRole("button", { name: /Language/i }).click();
    await page.getByRole("menuitem", { name: /العربية/ }).click();

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    // Verify German translations include secondary sidebar items without English fallback
    await page.getByRole("button", { name: "Open user menu" }).click();
    await page.getByRole("button", { name: /اللغة|Language/i }).click();
    await page.getByRole("menuitem", { name: /Deutsch/ }).click();
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByText("Anwendungen")).toBeVisible();

    // Reset back to English so clean default state remains
    await page.evaluate(() => {
      localStorage.removeItem("coimui-showcase-locale");
      localStorage.removeItem("coimui-showcase-direction");
    });

    // Starter i18n check
    await page.goto(`${STARTER_ORIGIN}/`, { waitUntil: "networkidle" });
    await expect(page.locator("h1").first()).toBeVisible();
  });
});
