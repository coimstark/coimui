export type IconSize = "large" | "medium" | "small" | "tiny" | number;
export type IconVariant = "outlined" | "contained";

export interface IconProps {
  variant?: IconVariant;
  class?: string;
  size?: IconSize;
  strokeWidth?: number;
  oneTone?: boolean;
  label?: string;
  [key: string]: unknown;
}

export interface FormIconProps {
  class?: string;
  label?: string;
  [key: string]: unknown;
}

export interface IllustrationProps {
  class?: string;
  label?: string;
  [key: string]: unknown;
}

export function sizeHelper(size: IconSize = "medium"): number {
  if (typeof size === "number") {
    return size;
  }
  if (size === "large") {
    return 24;
  }
  if (size === "small" || size === "tiny") {
    return 16;
  }
  return 20;
}

export function strokeSizeHelper(size: number): number {
  if (size === 32) {
    return 1.15;
  }
  if (size >= 20) {
    return 1.5;
  }
  return 1.75;
}
