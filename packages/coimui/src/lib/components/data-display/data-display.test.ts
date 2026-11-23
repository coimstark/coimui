import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { createRawSnippet, tick } from "svelte";
import DataDisplayTestHost from "../../../tests/DataDisplayTestHost.svelte";
import { CoimAvatar, CoimRichTreeView, reorderTreeItems, type CoimTreeItemData } from "./index.js";

describe("Data Display Component Library", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });

  it("renders avatars, badge max cap, deletable chip, list, and timeline opposite layout", async () => {
    const onDeleteChip = vi.fn();
    const onListAction = vi.fn();
    const view = render(DataDisplayTestHost, {
      props: { onDeleteChip, onListAction },
    });
    await tick();

    // Avatar group overflow (+2 when max=2 leaves 1 visible + surplus) and initials
    expect(view.getByText("+2")).toBeInTheDocument();
    expect(view.getByText("CU")).toBeInTheDocument();

    // Badge max formatting
    expect(view.getByText("9+")).toBeInTheDocument();

    // Chip delete
    await fireEvent.click(view.getByRole("button", { name: "Delete" }));
    expect(onDeleteChip).toHaveBeenCalledTimes(1);

    // Interactive list item
    await fireEvent.click(view.getByRole("button", { name: /Interactive row/ }));
    expect(onListAction).toHaveBeenCalledTimes(1);

    // Timeline item without opposite content has modifier class
    const timelineItems = view.container.querySelectorAll(".coim-timeline-item");
    expect(timelineItems).toHaveLength(2);
    expect(timelineItems[0].className).not.toContain("coim-timeline-item-no-opposite");
    expect(timelineItems[1].className).toContain("coim-timeline-item-no-opposite");
  });

  it("supports table sort label aria-sort propagation and table pagination", async () => {
    const onSortToggle = vi.fn();
    const onPageChange = vi.fn();
    const view = render(DataDisplayTestHost, {
      props: { onSortToggle, onPageChange },
    });
    await tick();

    const headerCell = view.container.querySelector("th");
    expect(headerCell).toHaveAttribute("aria-sort", "ascending");

    await fireEvent.click(view.getByRole("button", { name: /Revenue/ }));
    await tick();
    expect(onSortToggle).toHaveBeenCalledWith("desc");
    expect(headerCell).toHaveAttribute("aria-sort", "descending");

    await fireEvent.click(view.getByRole("button", { name: /Next page/i }));
    await tick();
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("supports SimpleTreeView and RichTreeView selection, expansion, and keyboard navigation", async () => {
    const onTreeSelect = vi.fn();
    const view = render(DataDisplayTestHost, {
      props: { onTreeSelect },
    });
    await tick();

    const trees = view.getAllByRole("tree");
    expect(trees).toHaveLength(2);

    const utilsItem = trees[0].querySelector('[data-item-id="utils"]') as HTMLElement;
    await fireEvent.click(utilsItem.querySelector(".coim-tree-item-content")!);
    await tick();
    expect(onTreeSelect).toHaveBeenLastCalledWith(["index", "utils"]);

    const srcItem = trees[0].querySelector('[data-item-id="src"]') as HTMLElement;
    expect(srcItem).toHaveAttribute("aria-expanded", "true");
    srcItem.focus();
    await fireEvent.keyDown(srcItem, { key: "ArrowLeft" });
    await tick();
    expect(srcItem).toHaveAttribute("aria-expanded", "false");
    await fireEvent.keyDown(srcItem, { key: "ArrowRight" });
    await tick();
    expect(srcItem).toHaveAttribute("aria-expanded", "true");

    // Disabled node in RichTreeView
    const locked = trees[1].querySelector('[data-item-id="locked"]') as HTMLElement;
    expect(locked).toHaveAttribute("aria-disabled", "true");
  });

  it("renders colored CoimAvatar without neutral bg-grey-300 override", () => {
    const view = render(CoimAvatar, {
      props: {
        color: "primary",
        initials: "CU",
        children: createRawSnippet(() => ({ render: () => `<span>CU</span>` })),
      },
    });
    const el = view.container.querySelector(".coim-avatar") as HTMLElement;
    expect(el.className).toContain("coim-avatar-color-primary");
    expect(el.className).not.toContain("bg-grey-300");
  });

  it("supports RichTreeView drag-and-drop and Alt+Arrow keyboard reordering with guards", async () => {
    const initialTree: CoimTreeItemData[] = [
      {
        id: "alpha",
        label: "Alpha",
        editable: true,
        children: [{ id: "alpha-1", label: "Alpha Child", editable: true }],
      },
      { id: "beta", label: "Beta", editable: true },
      { id: "gamma", label: "Gamma", editable: true },
    ];

    // Pure cycle guard check: cannot move parent into its own descendant
    const cycleAttempt = reorderTreeItems(initialTree, "alpha", "alpha-1", "inside");
    expect(cycleAttempt).toBe(initialTree);

    const onItemOrderChange = vi.fn();
    const view = render(CoimRichTreeView, {
      props: {
        items: initialTree,
        defaultExpandedItems: ["alpha"],
        reorderable: true,
        canMoveItem: (sourceId: string) => sourceId !== "gamma",
        onItemOrderChange,
      },
    });
    await tick();

    // Alt+ArrowDown moves alpha after beta
    const alphaNode = view.container.querySelector('[data-item-id="alpha"]') as HTMLElement;
    await fireEvent.keyDown(alphaNode, { key: "ArrowDown", altKey: true });
    await tick();
    expect(onItemOrderChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: "beta" }),
        expect.objectContaining({ id: "alpha" }),
        expect.objectContaining({ id: "gamma" }),
      ]),
      { itemId: "alpha", targetId: "beta", position: "after" },
    );

    // Drag & drop reorder on DOM content node
    const betaContent = view.container.querySelector('[data-item-id="beta"] .coim-tree-item-content')!;
    const alphaContent = view.container.querySelector('[data-item-id="alpha"] .coim-tree-item-content')!;
    await fireEvent.dragStart(betaContent);
    await fireEvent.drop(alphaContent);
    await tick();
    expect(onItemOrderChange).toHaveBeenCalledTimes(2);

    // canMoveItem guard prevents moving "gamma"
    const callCountBeforeGuard = onItemOrderChange.mock.calls.length;
    const gammaNode = view.container.querySelector('[data-item-id="gamma"]') as HTMLElement;
    await fireEvent.keyDown(gammaNode, { key: "ArrowUp", altKey: true });
    await tick();
    expect(onItemOrderChange).toHaveBeenCalledTimes(callCountBeforeGuard);
  });
});
