import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/svelte";
import { createRawSnippet, tick } from "svelte";
import {
  CoimCollapse,
  CoimFade,
  CoimGrow,
  CoimSlide,
  CoimZoom,
  coimCollapse,
  coimFade,
  coimGrow,
  coimSlide,
  coimZoom,
  prefersReducedMotion,
} from "./index.js";

function stubReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? matches : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("CoimUI Transitions", () => {
  beforeEach(() => {
    cleanup();
    stubReducedMotion(false);
  });

  it("computes CSS transition configs for fade, grow, zoom, slide, and collapse", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const fade = coimFade(el, { duration: 300 });
    expect(fade.duration).toBe(300);
    expect(fade.css?.(0.5, 0.5)).toContain("opacity: 0.5");

    const grow = coimGrow(el, { duration: 250 });
    expect(grow.duration).toBe(250);
    expect(grow.css?.(0, 1)).toContain("scale(0.75)");
    expect(grow.css?.(1, 0)).toContain("scale(1)");

    const zoom = coimZoom(el, { duration: 200 });
    expect(zoom.duration).toBe(200);
    expect(zoom.css?.(0, 1)).toContain("scale(0)");
    expect(zoom.css?.(1, 0)).toContain("scale(1)");

    const slideRight = coimSlide(el, { direction: "right", duration: 225 });
    expect(slideRight.css?.(0, 1)).toContain("translate3d(-100%, 0%, 0)");

    const slideLeft = coimSlide(el, { direction: "left", duration: 225 });
    expect(slideLeft.css?.(0, 1)).toContain("translate3d(100%, 0%, 0)");

    const slideUp = coimSlide(el, { direction: "up", duration: 225 });
    expect(slideUp.css?.(0, 1)).toContain("translate3d(0%, 100%, 0)");

    const slideDown = coimSlide(el, { direction: "down", duration: 225 });
    expect(slideDown.css?.(0, 1)).toContain("translate3d(0%, -100%, 0)");

    const collapseV = coimCollapse(el, { orientation: "vertical", collapsedSize: 40 });
    expect(collapseV.css?.(0, 1)).toContain("height: 40px");

    const collapseH = coimCollapse(el, { orientation: "horizontal", collapsedSize: 24 });
    expect(collapseH.css?.(0, 1)).toContain("width: 24px");
  });

  it("honors prefers-reduced-motion: reduce with 0ms duration and no transform motion", () => {
    stubReducedMotion(true);
    expect(prefersReducedMotion()).toBe(true);

    const el = document.createElement("div");
    expect(coimFade(el, { duration: 500 }).duration).toBe(0);
    expect(coimGrow(el, { duration: 500 }).css?.(0.5, 0.5)).toBe("");
    expect(coimZoom(el, { duration: 500 }).duration).toBe(0);
    expect(coimSlide(el, { duration: 500, direction: "left" }).css?.(0.5, 0.5)).toBe("");
    expect(coimCollapse(el, { duration: 500 }).duration).toBe(0);

    const child = createRawSnippet(() => ({
      render: () => `<span>Reduced content</span>`,
    }));

    const slide = render(CoimSlide, {
      props: { in: false, direction: "left", timeout: 400, children: child },
    });
    const slideNode = slide.container.querySelector('[data-coim-transition="slide"]') as HTMLElement;
    expect(slideNode.style.transition).toBe("none");
    expect(slideNode.style.transform).toBe("none");
  });

  it("renders declarative transition components and handles unmountOnExit & collapsedSize", async () => {
    const child = createRawSnippet(() => ({
      render: () => `<span>Panel</span>`,
    }));

    const fade = render(CoimFade, {
      props: { in: false, unmountOnExit: true, children: child },
    });
    expect(fade.queryByText("Panel")).toBeNull();

    await fade.rerender({ in: true, unmountOnExit: true, children: child });
    await tick();
    expect(fade.getByText("Panel")).toBeInTheDocument();

    const grow = render(CoimGrow, {
      props: { in: true, timeout: 300, children: child },
    });
    expect(grow.container.querySelector('[data-coim-transition="grow"]')).toHaveAttribute(
      "data-state",
      "entered",
    );

    const zoom = render(CoimZoom, {
      props: { in: false, children: child },
    });
    expect(zoom.container.querySelector('[data-coim-transition="zoom"]')).toHaveAttribute(
      "data-state",
      "exited",
    );

    const collapse = render(CoimCollapse, {
      props: { in: false, collapsedSize: 40, children: child },
    });
    const collapseEl = collapse.container.querySelector(
      '[data-coim-transition="collapse"]',
    ) as HTMLElement;
    expect(collapseEl.style.height).toBe("40px");
    expect(collapseEl.style.visibility).toBe("visible");
  });
});
