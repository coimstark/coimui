import { getContext, setContext } from "svelte";
import {
  DEFAULT_THEME_CONFIG,
  MenuShowState,
  MenuType,
  type MenuDefaultWidth,
  type MenuWidth,
} from "../theme/types.js";
import type { CoimNavItem } from "./types.js";

const LAYOUT_CONTEXT_KEY = Symbol("coimui-layout-context");

export interface LayoutStateOptions {
  storageKey?: string;
  defaultMenuType?: MenuType;
  menuDefaultWidth?: MenuDefaultWidth;
  persist?: boolean;
}

const VALID_MENU_TYPES = new Set<string>(Object.values(MenuType));

function readStoredMenuType(key: string): MenuType | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return undefined;
    const parsed = raw.startsWith('"') && raw.endsWith('"') ? JSON.parse(raw) : raw;
    if (typeof parsed === "string" && VALID_MENU_TYPES.has(parsed)) {
      return parsed as MenuType;
    }
  } catch {
    // Ignore storage read failure
  }
  return undefined;
}

function writeStoredMenuType(key: string, value: MenuType): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write failure
  }
}

export class LayoutState {
  readonly storageKey: string = "coimui-left-menu-type";
  readonly defaultMenuType: MenuType = DEFAULT_THEME_CONFIG.leftMenuType;
  readonly menuDefaultWidth: MenuDefaultWidth = DEFAULT_THEME_CONFIG.leftMenuWidth;
  readonly persist: boolean = true;

  mounted = $state(false);
  leftMenuType = $state<MenuType>(DEFAULT_THEME_CONFIG.leftMenuType);
  primaryDefault = $state(true);
  secondaryDefault = $state(true);
  leftPrimaryCurrent = $state<MenuShowState>(MenuShowState.Show);
  leftSecondaryCurrent = $state<MenuShowState>(MenuShowState.Show);
  showLeftMobileButton = $state(false);
  leftShowBackdrop = $state(false);
  temporaryShowPrimaryMenu = $state(false);
  menuSelectedSecondaryItem = $state<CoimNavItem | undefined>(undefined);

  private resetCallback: (() => void) | null = null;

  leftMenuWidth = $derived<MenuWidth>({
    primary:
      this.leftPrimaryCurrent === MenuShowState.Hide
        ? 0
        : this.menuDefaultWidth[this.leftMenuType].primary,
    secondary:
      this.leftSecondaryCurrent === MenuShowState.Hide
        ? 0
        : this.menuDefaultWidth[this.leftMenuType].secondary,
  });

  constructor(options: LayoutStateOptions = {}) {
    this.storageKey = options.storageKey ?? "coimui-left-menu-type";
    this.defaultMenuType = options.defaultMenuType ?? DEFAULT_THEME_CONFIG.leftMenuType;
    this.menuDefaultWidth = options.menuDefaultWidth ?? DEFAULT_THEME_CONFIG.leftMenuWidth;
    this.persist = options.persist ?? true;
    this.leftMenuType = this.defaultMenuType;
  }

  hydrateFromBrowser(): void {
    if (typeof window === "undefined") return;
    if (this.persist) {
      const stored = readStoredMenuType(this.storageKey);
      if (stored) {
        this.leftMenuType = stored;
      }
    }
    this.mounted = true;
  }

  private syncBackdrop(): void {
    this.leftShowBackdrop =
      this.leftPrimaryCurrent === MenuShowState.TemporaryShow ||
      this.leftSecondaryCurrent === MenuShowState.TemporaryShow;
  }

  setLeftMenuType = (menuType: MenuType): void => {
    this.leftMenuType = menuType;
    if (this.persist) writeStoredMenuType(this.storageKey, menuType);
    this.resetLeftMenu();
  };

  setLeftShowBackdrop = (value: boolean): void => {
    this.leftShowBackdrop = value;
  };

  setTemporaryShowPrimaryMenu = (value: boolean): void => {
    this.temporaryShowPrimaryMenu = value;
  };

  setMenuSelectedSecondaryItem = (item: CoimNavItem | undefined): void => {
    this.menuSelectedSecondaryItem = item;
  };

  onResetLeft = (callback: (() => void) | null): (() => void) => {
    this.resetCallback = callback;
    return () => {
      this.resetCallback = null;
    };
  };

  resetLeftMenu = (): void => {
    this.leftPrimaryCurrent = this.primaryDefault ? MenuShowState.Show : MenuShowState.Hide;
    this.leftSecondaryCurrent = this.secondaryDefault ? MenuShowState.Show : MenuShowState.Hide;
    this.syncBackdrop();
    this.resetCallback?.();
  };

  showLeftSecondary = (): void => {
    this.leftSecondaryCurrent = this.secondaryDefault
      ? MenuShowState.Show
      : MenuShowState.TemporaryShow;
    this.syncBackdrop();
  };

  hideLeftSecondary = (): void => {
    if (this.leftSecondaryCurrent === MenuShowState.TemporaryShow) {
      this.leftSecondaryCurrent = MenuShowState.Hide;
    }
    this.syncBackdrop();
  };

  hideLeft = (): void => {
    if (this.leftPrimaryCurrent === MenuShowState.TemporaryShow) {
      this.leftPrimaryCurrent = MenuShowState.Hide;
    }
    if (this.leftSecondaryCurrent === MenuShowState.TemporaryShow) {
      this.leftSecondaryCurrent = MenuShowState.Hide;
    }
    this.syncBackdrop();
  };

  showLeftInMobile = (): void => {
    this.leftPrimaryCurrent = MenuShowState.TemporaryShow;
    this.leftSecondaryCurrent = MenuShowState.TemporaryShow;
    this.syncBackdrop();
  };

  setPrimaryBreakpointMatch = (match: boolean): void => {
    this.showLeftMobileButton = !match;
    if (this.primaryDefault !== match) {
      this.primaryDefault = match;
    }
    this.resetLeftMenu();
  };

  setSecondaryBreakpointMatch = (match: boolean): void => {
    if (this.secondaryDefault !== match) {
      this.secondaryDefault = match;
    }
    this.resetLeftMenu();
  };
}

export function setLayoutContext(state: LayoutState): LayoutState {
  setContext(LAYOUT_CONTEXT_KEY, state);
  return state;
}

export function getLayoutContext(): LayoutState {
  const ctx = getContext<LayoutState | undefined>(LAYOUT_CONTEXT_KEY);
  if (!ctx) {
    throw new Error("getLayoutContext must be called within a CoimAppShell or LayoutProvider");
  }
  return ctx;
}

export function tryGetLayoutContext(): LayoutState | undefined {
  try {
    return getContext<LayoutState | undefined>(LAYOUT_CONTEXT_KEY);
  } catch {
    return undefined;
  }
}
