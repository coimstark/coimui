import { COIM_SCREENS } from "../../utilities/screen.svelte.js";
import type { LayoutBreakpoint, ResponsiveValue } from "./types.js";

export const LAYOUT_BREAKPOINTS: readonly LayoutBreakpoint[] = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
] as const;

export const LAYOUT_BREAKPOINT_WIDTHS: Record<LayoutBreakpoint, string> = {
  xs: "0px",
  sm: COIM_SCREENS.sm,
  md: COIM_SCREENS.md,
  lg: COIM_SCREENS.lg,
  xl: COIM_SCREENS.xl,
  "2xl": COIM_SCREENS["2xl"],
  "3xl": COIM_SCREENS["3xl"],
};

export function isBreakpointMap<T>(
  value: ResponsiveValue<T> | undefined,
): value is Partial<Record<LayoutBreakpoint, T>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeResponsive<T>(
  value: ResponsiveValue<T> | undefined,
): Partial<Record<LayoutBreakpoint, T>> {
  if (value === undefined) return {};
  if (isBreakpointMap(value)) return value;
  return { xs: value };
}

export function expandResponsive<T>(
  value: ResponsiveValue<T> | undefined,
  fallback: T,
): Record<LayoutBreakpoint, T> {
  const map = normalizeResponsive(value);
  const result = {} as Record<LayoutBreakpoint, T>;
  let current = map.xs !== undefined ? map.xs : fallback;
  for (const bp of LAYOUT_BREAKPOINTS) {
    if (map[bp] !== undefined) {
      current = map[bp] as T;
    }
    result[bp] = current;
  }
  return result;
}

export function toSpacingCss(value: number | string | undefined): string {
  if (value === undefined) return "0px";
  if (typeof value === "number") {
    return `${value * 4}px`;
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed === "0") return "0px";
  return trimmed;
}

export function mergeInlineStyles(...parts: Array<string | undefined | false>): string | undefined {
  const cleaned = parts
    .filter((p): p is string => Boolean(p && p.trim()))
    .map((p) => p.trim().replace(/;+$/, ""));
  if (cleaned.length === 0) return undefined;
  return `${cleaned.join("; ")};`;
}
