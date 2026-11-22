import { cubicInOut, cubicOut } from "svelte/easing";
import type { EasingFunction, TransitionConfig } from "svelte/transition";

export type SlideDirection = "left" | "right" | "up" | "down";
export type CollapseOrientation = "vertical" | "horizontal";
export type TransitionTimeout = number | "auto" | { enter?: number; exit?: number };

export interface CoimTransitionParams {
  delay?: number;
  duration?: number;
  easing?: EasingFunction;
}

export interface CoimScaleTransitionParams extends CoimTransitionParams {
  startScale?: number;
}

export interface CoimSlideParams extends CoimTransitionParams {
  direction?: SlideDirection;
}

export interface CoimCollapseParams extends CoimTransitionParams {
  orientation?: CollapseOrientation;
  collapsedSize?: number;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function resolveTransitionDuration(
  timeout?: TransitionTimeout,
  defaultMs = 225,
  phase: "enter" | "exit" = "enter",
): number {
  if (prefersReducedMotion()) {
    return 0;
  }
  if (typeof timeout === "number" && Number.isFinite(timeout)) {
    return Math.max(0, timeout);
  }
  if (timeout && typeof timeout === "object") {
    const val = phase === "enter" ? timeout.enter : timeout.exit;
    if (typeof val === "number" && Number.isFinite(val)) {
      return Math.max(0, val);
    }
  }
  return defaultMs;
}

function getComputedOpacity(node: Element): number {
  if (typeof getComputedStyle === "undefined") return 1;
  const parsed = Number.parseFloat(getComputedStyle(node).opacity);
  return Number.isFinite(parsed) ? parsed : 1;
}

function getBaseTransform(node: Element): string {
  if (typeof getComputedStyle === "undefined") return "";
  const transform = getComputedStyle(node).transform;
  return transform && transform !== "none" ? `${transform} ` : "";
}

function reducedMotionConfig(): TransitionConfig {
  return {
    delay: 0,
    duration: 0,
    css: () => "",
  };
}

export function coimFade(
  node: Element,
  { delay = 0, duration = 225, easing = cubicOut }: CoimTransitionParams = {},
): TransitionConfig {
  if (prefersReducedMotion()) {
    return reducedMotionConfig();
  }
  const opacity = getComputedOpacity(node);
  return {
    delay,
    duration,
    easing,
    css: (t) => `opacity: ${t * opacity};`,
  };
}

export function coimGrow(
  node: Element,
  {
    delay = 0,
    duration = 250,
    easing = cubicOut,
    startScale = 0.75,
  }: CoimScaleTransitionParams = {},
): TransitionConfig {
  if (prefersReducedMotion()) {
    return reducedMotionConfig();
  }
  const opacity = getComputedOpacity(node);
  const transform = getBaseTransform(node);
  return {
    delay,
    duration,
    easing,
    css: (t) =>
      `opacity: ${t * opacity}; transform: ${transform}scale(${startScale + (1 - startScale) * t});`,
  };
}

export function coimZoom(
  node: Element,
  {
    delay = 0,
    duration = 225,
    easing = cubicOut,
    startScale = 0,
  }: CoimScaleTransitionParams = {},
): TransitionConfig {
  if (prefersReducedMotion()) {
    return reducedMotionConfig();
  }
  const opacity = getComputedOpacity(node);
  const transform = getBaseTransform(node);
  return {
    delay,
    duration,
    easing,
    css: (t) =>
      `opacity: ${t * opacity}; transform: ${transform}scale(${startScale + (1 - startScale) * t});`,
  };
}

export function getSlideOffsetTransform(direction: SlideDirection): string {
  switch (direction) {
    case "right":
      return "translate3d(-100%, 0, 0)";
    case "left":
      return "translate3d(100%, 0, 0)";
    case "down":
      return "translate3d(0, -100%, 0)";
    case "up":
      return "translate3d(0, 100%, 0)";
  }
}

export function coimSlide(
  node: Element,
  {
    delay = 0,
    duration = 225,
    easing = cubicOut,
    direction = "down",
  }: CoimSlideParams = {},
): TransitionConfig {
  if (prefersReducedMotion()) {
    return reducedMotionConfig();
  }
  const transform = getBaseTransform(node);
  const x = direction === "right" ? -100 : direction === "left" ? 100 : 0;
  const y = direction === "down" ? -100 : direction === "up" ? 100 : 0;

  return {
    delay,
    duration,
    easing,
    css: (_t, u) => `transform: ${transform}translate3d(${x * u}%, ${y * u}%, 0);`,
  };
}

export function coimCollapse(
  node: Element,
  {
    delay = 0,
    duration = 250,
    easing = cubicInOut,
    orientation = "vertical",
    collapsedSize = 0,
  }: CoimCollapseParams = {},
): TransitionConfig {
  if (prefersReducedMotion()) {
    return reducedMotionConfig();
  }

  const style = typeof getComputedStyle !== "undefined" ? getComputedStyle(node) : null;
  const el = node as HTMLElement;

  if (orientation === "horizontal") {
    const targetWidth =
      (style ? Number.parseFloat(style.width) : NaN) || el.scrollWidth || 0;
    const paddingStart = style ? Number.parseFloat(style.paddingLeft) || 0 : 0;
    const paddingEnd = style ? Number.parseFloat(style.paddingRight) || 0 : 0;
    const marginStart = style ? Number.parseFloat(style.marginLeft) || 0 : 0;
    const marginEnd = style ? Number.parseFloat(style.marginRight) || 0 : 0;
    const borderStart = style ? Number.parseFloat(style.borderLeftWidth) || 0 : 0;
    const borderEnd = style ? Number.parseFloat(style.borderRightWidth) || 0 : 0;
    const minSize = Math.max(0, collapsedSize);

    return {
      delay,
      duration,
      easing,
      css: (t) =>
        `overflow: hidden;` +
        `width: ${minSize + Math.max(0, targetWidth - minSize) * t}px;` +
        `padding-left: ${t * paddingStart}px;` +
        `padding-right: ${t * paddingEnd}px;` +
        `margin-left: ${t * marginStart}px;` +
        `margin-right: ${t * marginEnd}px;` +
        `border-left-width: ${t * borderStart}px;` +
        `border-right-width: ${t * borderEnd}px;`,
    };
  }

  const targetHeight =
    (style ? Number.parseFloat(style.height) : NaN) || el.scrollHeight || 0;
  const paddingTop = style ? Number.parseFloat(style.paddingTop) || 0 : 0;
  const paddingBottom = style ? Number.parseFloat(style.paddingBottom) || 0 : 0;
  const marginTop = style ? Number.parseFloat(style.marginTop) || 0 : 0;
  const marginBottom = style ? Number.parseFloat(style.marginBottom) || 0 : 0;
  const borderTop = style ? Number.parseFloat(style.borderTopWidth) || 0 : 0;
  const borderBottom = style ? Number.parseFloat(style.borderBottomWidth) || 0 : 0;
  const minSize = Math.max(0, collapsedSize);

  return {
    delay,
    duration,
    easing,
    css: (t) =>
      `overflow: hidden;` +
      `height: ${minSize + Math.max(0, targetHeight - minSize) * t}px;` +
      `padding-top: ${t * paddingTop}px;` +
      `padding-bottom: ${t * paddingBottom}px;` +
      `margin-top: ${t * marginTop}px;` +
      `margin-bottom: ${t * marginBottom}px;` +
      `border-top-width: ${t * borderTop}px;` +
      `border-bottom-width: ${t * borderBottom}px;`,
  };
}
