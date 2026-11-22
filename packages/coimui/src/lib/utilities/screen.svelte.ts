export const COIM_SCREENS = {
  sm: "480px",
  md: "960px",
  lg: "1280px",
  xl: "1440px",
  "2xl": "1640px",
  "3xl": "1900px",
} as const;

export type ScreenBreakpoint = keyof typeof COIM_SCREENS;

export function createMediaQueryState(query: string, initialValue = false) {
  let matches = $state(initialValue);

  $effect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mql = window.matchMedia(query);
    matches = mql.matches;

    const handleChange = (event: MediaQueryListEvent) => {
      matches = event.matches;
    };

    mql.addEventListener("change", handleChange);
    return () => {
      mql.removeEventListener("change", handleChange);
    };
  });

  return {
    get matches() {
      return matches;
    },
  };
}

export function createBreakpointState(breakpoint: ScreenBreakpoint, initialValue = false) {
  return createMediaQueryState(`(min-width: ${COIM_SCREENS[breakpoint]})`, initialValue);
}

export function isMinWidth(breakpoint: ScreenBreakpoint): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(`(min-width: ${COIM_SCREENS[breakpoint]})`).matches;
}
