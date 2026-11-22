import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const coimTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "line-clamp": [{ "text-ellipsis-line": ["1", "2", "3", "4", "5", "6"] }],
      shadow: [{ "shadow-darker": ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return coimTwMerge(clsx(inputs));
}

export function isPathMatch(pathname: string, href: string): boolean {
  if (!href) return false;
  const cleanPath = pathname.replace(/\/$/, "") || "/";
  const cleanHref = href.replace(/\/$/, "") || "/";

  if (cleanPath === cleanHref) return true;
  if (cleanHref === "/") return cleanPath === "/";
  if (!cleanPath.startsWith(cleanHref)) return false;

  const pathParts = cleanPath.split("/");
  const menuParts = cleanHref.split("/");

  return pathParts.slice(0, menuParts.length).join("/") === cleanHref;
}

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function colorWithOpacity(color?: string, alpha: number = 0.1): string | undefined {
  if (!color) return color;

  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3,8})$/.test(color)) {
    const hex = color.replace("#", "");
    let r = 0;
    let g = 0;
    let b = 0;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length >= 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
    return `rgba(${r},${g},${b},${alpha})`;
  }

  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(color)) {
    const rgb = color.match(/\d+/g);
    if (rgb && rgb.length === 3) {
      const [r, g, b] = rgb.map(Number);
      return `rgba(${r},${g},${b},${alpha})`;
    }
  }

  if (/^hsl\(var\(.+\)\)$/.test(color)) {
    return color.replace(/\)$/, ` / ${alpha})`);
  }

  return color;
}

export function resolveCssColor(cssVarColor: string): string {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return cssVarColor;
  }
  const match = cssVarColor.match(/var\((--[a-zA-Z0-9-_]+)\)/);
  if (!match) return cssVarColor;
  const value = getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim();
  if (!value) return cssVarColor;
  if (cssVarColor.startsWith("hsl(")) {
    const commaFormatted = value.replace(/^\s*([\d.]+)\s+([\d.]+%)\s+([\d.]+%)\s*$/, "$1, $2, $3");
    return `hsl(${commaFormatted})`;
  }
  return value;
}
