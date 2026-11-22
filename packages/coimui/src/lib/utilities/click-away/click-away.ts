import type { ActionReturn } from "svelte/action";
import { isInsidePortaledDescendant } from "../portal/portal-registry.js";

export type ClickAwayMouseEvent = "pointerdown" | "mousedown" | "mouseup" | "click" | false;
export type ClickAwayTouchEvent = "touchstart" | "touchend" | false;

export interface ClickAwayOptions {
  enabled?: boolean;
  onClickAway: (event: Event) => void;
  mouseEvent?: ClickAwayMouseEvent;
  touchEvent?: ClickAwayTouchEvent;
}

export type ClickAwayInput = ((event: Event) => void) | ClickAwayOptions | undefined;

interface NormalizedClickAwayOptions {
  enabled: boolean;
  onClickAway: ((event: Event) => void) | null;
  mouseEvent: ClickAwayMouseEvent;
  touchEvent: ClickAwayTouchEvent;
}

function normalizeOptions(input: ClickAwayInput): NormalizedClickAwayOptions {
  if (typeof input === "function") {
    return {
      enabled: true,
      onClickAway: input,
      mouseEvent: "click",
      touchEvent: "touchend",
    };
  }
  if (!input) {
    return {
      enabled: false,
      onClickAway: null,
      mouseEvent: "click",
      touchEvent: "touchend",
    };
  }
  return {
    enabled: input.enabled ?? true,
    onClickAway: input.onClickAway,
    mouseEvent: input.mouseEvent ?? "click",
    touchEvent: input.touchEvent === undefined ? "touchend" : input.touchEvent,
  };
}

export function clickAway(
  node: HTMLElement,
  initialInput?: ClickAwayInput,
): ActionReturn<ClickAwayInput> {
  if (typeof document === "undefined") {
    return {};
  }

  let current = normalizeOptions(initialInput);
  let moved = false;

  const isTargetInside = (event: Event): boolean => {
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    if (path.includes(node)) {
      return true;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return false;
    }

    if (!target.isConnected) {
      return true;
    }

    if (node.contains(target)) {
      return true;
    }

    return isInsidePortaledDescendant(node, target);
  };

  const handleMouseEvent = (event: Event) => {
    if (!current.enabled || !current.onClickAway) return;
    if (!isTargetInside(event)) {
      current.onClickAway(event);
    }
  };

  const handleTouchMove = () => {
    moved = true;
  };

  const handleTouchEvent = (event: Event) => {
    const wasMoved = moved;
    moved = false;
    if (wasMoved && current.touchEvent === "touchend") {
      return;
    }
    if (!current.enabled || !current.onClickAway) return;
    if (!isTargetInside(event)) {
      current.onClickAway(event);
    }
  };

  let attachedMouse: ClickAwayMouseEvent = false;
  let attachedTouch: ClickAwayTouchEvent = false;

  const detach = () => {
    if (attachedMouse) {
      document.removeEventListener(attachedMouse, handleMouseEvent, true);
      attachedMouse = false;
    }
    if (attachedTouch) {
      document.removeEventListener(attachedTouch, handleTouchEvent, true);
      document.removeEventListener("touchmove", handleTouchMove, true);
      attachedTouch = false;
    }
  };

  const attach = () => {
    if (!current.enabled || !current.onClickAway) return;
    if (current.mouseEvent) {
      document.addEventListener(current.mouseEvent, handleMouseEvent, true);
      attachedMouse = current.mouseEvent;
    }
    if (current.touchEvent) {
      document.addEventListener(current.touchEvent, handleTouchEvent, true);
      document.addEventListener("touchmove", handleTouchMove, true);
      attachedTouch = current.touchEvent;
    }
  };

  attach();

  return {
    update(nextInput: ClickAwayInput) {
      const next = normalizeOptions(nextInput);
      const needsRebind =
        next.enabled !== current.enabled ||
        next.mouseEvent !== current.mouseEvent ||
        next.touchEvent !== current.touchEvent ||
        Boolean(next.onClickAway) !== Boolean(current.onClickAway);

      current = next;

      if (needsRebind) {
        detach();
        attach();
      }
    },
    destroy() {
      detach();
    },
  };
}
