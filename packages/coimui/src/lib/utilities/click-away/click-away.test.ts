import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { createRawSnippet, tick } from "svelte";
import { clickAway, CoimClickAwayListener } from "./index.js";
import { CoimPortal } from "../portal/index.js";

describe("clickAway & CoimClickAwayListener", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("ignores clicks inside target node and triggers on clicks outside", () => {
    const container = document.createElement("div");
    const inside = document.createElement("button");
    inside.textContent = "Inside";
    const outside = document.createElement("button");
    outside.textContent = "Outside";
    container.appendChild(inside);
    document.body.appendChild(container);
    document.body.appendChild(outside);

    const onClickAway = vi.fn();
    const action = clickAway(container, onClickAway);

    inside.click();
    expect(onClickAway).not.toHaveBeenCalled();

    outside.click();
    expect(onClickAway).toHaveBeenCalledTimes(1);

    action.destroy?.();
    outside.click();
    expect(onClickAway).toHaveBeenCalledTimes(1);
  });

  it("supports dynamic options updates (enabled, mouseEvent, touchEvent)", () => {
    const container = document.createElement("div");
    const outside = document.createElement("div");
    document.body.append(container, outside);

    const firstCb = vi.fn();
    const secondCb = vi.fn();
    const action = clickAway(container, {
      enabled: false,
      onClickAway: firstCb,
      mouseEvent: "pointerdown",
      touchEvent: false,
    });

    outside.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(firstCb).not.toHaveBeenCalled();

    action.update?.({
      enabled: true,
      onClickAway: secondCb,
      mouseEvent: "mousedown",
      touchEvent: "touchend",
    });

    outside.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(secondCb).not.toHaveBeenCalled();

    outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(secondCb).toHaveBeenCalledTimes(1);

    outside.dispatchEvent(new Event("touchend", { bubbles: true }));
    expect(secondCb).toHaveBeenCalledTimes(2);

    action.destroy?.();
  });

  it("renders CoimClickAwayListener and ignores clicks on portaled descendants", async () => {
    const onClickAway = vi.fn();
    const outside = document.createElement("button");
    outside.textContent = "Outside";
    document.body.appendChild(outside);

    const child = createRawSnippet(() => ({
      render: () => `<div data-testid="inside-box">Inside</div>`,
    }));

    const listenerView = render(CoimClickAwayListener, {
      props: {
        onClickAway,
        children: child,
      },
    });

    await fireEvent.click(listenerView.getByTestId("inside-box"));
    expect(onClickAway).not.toHaveBeenCalled();

    await fireEvent.click(outside);
    expect(onClickAway).toHaveBeenCalledTimes(1);
    listenerView.unmount();

    // Portal inside CoimClickAwayListener
    const portalTarget = document.createElement("div");
    document.body.appendChild(portalTarget);
    const parentEl = document.createElement("div");
    document.body.appendChild(parentEl);

    const portalChild = createRawSnippet(() => ({
      render: () => `<span data-testid="portaled-item">Portaled</span>`,
    }));
    const host = render(CoimPortal, {
      target: parentEl,
      props: {
        container: portalTarget,
        children: portalChild,
      },
    });
    await tick();

    const act = clickAway(parentEl, onClickAway);
    const portaledItem = portalTarget.querySelector('[data-testid="portaled-item"]') as HTMLElement;
    expect(portaledItem).toBeTruthy();
    await fireEvent.click(portaledItem);
    expect(onClickAway).toHaveBeenCalledTimes(1);
    host.unmount();

    act.destroy?.();
  });
});
