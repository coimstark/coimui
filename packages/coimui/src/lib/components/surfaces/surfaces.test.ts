import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { createRawSnippet, tick } from "svelte";
import { CoimDivider, CoimTypography } from "../foundation/index.js";
import {
  CoimBox,
  CoimContainer,
  CoimGrid,
  CoimImageList,
  CoimImageListItem,
  CoimImageListItemBar,
  CoimMasonry,
  CoimStack,
} from "../layout/index.js";
import AccordionTestHost from "../../../tests/AccordionTestHost.svelte";
import {
  CoimCard,
  CoimCardActionArea,
  CoimCardActions,
  CoimCardContent,
  CoimCardHeader,
  CoimCardMedia,
  CoimPaper,
  CoimSurface,
} from "./index.js";

describe("Foundation, Layout & Surfaces", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders CoimTypography and CoimDivider variants semantically", () => {
    const typo = render(CoimTypography, {
      props: {
        variant: "h3",
        color: "primary",
        gutterBottom: true,
        noWrap: true,
        ellipsisLines: 2,
        children: createRawSnippet(() => ({ render: () => `<span>Heading 3</span>` })),
      },
    });
    const h3 = typo.container.querySelector("h3") as HTMLElement;
    expect(h3).toHaveClass("coim-typography-h3", "text-primary", "coim-typography-nowrap", "text-ellipsis-line-2");
    typo.unmount();

    const div = render(CoimDivider, {
      props: {
        orientation: "horizontal",
        variant: "middle",
        size: "large",
        textAlign: "left",
        children: createRawSnippet(() => ({ render: () => `<span>OR</span>` })),
      },
    });
    const sep = div.getByRole("separator");
    expect(sep).toHaveClass("coim-divider-middle", "coim-divider-large", "coim-divider-text-left");
    expect(sep).toHaveTextContent("OR");
  });

  it("renders CoimBox, CoimContainer, CoimStack, CoimGrid, CoimImageList*, and CoimMasonry", () => {
    const box = render(CoimBox, {
      props: { as: "section", class: "p-4", children: createRawSnippet(() => ({ render: () => `<span>Box</span>` })) },
    });
    expect(box.container.querySelector("section.p-4")).toHaveTextContent("Box");
    box.unmount();

    const cont = render(CoimContainer, {
      props: { maxWidth: "md", children: createRawSnippet(() => ({ render: () => `<span>Contained</span>` })) },
    });
    expect(cont.container.querySelector(".coim-container")).toBeTruthy();
    cont.unmount();

    const stack = render(CoimStack, {
      props: { direction: "row", spacing: 2, children: createRawSnippet(() => ({ render: () => `<span>StackItem</span>` })) },
    });
    expect(stack.container.querySelector(".coim-stack")).toBeTruthy();
    stack.unmount();

    const grid = render(CoimGrid, {
      props: {
        container: true,
        spacing: 3,
        size: { xs: 12, md: 6 },
        children: createRawSnippet(() => ({ render: () => `<div>Cell</div>` })),
      },
    });
    const gridEl = grid.container.querySelector(".coim-grid") as HTMLElement;
    expect(gridEl).toHaveClass("coim-grid-container", "coim-grid-xs-12", "coim-grid-md-6");
    grid.unmount();

    const il = render(CoimImageList, {
      props: {
        variant: "masonry",
        cols: 3,
        gap: 8,
        children: createRawSnippet(() => ({ render: () => `<li class="tile">1</li>` })),
      },
    });
    expect(il.container.querySelector(".coim-image-list-masonry")).toBeTruthy();
    il.unmount();

    const item = render(CoimImageListItem, {
      props: { cols: 2, rows: 2, children: createRawSnippet(() => ({ render: () => `<img alt="a" src="/a.png" />` })) },
    });
    expect(item.container.querySelector(".coim-image-list-item")?.getAttribute("style")).toContain("grid-column-end: span 2");
    item.unmount();

    const bar = render(CoimImageListItemBar, {
      props: { title: "Preview", subtitle: "2026", position: "top" },
    });
    expect(bar.container.querySelector(".coim-image-list-item-bar-top")).toHaveTextContent("Preview");
    bar.unmount();

    const masonry = render(CoimMasonry, {
      props: { columns: { xs: 2, lg: 4 }, spacing: 2, children: createRawSnippet(() => ({ render: () => `<div>Tile</div>` })) },
    });
    expect(masonry.container.querySelector(".coim-masonry")?.getAttribute("style")).toContain("--coim-msn-cols-lg: 4");
  });

  it("renders CoimPaper, CoimSurface, and CoimCard composition including CoimCardActionArea", async () => {
    const paper = render(CoimPaper, {
      props: { elevation: 3, square: true, children: createRawSnippet(() => ({ render: () => `<span>P3</span>` })) },
    });
    expect(paper.container.querySelector(".coim-paper")).toHaveClass("coim-paper-elevation-3", "coim-paper-square");
    paper.unmount();

    const surface = render(CoimSurface, {
      props: { variant: "outlined", children: createRawSnippet(() => ({ render: () => `<span>Surf</span>` })) },
    });
    expect(surface.container.querySelector(".coim-surface")).toHaveClass("coim-paper-outlined");
    surface.unmount();

    const card = render(CoimCard, {
      props: { raised: true, children: createRawSnippet(() => ({ render: () => `<span>Card</span>` })) },
    });
    expect(card.container.querySelector(".coim-card")).toHaveClass("coim-paper-elevation-4");
    card.unmount();

    const header = render(CoimCardHeader, {
      props: { title: "Monthly Revenue", subheader: "Updated now" },
    });
    expect(header.getByText("Monthly Revenue")).toHaveClass("coim-card-header-title");
    expect(header.getByText("Updated now")).toHaveClass("coim-card-header-subheader");
    header.unmount();

    const content = render(CoimCardContent, {
      props: { children: createRawSnippet(() => ({ render: () => `<h5 class="card-title">Stats</h5>` })) },
    });
    expect(content.container.querySelector(".coim-card-content .card-title")).toBeTruthy();
    content.unmount();

    const actions = render(CoimCardActions, {
      props: { children: createRawSnippet(() => ({ render: () => `<button>Save</button>` })) },
    });
    expect(actions.container.querySelector(".coim-card-actions-spacing")).toBeTruthy();
    actions.unmount();

    const onClick = vi.fn();
    const actionArea = render(CoimCardActionArea, {
      props: { onclick: onClick, children: createRawSnippet(() => ({ render: () => `<span>Open</span>` })) },
    });
    await fireEvent.click(actionArea.getByRole("button", { name: "Open" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    actionArea.unmount();

    const media = render(CoimCardMedia, {
      props: { component: "img", image: "/images/products/product-1.jpg", alt: "Product", height: 140 },
    });
    expect(media.getByAltText("Product")).toHaveClass("coim-card-media-img");
  });

  it("supports standalone CoimAccordion expand/collapse and CoimAccordionGroup", async () => {
    const onStandaloneChange = vi.fn();
    const view = render(AccordionTestHost, {
      props: {
        groupValue: "one",
        standaloneExpanded: false,
        onStandaloneChange,
      },
    });
    await tick();

    const triggerOne = view.getByRole("button", { name: "Section One" });
    const triggerTwo = view.getByRole("button", { name: "Section Two" });
    const triggerStandalone = view.getByRole("button", { name: "Standalone Section" });

    expect(triggerOne).toHaveAttribute("aria-expanded", "true");
    expect(triggerTwo).toHaveAttribute("aria-expanded", "false");
    expect(triggerStandalone).toHaveAttribute("aria-expanded", "false");
    expect(view.container.querySelector(".coim-accordion-bordered")).toBeTruthy();
    expect(view.container.querySelector(".coim-accordion-surface")).toBeTruthy();
    expect(view.container.querySelector(".coim-accordion-actions")).toBeTruthy();
    expect(view.container.querySelector(".accordion-rotate")).toBeTruthy();

    await fireEvent.click(triggerTwo);
    await tick();
    expect(triggerTwo).toHaveAttribute("aria-expanded", "true");
    expect(triggerOne).toHaveAttribute("aria-expanded", "false");

    await fireEvent.click(triggerStandalone);
    await tick();
    expect(onStandaloneChange).toHaveBeenCalledWith(true);
    expect(triggerStandalone).toHaveAttribute("aria-expanded", "true");
  });
});
