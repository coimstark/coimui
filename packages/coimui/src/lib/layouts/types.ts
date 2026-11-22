import type { Snippet } from "svelte";
import type { IconName } from "../icons/icon-map.js";
import type { CoimColor } from "../theme/types.js";

export interface CoimNavItem {
  id: string;
  label: string;
  description?: string;
  listIcon?: IconName;
  icon?: IconName;
  href?: string;
  color?: CoimColor;
  children?: CoimNavItem[];
  isExternalLink?: boolean;
  content?: Snippet;
  hideInMenu?: boolean;
}

export type CoimNavMenuItem = CoimNavItem;

export interface OpenedAccordion {
  indent: number;
  id: string;
}

export type TranslateFn = (key: string) => string;
export type NavigateFn = (href: string) => void;

export interface CoimFooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface CoimShortcutItem {
  id: string;
  label: string;
  description: string;
  href?: string;
  icon: IconName;
  colorClass?: string;
  bgClass?: string;
}

export interface CoimNotificationChip {
  id: string;
  label?: string;
  image?: string;
}

export interface CoimNotificationAction {
  id: string;
  label: string;
  type?: "positive" | "negative";
}

export interface CoimNotificationItem {
  id: string;
  labelBold: string;
  labelRegular: string;
  type: "system" | "user";
  avatarImage?: string;
  avatarIcon?: IconName;
  avatarColorMain?: string;
  avatarColorBackground?: string;
  chips?: CoimNotificationChip[];
  actions?: CoimNotificationAction[];
  href?: string;
  time: string;
  temporaryUnread: boolean;
  markedUnread: boolean;
}

export interface CoimUserAccount {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CoimUserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export interface CoimLocaleOption {
  code: string;
  label: string;
  flagSrc?: string;
}

export interface CoimVersionOption {
  label: string;
  href?: string;
}

export interface CoimSearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: "products" | "categories" | "users";
  href?: string;
  avatarSrc?: string;
  icon?: IconName;
  iconBgClass?: string;
  iconColorClass?: string;
  status?: "active" | "inactive";
}
