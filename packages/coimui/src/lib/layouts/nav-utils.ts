import { isPathMatch } from "../utilities/utils.js";
import type { CoimNavItem, TranslateFn } from "./types.js";

/**
 * Human-readable English fallbacks for built-in CoimUI shell keys so consumer apps
 * without custom i18n dictionaries never expose raw key slugs.
 */
export const DEFAULT_LAYOUT_LABELS: Record<string, string> = {
  palette: "Color Palette",
  "theme-purple": "Purple",
  "theme-blue": "Blue",
  "theme-green": "Green",
  "theme-orange": "Orange",
  mode: "Appearance",
  "mode-system": "System",
  "mode-light": "Light",
  "mode-dark": "Dark",
  "left-menu": "Navigation Layout",
  "menu-minimal": "Minimal",
  "menu-comfort": "Comfort",
  "menu-single-layer": "Single Layer",
  content: "Content Width",
  "content-boxed": "Boxed",
  "content-fluid": "Fluid",
  "top-nav": "Header Width",
  "top-nav-contained": "Contained",
  "top-nav-full": "Full Width",
  elevation: "Surface Elevation",
  "elevation-elevated": "Elevated",
  "elevation-flat": "Flat",
  "reset-theme": "Reset Defaults",
  "menu-cta-copy": "Explore CoimUI components, layouts, and guides.",
  "menu-cta-button": "Documentation",
  "user-accounts": "Switch Account",
  "user-add-account": "Manage Accounts",
  "user-overview": "Overview",
  "user-profile": "Profile",
  "user-issues": "Support",
  "user-projects": "Projects",
  "user-mode": "Mode",
  "user-theme": "Theme",
  "user-system": "System",
  "user-light": "Light",
  "user-dark": "Dark",
  "user-purple": "Purple",
  "user-blue": "Blue",
  "user-green": "Green",
  "user-orange": "Orange",
  "user-language": "Language",
  "user-documentation": "Documentation",
  "user-help": "FAQ & Help",
  "user-sign-out": "Sign Out",
  "footer-about": "Overview",
  "footer-docs": "Documentation",
  "footer-purchase": "Plans",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  ar: "العربية",
};

export function resolveLabel(translate: TranslateFn | undefined, key: string): string {
  const translated = translate ? translate(key) : key;
  if (translated !== key) return translated;
  return DEFAULT_LAYOUT_LABELS[key] ?? key;
}

export function navItemMatchesPath(item: CoimNavItem, pathname: string): boolean {
  if (item.href && isPathMatch(pathname, item.href)) return true;
  if (item.children && item.children.length > 0) {
    return item.children.some((child) => navItemMatchesPath(child, pathname));
  }
  return false;
}

/**
 * Resolves the top-level navigation group owning `currentPath`, preferring exact/deep
 * descendant matches before falling back to a root `"/"` parent item.
 */
export function findPrimaryNavItem(
  items: CoimNavItem[],
  bottomItems: CoimNavItem[],
  currentPath: string,
): CoimNavItem | undefined {
  const all = [...items, ...bottomItems];

  const exactChildOwner = all.find(
    (item) =>
      item.children &&
      item.children.some((child) => child.href !== "/" && navItemMatchesPath(child, currentPath)),
  );
  if (exactChildOwner) return exactChildOwner;

  const nonRootMatch = all.find(
    (item) => item.href !== "/" && navItemMatchesPath(item, currentPath),
  );
  if (nonRootMatch) return nonRootMatch;

  return all.find((item) => navItemMatchesPath(item, currentPath));
}
