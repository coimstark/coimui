import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { createRawSnippet, tick } from "svelte";
import NavigationTestHost from "../../../tests/NavigationTestHost.svelte";
import { CoimMenu } from "./index.js";

describe("Navigation Component Library", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });

  it("renders link, collapsible breadcrumbs, bottom navigation, and pagination", async () => {
    const onBottomNavChange = vi.fn();
    const onPaginationChange = vi.fn();
    const view = render(NavigationTestHost, {
      props: { onBottomNavChange, onPaginationChange },
    });
    await tick();

    expect(view.getByRole("link", { name: "Read Documentation" })).toHaveClass("coim-link-underline-always");

    // Breadcrumbs start collapsed then expand
    expect(view.queryByText("Workspace")).toBeNull();
    await fireEvent.click(view.getByRole("button", { name: "Show path" }));
    await tick();
    expect(view.getByText("Workspace")).toBeInTheDocument();

    // Bottom navigation selection
    await fireEvent.click(view.getByRole("button", { name: "Orders" }));
    await tick();
    expect(onBottomNavChange).toHaveBeenCalledWith("orders");

    // Pagination page change
    expect(view.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
    await fireEvent.click(view.getByRole("button", { name: "Page 3" }));
    await tick();
    expect(onPaginationChange).toHaveBeenCalledWith(3);
  });

  it("supports SpeedDial open/close + Escape, Stepper + MobileStepper, and Toolbar roving focus", async () => {
    const onSpeedAction = vi.fn();
    const onStepSelect = vi.fn();
    const view = render(NavigationTestHost, {
      props: { onSpeedAction, onStepSelect },
    });
    await tick();

    // SpeedDial
    const trigger = view.getByRole("button", { name: "Quick Actions" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await fireEvent.click(trigger);
    await tick();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await fireEvent.click(view.getByRole("menuitem", { name: "Create Project" }));
    await tick();
    expect(onSpeedAction).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await fireEvent.click(trigger);
    await tick();
    await fireEvent.keyDown(trigger, { key: "Escape" });
    await tick();
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    // NonLinear Stepper step switching
    await fireEvent.click(view.getByRole("button", { name: /Profile/ }));
    await tick();
    expect(onStepSelect).toHaveBeenCalledWith(1);
    expect(view.getByText("Profile details panel")).toBeInTheDocument();

    // Mobile stepper Next button
    const nextBtns = view.getAllByRole("button", { name: "Next" });
    await fireEvent.click(nextBtns[0]);
    await tick();
    expect(view.getByRole("status")).toHaveAttribute("aria-label", "Step 3 of 3");

    // Toolbar roving focus
    const boldBtn = view.getByRole("button", { name: "Bold" });
    const italicBtn = view.getByRole("button", { name: "Italic" });
    boldBtn.focus();
    await fireEvent.keyDown(boldBtn, { key: "ArrowRight" });
    expect(document.activeElement).toBe(italicBtn);
    expect(italicBtn.tabIndex).toBe(0);
    expect(boldBtn.tabIndex).toBe(-1);
  });

  it("supports Tabs switching and Bits UI Menu / Menubar interaction", async () => {
    const onTabChange = vi.fn();
    const onMenuSelect = vi.fn();
    const view = render(NavigationTestHost, {
      props: { onTabChange, onMenuSelect },
    });
    await tick();

    const securityTab = view.getByRole("tab", { name: "Security" });
    await fireEvent.click(securityTab);
    await tick();
    expect(onTabChange).toHaveBeenCalledWith("security");
    expect(view.getByText("Security Content")).toBeInTheDocument();

    const menuTrigger = view.getByRole("button", { name: "Actions Menu" });
    await fireEvent.click(menuTrigger);
    await tick();
    expect(menuTrigger).toHaveAttribute("aria-expanded", "true");
    expect(view.getByRole("menuitem", { name: "Rename" })).toBeInTheDocument();
    view.unmount();

    // Context-positioned CoimMenu via anchorPosition
    const ctxMenu = render(CoimMenu, {
      props: {
        open: true,
        anchorPosition: { x: 180, y: 240 },
        children: createRawSnippet(() => ({
          render: () => `<div role="menuitem">Copy Link</div>`,
        })),
      },
    });
    await tick();
    const anchorDiv = ctxMenu.container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(anchorDiv.style.left).toBe("180px");
    expect(anchorDiv.style.top).toBe("240px");
    expect(ctxMenu.getByRole("menuitem", { name: "Copy Link" })).toBeInTheDocument();
  });
});
