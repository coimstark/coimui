import type { Snippet } from "svelte";
import type { HTMLAnchorAttributes, HTMLAttributes, HTMLButtonAttributes } from "svelte/elements";

export type PaperVariant = "elevation" | "outlined";
export type PaperElevation = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type AccordionVariant = "default" | "basic" | "bordered" | "surface";

export interface CoimPaperProps extends HTMLAttributes<HTMLElement> {
  elevation?: PaperElevation;
  variant?: PaperVariant;
  square?: boolean;
  surface?: boolean;
  component?: string;
  as?: string;
  class?: string;
  children?: Snippet;
}

export interface CoimCardProps extends HTMLAttributes<HTMLElement> {
  raised?: boolean;
  elevation?: PaperElevation;
  variant?: PaperVariant;
  square?: boolean;
  surface?: boolean;
  component?: string;
  as?: string;
  class?: string;
  children?: Snippet;
}

export interface CoimCardHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: string | Snippet;
  subheader?: string | Snippet;
  avatar?: Snippet;
  action?: Snippet;
  class?: string;
}

export interface CoimCardActionsProps extends HTMLAttributes<HTMLElement> {
  disableSpacing?: boolean;
  class?: string;
  children?: Snippet;
}

export interface CoimCardActionAreaBaseProps {
  href?: string;
  disabled?: boolean;
  class?: string;
  children?: Snippet;
}

export type CoimCardActionAreaProps = CoimCardActionAreaBaseProps &
  Omit<HTMLButtonAttributes, keyof CoimCardActionAreaBaseProps> &
  Omit<HTMLAnchorAttributes, keyof CoimCardActionAreaBaseProps>;

export interface CoimCardMediaProps extends HTMLAttributes<HTMLElement> {
  component?: "div" | "img" | "video" | "picture" | "iframe";
  image?: string;
  src?: string;
  alt?: string;
  height?: number | string;
  class?: string;
  style?: string;
  children?: Snippet;
}
