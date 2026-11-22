import type { Snippet } from "svelte";
import type { CoimColor } from "../../theme/types.js";

export type AvatarSize = "nano" | "tiny" | "small" | "medium" | "large";
export type AvatarVariant = "circular" | "rounded" | "square";

export interface CoimAvatarItem {
  id?: string;
  src?: string;
  alt?: string;
  initials?: string;
  color?: CoimColor;
  variant?: AvatarVariant;
}

export interface BadgeAnchorOrigin {
  vertical?: "top" | "bottom";
  horizontal?: "left" | "right";
}

export type TooltipSide = "top" | "bottom" | "left" | "right";
export type TooltipAlign = "start" | "center" | "end";
export type TooltipPlacement =
  | TooltipSide
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end"
  | "left-start"
  | "left-end"
  | "right-start"
  | "right-end";

export type TimelinePosition = "left" | "right" | "alternate" | "alternate-reverse";
export type TimelineDotVariant = "filled" | "outlined";
export type TimelineDotColor = "grey" | CoimColor;

export interface CoimTreeItemData {
  id: string;
  label: string;
  disabled?: boolean;
  editable?: boolean;
  icon?: Snippet;
  children?: CoimTreeItemData[];
}
