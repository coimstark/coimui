import type { Snippet } from "svelte";
import type { CoimColor } from "../../theme/types.js";

export interface CoimBreadcrumbItem {
  id?: string;
  label: string;
  href?: string;
  icon?: Snippet;
}

export type CoimLinkUnderline = "none" | "hover" | "always";
export type CoimLinkVariant = "body1" | "body2" | "button";
export type CoimLinkColor = CoimColor | "text-primary" | "text-secondary" | "text-disabled" | "inherit";

export type CoimPaginationSize = "tiny" | "small" | "medium" | "large";
export type CoimPaginationVariant = "text" | "outlined" | "surface";
export type CoimPaginationColor = "standard" | "primary" | "secondary";
export type CoimPaginationShape = "rounded" | "circular";

export type CoimStepperOrientation = "horizontal" | "vertical";
export type CoimMobileStepperVariant = "dots" | "progress" | "text";

export type CoimTabsVariant = "standard" | "scrollable" | "fullWidth";
export type CoimTabsSize = "tiny" | "small" | "medium";

export interface CoimTabOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: Snippet;
  content?: Snippet;
}

export interface CoimMenubarSection {
  value: string;
  label: string;
  disabled?: boolean;
  items: Snippet;
}
