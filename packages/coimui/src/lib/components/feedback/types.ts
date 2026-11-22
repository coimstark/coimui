import type { CoimColor } from "../../theme/types.js";

export type AlertSeverity = "success" | "info" | "warning" | "error";
export type AlertVariant = "standard" | "outlined" | "filled";

export type DialogMaxWidth = "xs" | "sm" | "md" | "lg" | "xl" | false;
export type DialogScroll = "paper" | "body";
export type DialogCloseReason = "backdropClick" | "escapeKeyDown" | "close";

export type DrawerAnchor = "left" | "right" | "top" | "bottom" | "start" | "end";
export type DrawerVariant = "temporary" | "persistent" | "permanent";

export type ProgressColor = CoimColor | "inherit";
export type CircularProgressVariant = "determinate" | "indeterminate";
export type CircularProgressSize =
  | number
  | "tiny"
  | "small"
  | "medium"
  | "large"
  | "xlarge";
export type LinearProgressVariant = "determinate" | "indeterminate" | "buffer";

export type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded";
export type SkeletonAnimation = "pulse" | "wave" | false;

export type ToastVariant = "default" | "success" | "info" | "warning" | "error";
export type ToastVerticalOrigin = "top" | "bottom";
export type ToastHorizontalOrigin = "left" | "center" | "right";
export type SnackbarCloseReason = "timeout" | "dismiss" | "escapeKeyDown" | "clickaway";

export interface ToastAnchorOrigin {
  vertical: ToastVerticalOrigin;
  horizontal: ToastHorizontalOrigin;
}

export interface ToastAction {
  label: string;
  onClick: (id: string) => void;
}

export interface ToastOptions {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  autoHideDuration?: number | null;
  anchorOrigin?: ToastAnchorOrigin;
  action?: ToastAction;
  closable?: boolean;
  onClose?: (reason: "timeout" | "dismiss" | "maxStack") => void;
}

export interface ToastItem {
  id: string;
  message: string;
  title?: string;
  description?: string;
  variant: ToastVariant;
  autoHideDuration: number | null;
  anchorOrigin: ToastAnchorOrigin;
  action?: ToastAction;
  closable: boolean;
  onClose?: (reason: "timeout" | "dismiss" | "maxStack") => void;
  createdAt: number;
}

export type PopperPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export interface PopoverAnchorOrigin {
  vertical: "top" | "center" | "bottom";
  horizontal: "left" | "center" | "right";
}

export interface PopperVirtualElement {
  getBoundingClientRect: () => DOMRect;
}

export const PROGRESS_COLOR_TEXT_CLASS: Record<ProgressColor, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  "accent-1": "text-accent-1",
  "accent-2": "text-accent-2",
  "accent-3": "text-accent-3",
  "accent-4": "text-accent-4",
  "accent-5": "text-accent-5",
  "accent-6": "text-accent-6",
  "text-primary": "text-text-primary",
  "text-secondary": "text-text-secondary",
  "text-disabled": "text-text-disabled",
  success: "text-success",
  error: "text-error",
  warning: "text-warning",
  info: "text-info",
  grey: "text-grey-500",
  inherit: "text-current",
};
