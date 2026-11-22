export const THEME_OPTIONS = {
  PURPLE: "theme-purple",
  BLUE: "theme-blue",
  GREEN: "theme-green",
  ORANGE: "theme-orange",
} as const;

export type ThemeVariant = (typeof THEME_OPTIONS)[keyof typeof THEME_OPTIONS];

export const THEME_MODE_OPTIONS = ["light", "dark", "system"] as const;
export type ModeVariant = (typeof THEME_MODE_OPTIONS)[number];

export const ContentType = {
  Boxed: "boxed",
  Fluid: "fluid",
} as const;
export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export const Elevation = {
  Elevated: "elevated",
  Flat: "flat",
} as const;
export type Elevation = (typeof Elevation)[keyof typeof Elevation];

export const MenuType = {
  Minimal: "minimal",
  Comfort: "comfort",
  SingleLayer: "single-layer",
} as const;
export type MenuType = (typeof MenuType)[keyof typeof MenuType];

export const MenuShowState = {
  Show: "SHOW",
  Hide: "HIDE",
  TemporaryShow: "TEMPORARY_SHOW",
} as const;
export type MenuShowState = (typeof MenuShowState)[keyof typeof MenuShowState];

export type MenuWidth = { primary: number; secondary: number };
export type MenuDefaultWidth = {
  [MenuType.Minimal]: MenuWidth;
  [MenuType.Comfort]: MenuWidth;
  [MenuType.SingleLayer]: MenuWidth;
};

export const TopNavType = {
  Contained: "contained",
  Full: "full",
} as const;
export type TopNavType = (typeof TopNavType)[keyof typeof TopNavType];

export type Direction = "ltr" | "rtl";

export type CoimColor =
  | "primary"
  | "secondary"
  | "accent-1"
  | "accent-2"
  | "accent-3"
  | "accent-4"
  | "accent-5"
  | "accent-6"
  | "text-primary"
  | "text-secondary"
  | "text-disabled"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "grey";

export interface ThemeConfigDefaults {
  locale: string;
  themeColor: ThemeVariant;
  themeMode: ModeVariant;
  elevation: Elevation;
  contentType: ContentType;
  topNavType: TopNavType;
  leftMenuType: MenuType;
  leftMenuWidth: MenuDefaultWidth;
  transitionDuration: number;
  menuPrimaryBreakpoint: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  menuSecondaryBreakpoint: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

export interface StorageKeys {
  locale: string;
  themeColor: string;
  themeMode: string;
  leftMenuType: string;
  contentType: string;
  topNavType: string;
  elevation: string;
}

export const DEFAULT_THEME_CONFIG: ThemeConfigDefaults = {
  locale: "en",
  themeColor: THEME_OPTIONS.PURPLE,
  themeMode: "system",
  elevation: Elevation.Elevated,
  contentType: ContentType.Boxed,
  topNavType: TopNavType.Contained,
  leftMenuType: MenuType.Comfort,
  leftMenuWidth: {
    [MenuType.Minimal]: { primary: 60, secondary: 260 },
    [MenuType.Comfort]: { primary: 116, secondary: 260 },
    [MenuType.SingleLayer]: { primary: 280, secondary: 0 },
  },
  transitionDuration: 150,
  menuPrimaryBreakpoint: "md",
  menuSecondaryBreakpoint: "xl",
};

export function createStorageKeys(prefix = "coimui"): StorageKeys {
  return {
    locale: `${prefix}-locale`,
    themeColor: `${prefix}-theme-color`,
    themeMode: `${prefix}-theme-mode`,
    leftMenuType: `${prefix}-left-menu-type`,
    contentType: `${prefix}-content-type`,
    topNavType: `${prefix}-top-nav-type`,
    elevation: `${prefix}-elevation`,
  };
}
