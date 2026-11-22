import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export type LayoutBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export type ResponsiveValue<T> = T | Partial<Record<LayoutBreakpoint, T>>;

export interface CoimBoxProps extends HTMLAttributes<HTMLElement> {
  as?: string;
  component?: string;
  ref?: HTMLElement | null;
  class?: string;
  style?: string;
  children?: Snippet;
}

export type ContainerMaxWidth = LayoutBreakpoint | false;

export interface CoimContainerProps extends HTMLAttributes<HTMLElement> {
  maxWidth?: ContainerMaxWidth;
  fixed?: boolean;
  disableGutters?: boolean;
  as?: string;
  component?: string;
  class?: string;
  style?: string;
  children?: Snippet;
}

export type StackDirection = "row" | "row-reverse" | "column" | "column-reverse";

export interface CoimStackProps extends HTMLAttributes<HTMLElement> {
  direction?: ResponsiveValue<StackDirection>;
  spacing?: ResponsiveValue<number | string>;
  divider?: Snippet;
  alignItems?: string;
  justifyContent?: string;
  useFlexGap?: boolean;
  as?: string;
  component?: string;
  class?: string;
  style?: string;
  children?: Snippet;
}

export type GridSizeValue = number | "grow" | "auto" | false;
export type GridOffsetValue = number | "auto";
export type GridDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type GridWrap = "nowrap" | "wrap" | "wrap-reverse";

export interface CoimGridProps extends HTMLAttributes<HTMLElement> {
  container?: boolean;
  spacing?: ResponsiveValue<number | string>;
  rowSpacing?: ResponsiveValue<number | string>;
  columnSpacing?: ResponsiveValue<number | string>;
  columns?: ResponsiveValue<number>;
  size?: ResponsiveValue<GridSizeValue>;
  offset?: ResponsiveValue<GridOffsetValue>;
  direction?: ResponsiveValue<GridDirection>;
  alignItems?: string;
  justifyContent?: string;
  wrap?: GridWrap;
  as?: string;
  component?: string;
  class?: string;
  style?: string;
  children?: Snippet;
}

export type ImageListVariant = "standard" | "quilted" | "woven" | "masonry";

export interface CoimImageListProps extends HTMLAttributes<HTMLElement> {
  variant?: ImageListVariant;
  cols?: number;
  gap?: number | string;
  rowHeight?: number | "auto";
  as?: string;
  component?: string;
  class?: string;
  style?: string;
  children?: Snippet;
}

export interface CoimImageListItemProps extends HTMLAttributes<HTMLElement> {
  cols?: number;
  rows?: number;
  as?: string;
  component?: string;
  class?: string;
  style?: string;
  children?: Snippet;
}

export type ImageListItemBarPosition = "top" | "bottom" | "below";
export type ImageListItemBarActionPosition = "left" | "right";

export interface CoimImageListItemBarProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: string | Snippet;
  subtitle?: string | Snippet;
  actionIcon?: Snippet;
  actionPosition?: ImageListItemBarActionPosition;
  position?: ImageListItemBarPosition;
  class?: string;
}

export interface CoimMasonryProps extends HTMLAttributes<HTMLElement> {
  columns?: ResponsiveValue<number>;
  spacing?: ResponsiveValue<number | string>;
  sequential?: boolean;
  defaultColumns?: number;
  defaultSpacing?: number | string;
  defaultHeight?: number;
  as?: string;
  component?: string;
  class?: string;
  style?: string;
  children?: Snippet;
}
