import { getContext, setContext } from "svelte";
import {
  ContentType,
  DEFAULT_THEME_CONFIG,
  Elevation,
  THEME_MODE_OPTIONS,
  THEME_OPTIONS,
  TopNavType,
  createStorageKeys,
  type Direction,
  type ModeVariant,
  type StorageKeys,
  type ThemeConfigDefaults,
  type ThemeVariant,
} from "./types.js";
import { COIM_SCREENS } from "../utilities/screen.svelte.js";

const THEME_CONTEXT_KEY = Symbol("coimui-theme-context");

export interface ThemeStateOptions {
  defaults?: Partial<ThemeConfigDefaults>;
  storagePrefix?: string;
  persist?: boolean;
  direction?: Direction;
}

const VALID_THEMES = new Set<string>(Object.values(THEME_OPTIONS));
const VALID_MODES = new Set<string>(THEME_MODE_OPTIONS);
const VALID_CONTENTS = new Set<string>(Object.values(ContentType));
const VALID_TOP_NAVS = new Set<string>(Object.values(TopNavType));
const VALID_ELEVATIONS = new Set<string>(Object.values(Elevation));

function readStoredValue<T extends string>(key: string, validSet: Set<string>): T | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return undefined;
    let parsed: unknown = raw;
    if (raw.startsWith('"') && raw.endsWith('"')) {
      parsed = JSON.parse(raw);
    }
    if (typeof parsed === "string" && validSet.has(parsed)) {
      return parsed as T;
    }
  } catch {
    // Ignore storage read errors in restricted environments
  }
  return undefined;
}

function writeStoredValue(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write errors in restricted environments
  }
}

export class ThemeState {
  readonly defaults: ThemeConfigDefaults;
  readonly storageKeys: StorageKeys;
  readonly persist: boolean;

  theme = $state<ThemeVariant>(DEFAULT_THEME_CONFIG.themeColor);
  mode = $state<ModeVariant>(DEFAULT_THEME_CONFIG.themeMode);
  content = $state<ContentType>(DEFAULT_THEME_CONFIG.contentType);
  topNav = $state<TopNavType>(DEFAULT_THEME_CONFIG.topNavType);
  elevation = $state<Elevation>(DEFAULT_THEME_CONFIG.elevation);
  direction = $state<Direction>("ltr");
  systemPrefersDark = $state<boolean>(false);
  isMobile = $state<boolean>(false);

  resolvedMode = $derived<"light" | "dark">(
    this.mode === "system" ? (this.systemPrefersDark ? "dark" : "light") : this.mode,
  );

  isDarkMode = $derived<boolean>(this.resolvedMode === "dark");

  isTopNavContained = $derived<boolean>(this.topNav === TopNavType.Contained && !this.isMobile);

  constructor(options: ThemeStateOptions = {}) {
    this.defaults = {
      ...DEFAULT_THEME_CONFIG,
      ...options.defaults,
      leftMenuWidth: {
        ...DEFAULT_THEME_CONFIG.leftMenuWidth,
        ...options.defaults?.leftMenuWidth,
      },
    };
    this.storageKeys = createStorageKeys(options.storagePrefix ?? "coimui");
    this.persist = options.persist ?? true;

    this.theme = this.defaults.themeColor;
    this.mode = this.defaults.themeMode;
    this.content = this.defaults.contentType;
    this.topNav = this.defaults.topNavType;
    this.elevation = this.defaults.elevation;
    this.direction = options.direction ?? (this.defaults.locale === "ar" ? "rtl" : "ltr");
  }

  hydrateFromBrowser(): void {
    if (typeof window === "undefined") return;

    if (typeof window.matchMedia === "function") {
      this.systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const bp = COIM_SCREENS[this.defaults.menuPrimaryBreakpoint];
      this.isMobile = !window.matchMedia(`(min-width: ${bp})`).matches;
    }

    if (this.persist) {
      const storedTheme = readStoredValue<ThemeVariant>(this.storageKeys.themeColor, VALID_THEMES);
      const storedMode = readStoredValue<ModeVariant>(this.storageKeys.themeMode, VALID_MODES);
      const storedContent = readStoredValue<ContentType>(this.storageKeys.contentType, VALID_CONTENTS);
      const storedTopNav = readStoredValue<TopNavType>(this.storageKeys.topNavType, VALID_TOP_NAVS);
      const storedElevation = readStoredValue<Elevation>(this.storageKeys.elevation, VALID_ELEVATIONS);

      if (storedTheme) this.theme = storedTheme;
      if (storedMode) this.mode = storedMode;
      if (storedContent) this.content = storedContent;
      if (storedTopNav) this.topNav = storedTopNav;
      if (storedElevation) this.elevation = storedElevation;
    }
  }

  syncDocumentClasses(): void {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const classList = root.classList;

    for (const option of Object.values(THEME_OPTIONS)) {
      if (option !== this.theme) classList.remove(option);
    }
    classList.add(this.theme);

    const activeMode = this.resolvedMode;
    classList.remove(activeMode === "dark" ? "light" : "dark");
    classList.add(activeMode);
    root.style.colorScheme = activeMode;

    classList.remove(Elevation.Elevated, Elevation.Flat);
    classList.add(this.elevation);

    root.setAttribute("dir", this.direction);
  }

  setTheme = (theme: ThemeVariant): void => {
    this.theme = theme;
    if (this.persist) writeStoredValue(this.storageKeys.themeColor, theme);
    this.syncDocumentClasses();
  };

  setMode = (mode: ModeVariant): void => {
    this.mode = mode;
    if (this.persist) writeStoredValue(this.storageKeys.themeMode, mode);
    this.syncDocumentClasses();
  };

  setContent = (content: ContentType): void => {
    this.content = content;
    if (this.persist) writeStoredValue(this.storageKeys.contentType, content);
  };

  setTopNav = (topNav: TopNavType): void => {
    this.topNav = topNav;
    if (this.persist) writeStoredValue(this.storageKeys.topNavType, topNav);
  };

  setElevation = (elevation: Elevation): void => {
    this.elevation = elevation;
    if (this.persist) writeStoredValue(this.storageKeys.elevation, elevation);
    this.syncDocumentClasses();
  };

  setDirection = (direction: Direction): void => {
    this.direction = direction;
    this.syncDocumentClasses();
  };

  reset = (): void => {
    this.setTheme(this.defaults.themeColor);
    this.setMode(this.defaults.themeMode);
    this.setContent(this.defaults.contentType);
    this.setTopNav(this.defaults.topNavType);
    this.setElevation(this.defaults.elevation);
  };
}

export function setThemeContext(state: ThemeState): ThemeState {
  setContext(THEME_CONTEXT_KEY, state);
  return state;
}

export function getThemeContext(): ThemeState {
  const ctx = getContext<ThemeState | undefined>(THEME_CONTEXT_KEY);
  if (!ctx) {
    throw new Error("getThemeContext must be called within a CoimThemeProvider");
  }
  return ctx;
}

export function tryGetThemeContext(): ThemeState | undefined {
  try {
    return getContext<ThemeState | undefined>(THEME_CONTEXT_KEY);
  } catch {
    return undefined;
  }
}

export interface ThemeInitScriptOptions {
  storagePrefix?: string;
  defaultTheme?: ThemeVariant;
  defaultMode?: ModeVariant;
  defaultElevation?: Elevation;
}

/**
 * Generates an inline script body for `<head>` (before body paint) so initial
 * palette, light/dark mode, and elevation match persisted settings without FOUC.
 */
export function getThemeInitScript(options: ThemeInitScriptOptions = {}): string {
  const keys = createStorageKeys(options.storagePrefix ?? "coimui");
  const defaultTheme = options.defaultTheme ?? DEFAULT_THEME_CONFIG.themeColor;
  const defaultMode = options.defaultMode ?? DEFAULT_THEME_CONFIG.themeMode;
  const defaultElevation = options.defaultElevation ?? DEFAULT_THEME_CONFIG.elevation;

  return `(function(){try{var d=document.documentElement,c=d.classList;function rd(k,f){var v=localStorage.getItem(k);if(!v)return f;if(v[0]==='"')v=JSON.parse(v);return v||f;}var t=rd(${JSON.stringify(keys.themeColor)},${JSON.stringify(defaultTheme)});var m=rd(${JSON.stringify(keys.themeMode)},${JSON.stringify(defaultMode)});var e=rd(${JSON.stringify(keys.elevation)},${JSON.stringify(defaultElevation)});var sys=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var fm=m==='system'?sys:m;c.remove('theme-purple','theme-blue','theme-green','theme-orange','light','dark','elevated','flat');c.add(t,fm,e);d.style.colorScheme=fm;}catch(_){}})();`;
}
