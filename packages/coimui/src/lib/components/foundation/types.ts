import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import type { CoimColor } from "../../theme/types.js";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2"
  | "button"
  | "overline"
  | "caption"
  | "inherit";

export type TypographyAlign = "inherit" | "left" | "center" | "right" | "justify";

export type TypographyColor =
  | CoimColor
  | "inherit"
  | "text-muted"
  | "text-contrast"
  | "text.primary"
  | "text.secondary"
  | "text.disabled";

export type TypographyEllipsisLines = 1 | 2 | 3 | 4 | 5 | 6;

export interface CoimTypographyProps extends Omit<HTMLAttributes<HTMLElement>, "color"> {
  variant?: TypographyVariant;
  component?: string;
  as?: string;
  color?: TypographyColor;
  gutterBottom?: boolean;
  noWrap?: boolean;
  align?: TypographyAlign;
  ellipsisLines?: TypographyEllipsisLines;
  class?: string;
  children?: Snippet;
}

export type DividerOrientation = "horizontal" | "vertical";
export type DividerVariant = "fullWidth" | "inset" | "middle";
export type DividerSize = "medium" | "large";
export type DividerTextAlign = "center" | "left" | "right";

export interface CoimDividerProps extends HTMLAttributes<HTMLElement> {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  size?: DividerSize;
  textAlign?: DividerTextAlign;
  flexItem?: boolean;
  component?: string;
  as?: string;
  role?: string;
  class?: string;
  children?: Snippet;
}
