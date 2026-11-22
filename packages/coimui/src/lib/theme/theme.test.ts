import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/svelte";
import { tick } from "svelte";
import {
  ContentType,
  Elevation,
  THEME_OPTIONS,
  TopNavType,
  ThemeState,
  getThemeInitScript,
  CoimThemeProvider,
} from "./index.js";

describe("ThemeState & CoimThemeProvider", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    document.documentElement.className = "";
    document.documentElement.removeAttribute("dir");
    document.documentElement.style.colorScheme = "";
  });

  it("initializes with CoimUI defaults and switches all 4 palettes, modes, elevation, content & topNav", () => {
    const state = new ThemeState({ storagePrefix: "test-coimui" });
    expect(state.theme).toBe(THEME_OPTIONS.PURPLE);
    expect(state.mode).toBe("system");
    expect(state.elevation).toBe(Elevation.Elevated);
    expect(state.content).toBe(ContentType.Boxed);
    expect(state.topNav).toBe(TopNavType.Contained);
    expect(state.direction).toBe("ltr");

    state.setTheme(THEME_OPTIONS.BLUE);
    state.setMode("dark");
    state.setElevation(Elevation.Flat);
    state.setContent(ContentType.Fluid);
    state.setTopNav(TopNavType.Full);
    state.setDirection("rtl");

    expect(document.documentElement.classList.contains("theme-blue")).toBe(true);
    expect(document.documentElement.classList.contains("theme-purple")).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("flat")).toBe(true);
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(JSON.parse(localStorage.getItem("test-coimui-theme-color")!)).toBe("theme-blue");
    expect(JSON.parse(localStorage.getItem("test-coimui-theme-mode")!)).toBe("dark");

    state.reset();
    expect(state.theme).toBe(THEME_OPTIONS.PURPLE);
    expect(state.mode).toBe("system");
    expect(state.elevation).toBe(Elevation.Elevated);
    expect(state.content).toBe(ContentType.Boxed);
    expect(state.topNav).toBe(TopNavType.Contained);
  });

  it("listens to matchMedia prefers-color-scheme change events when mode is system", async () => {
    let changeListener: ((e: MediaQueryListEvent) => void) | null = null;
    const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-color-scheme: dark") ? false : true,
      media: query,
      addEventListener: (_type: string, fn: (e: MediaQueryListEvent) => void) => {
        if (query.includes("prefers-color-scheme: dark")) changeListener = fn;
      },
      removeEventListener: vi.fn(),
    }));
    vi.stubGlobal("matchMedia", matchMediaMock);

    render(CoimThemeProvider, { props: { storagePrefix: "mql-test" } });
    await tick();

    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(changeListener).not.toBeNull();

    changeListener!({ matches: true } as MediaQueryListEvent);
    await tick();

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    vi.unstubAllGlobals();
  });

  it("generates FOUC-free init script that sets html classes synchronously", () => {
    localStorage.setItem("init-test-theme-color", JSON.stringify("theme-green"));
    localStorage.setItem("init-test-theme-mode", JSON.stringify("dark"));
    localStorage.setItem("init-test-elevation", JSON.stringify("flat"));

    const script = getThemeInitScript({ storagePrefix: "init-test" });
    new Function(script)();

    expect(document.documentElement.classList.contains("theme-green")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("flat")).toBe(true);
  });
});
