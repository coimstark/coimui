import type { CoimColor } from "../../theme/types.js";
import type {
  CoimButtonSize,
  CoimButtonVariant,
  CoimFabSize,
  CoimToggleButtonVariant,
} from "./types.js";

/**
 * Shared Tailwind utility class lookup tables for all 16 `CoimColor` tokens
 * and component sizes/variants so components stay consistent and concise.
 */

export const BUTTON_COLOR_CLASSES: Record<CoimButtonVariant, Record<CoimColor, string>> = {
  contained: {
    primary: "bg-primary text-text-contrast hover:bg-primary-light active:bg-primary-dark",
    secondary: "bg-secondary text-text-contrast hover:bg-secondary-light active:bg-secondary-dark",
    "accent-1": "bg-accent-1 text-text-contrast hover:bg-accent-1-light active:bg-accent-1-dark",
    "accent-2": "bg-accent-2 text-text-contrast hover:bg-accent-2-light active:bg-accent-2-dark",
    "accent-3": "bg-accent-3 text-text-contrast hover:bg-accent-3-light active:bg-accent-3-dark",
    "accent-4": "bg-accent-4 text-text-contrast hover:bg-accent-4-light active:bg-accent-4-dark",
    "accent-5": "bg-accent-5 text-text-contrast hover:bg-accent-5-light active:bg-accent-5-dark",
    "accent-6": "bg-accent-6 text-text-contrast hover:bg-accent-6-light active:bg-accent-6-dark",
    "text-primary":
      "bg-text-primary text-text-contrast-alternative hover:bg-text-primary-light active:bg-text-primary-dark",
    "text-secondary":
      "bg-text-secondary text-text-contrast-alternative hover:bg-text-secondary-light active:bg-text-secondary-dark",
    "text-disabled":
      "bg-text-disabled text-text-contrast-alternative hover:bg-text-disabled-light active:bg-text-disabled-dark",
    success: "bg-success text-text-contrast hover:bg-success-light active:bg-success-dark",
    error: "bg-error text-text-contrast hover:bg-error-light active:bg-error-dark",
    warning: "bg-warning text-text-contrast hover:bg-warning-light active:bg-warning-dark",
    info: "bg-info text-text-contrast hover:bg-info-light active:bg-info-dark",
    grey: "bg-grey-25 text-text-primary hover:bg-grey-50 active:bg-grey-100",
  },
  outlined: {
    primary: "border-primary text-primary hover:bg-primary-light/10 hover:text-primary-dark active:bg-primary-light/15",
    secondary:
      "border-secondary text-secondary hover:bg-secondary-light/10 hover:text-secondary-dark active:bg-secondary-light/15",
    "accent-1":
      "border-accent-1 text-accent-1 hover:bg-accent-1-light/10 hover:text-accent-1-dark active:bg-accent-1-light/15",
    "accent-2":
      "border-accent-2 text-accent-2 hover:bg-accent-2-light/10 hover:text-accent-2-dark active:bg-accent-2-light/15",
    "accent-3":
      "border-accent-3 text-accent-3 hover:bg-accent-3-light/10 hover:text-accent-3-dark active:bg-accent-3-light/15",
    "accent-4":
      "border-accent-4 text-accent-4 hover:bg-accent-4-light/10 hover:text-accent-4-dark active:bg-accent-4-light/15",
    "accent-5":
      "border-accent-5 text-accent-5 hover:bg-accent-5-light/10 hover:text-accent-5-dark active:bg-accent-5-light/15",
    "accent-6":
      "border-accent-6 text-accent-6 hover:bg-accent-6-light/10 hover:text-accent-6-dark active:bg-accent-6-light/15",
    "text-primary": "border-text-primary text-text-primary hover:bg-grey-500/10 active:bg-grey-500/15",
    "text-secondary": "border-text-secondary text-text-secondary hover:bg-grey-500/10 active:bg-grey-500/15",
    "text-disabled": "border-text-disabled text-text-disabled hover:bg-grey-500/10 active:bg-grey-500/15",
    success: "border-success text-success hover:bg-success-light/10 hover:text-success-dark active:bg-success-light/15",
    error: "border-error text-error hover:bg-error-light/10 hover:text-error-dark active:bg-error-light/15",
    warning: "border-warning text-warning hover:bg-warning-light/10 hover:text-warning-dark active:bg-warning-light/15",
    info: "border-info text-info hover:bg-info-light/10 hover:text-info-dark active:bg-info-light/15",
    grey: "border-grey-200 text-text-primary hover:bg-grey-200/10 hover:text-text-primary-dark active:bg-grey-200/15",
  },
  text: {
    primary: "text-primary hover:bg-primary-light/10 hover:text-primary-dark active:bg-primary-light/15",
    secondary: "text-secondary hover:bg-secondary-light/10 hover:text-secondary-dark active:bg-secondary-light/15",
    "accent-1": "text-accent-1 hover:bg-accent-1-light/10 hover:text-accent-1-dark active:bg-accent-1-light/15",
    "accent-2": "text-accent-2 hover:bg-accent-2-light/10 hover:text-accent-2-dark active:bg-accent-2-light/15",
    "accent-3": "text-accent-3 hover:bg-accent-3-light/10 hover:text-accent-3-dark active:bg-accent-3-light/15",
    "accent-4": "text-accent-4 hover:bg-accent-4-light/10 hover:text-accent-4-dark active:bg-accent-4-light/15",
    "accent-5": "text-accent-5 hover:bg-accent-5-light/10 hover:text-accent-5-dark active:bg-accent-5-light/15",
    "accent-6": "text-accent-6 hover:bg-accent-6-light/10 hover:text-accent-6-dark active:bg-accent-6-light/15",
    "text-primary": "text-text-primary hover:bg-grey-500/10 active:bg-grey-500/15",
    "text-secondary": "text-text-secondary hover:bg-grey-500/10 active:bg-grey-500/15",
    "text-disabled": "text-text-disabled hover:bg-grey-500/10 active:bg-grey-500/15",
    success: "text-success hover:bg-success-light/10 hover:text-success-dark active:bg-success-light/15",
    error: "text-error hover:bg-error-light/10 hover:text-error-dark active:bg-error-light/15",
    warning: "text-warning hover:bg-warning-light/10 hover:text-warning-dark active:bg-warning-light/15",
    info: "text-info hover:bg-info-light/10 hover:text-info-dark active:bg-info-light/15",
    grey: "text-text-primary hover:bg-grey-25 active:bg-grey-50",
  },
  pastel: {
    primary: "bg-primary-light/10 text-primary-dark hover:bg-primary-light/20 active:bg-primary-light/25",
    secondary: "bg-secondary-light/10 text-secondary-dark hover:bg-secondary-light/20 active:bg-secondary-light/25",
    "accent-1": "bg-accent-1-light/10 text-accent-1-dark hover:bg-accent-1-light/20 active:bg-accent-1-light/25",
    "accent-2": "bg-accent-2-light/10 text-accent-2-dark hover:bg-accent-2-light/20 active:bg-accent-2-light/25",
    "accent-3": "bg-accent-3-light/10 text-accent-3-dark hover:bg-accent-3-light/20 active:bg-accent-3-light/25",
    "accent-4": "bg-accent-4-light/10 text-accent-4-dark hover:bg-accent-4-light/20 active:bg-accent-4-light/25",
    "accent-5": "bg-accent-5-light/10 text-accent-5-dark hover:bg-accent-5-light/20 active:bg-accent-5-light/25",
    "accent-6": "bg-accent-6-light/10 text-accent-6-dark hover:bg-accent-6-light/20 active:bg-accent-6-light/25",
    "text-primary": "bg-grey-500/10 text-text-primary hover:bg-grey-500/20 active:bg-grey-500/25",
    "text-secondary": "bg-grey-500/10 text-text-secondary hover:bg-grey-500/20 active:bg-grey-500/25",
    "text-disabled": "bg-grey-500/10 text-text-disabled hover:bg-grey-500/20 active:bg-grey-500/25",
    success: "bg-success-light/10 text-success-dark hover:bg-success-light/20 active:bg-success-light/25",
    error: "bg-error-light/10 text-error-dark hover:bg-error-light/20 active:bg-error-light/25",
    warning: "bg-warning-light/10 text-warning-dark hover:bg-warning-light/20 active:bg-warning-light/25",
    info: "bg-info-light/10 text-info-dark hover:bg-info-light/20 active:bg-info-light/25",
    grey: "bg-grey-25 text-text-primary hover:bg-grey-50 active:bg-grey-50",
  },
  surface: {
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
    grey: "text-text-primary",
  },
};

export const BUTTON_SIZE_CLASSES: Record<CoimButtonSize, string> = {
  tiny: "coim-btn-size-tiny min-w-7 rounded-xs px-3.5 py-1.5 text-sm leading-4",
  small: "coim-btn-size-small min-w-8 rounded-sm px-4 py-2 text-base leading-4",
  medium: "coim-btn-size-medium min-w-9 rounded-md px-5 py-2 text-base leading-5",
  large: "coim-btn-size-large min-w-10 rounded-lg px-6 py-2 text-base leading-6",
};

export const BUTTON_OUTLINED_SIZE_CLASSES: Record<CoimButtonSize, string> = {
  tiny: "coim-btn-size-tiny min-w-7 rounded-xs px-[calc(0.875rem-1px)] py-[calc(0.375rem-1px)] text-sm leading-4",
  small: "coim-btn-size-small min-w-8 rounded-sm px-[calc(1rem-1px)] py-[calc(0.5rem-1px)] text-base leading-4",
  medium: "coim-btn-size-medium min-w-9 rounded-md px-[calc(1.25rem-1px)] py-[calc(0.5rem-1px)] text-base leading-5",
  large: "coim-btn-size-large min-w-10 rounded-lg px-[calc(1.5rem-1px)] py-[calc(0.5rem-1px)] text-base leading-6",
};

export const ICON_BUTTON_SIZE_CLASSES: Record<CoimButtonSize, string> = {
  tiny: "coim-btn-size-tiny rounded-xs px-1.5 py-1.5 text-sm leading-4",
  small: "coim-btn-size-small rounded-sm px-2 py-2 text-base leading-4",
  medium: "coim-btn-size-medium rounded-md px-2 py-2 text-base leading-5",
  large: "coim-btn-size-large rounded-lg px-2 py-2 text-base leading-6",
};

export const ICON_BUTTON_OUTLINED_SIZE_CLASSES: Record<CoimButtonSize, string> = {
  tiny: "coim-btn-size-tiny rounded-xs px-[calc(0.375rem-1px)] py-[calc(0.375rem-1px)] text-sm leading-4",
  small: "coim-btn-size-small rounded-sm px-[calc(0.5rem-1px)] py-[calc(0.5rem-1px)] text-base leading-4",
  medium: "coim-btn-size-medium rounded-md px-[calc(0.5rem-1px)] py-[calc(0.5rem-1px)] text-base leading-5",
  large: "coim-btn-size-large rounded-lg px-[calc(0.5rem-1px)] py-[calc(0.5rem-1px)] text-base leading-6",
};

export const FAB_SIZE_CLASSES: Record<CoimFabSize, { circular: string; extended: string }> = {
  small: {
    circular: "coim-fab-size-small coim-fab-circular rounded-sm px-2 py-2 text-base leading-4",
    extended: "coim-fab-size-small coim-fab-extended rounded-sm px-4 py-2 text-base leading-4",
  },
  medium: {
    circular: "coim-fab-size-medium coim-fab-circular rounded-md px-2 py-2 text-base leading-5",
    extended: "coim-fab-size-medium coim-fab-extended rounded-md px-5 py-2 text-base leading-5",
  },
  large: {
    circular: "coim-fab-size-large coim-fab-circular rounded-lg px-2 py-2 text-base leading-6",
    extended: "coim-fab-size-large coim-fab-extended rounded-lg px-6 py-2 text-base leading-6",
  },
  xlarge: {
    circular: "coim-fab-size-xlarge coim-fab-circular rounded-xl px-3 py-3 text-base leading-6",
    extended: "coim-fab-size-xlarge coim-fab-extended rounded-xl px-8 py-3 text-base leading-6",
  },
};

export const FAB_COLOR_CLASSES: Record<CoimColor, string> = {
  primary: "bg-primary text-text-contrast hover:bg-primary-light active:bg-primary-dark",
  secondary: "bg-secondary text-text-contrast hover:bg-secondary-light active:bg-secondary-dark",
  "accent-1": "bg-accent-1 text-text-contrast hover:bg-accent-1-light active:bg-accent-1-dark",
  "accent-2": "bg-accent-2 text-text-contrast hover:bg-accent-2-light active:bg-accent-2-dark",
  "accent-3": "bg-accent-3 text-text-contrast hover:bg-accent-3-light active:bg-accent-3-dark",
  "accent-4": "bg-accent-4 text-text-contrast hover:bg-accent-4-light active:bg-accent-4-dark",
  "accent-5": "bg-accent-5 text-text-contrast hover:bg-accent-5-light active:bg-accent-5-dark",
  "accent-6": "bg-accent-6 text-text-contrast hover:bg-accent-6-light active:bg-accent-6-dark",
  "text-primary":
    "bg-text-primary text-text-contrast-alternative hover:bg-text-primary-light active:bg-text-primary-dark",
  "text-secondary":
    "bg-text-secondary text-text-contrast-alternative hover:bg-text-secondary-light active:bg-text-secondary-dark",
  "text-disabled":
    "bg-text-disabled text-text-contrast-alternative hover:bg-text-disabled-light active:bg-text-disabled-dark",
  success: "bg-success text-text-contrast hover:bg-success-light active:bg-success-dark",
  error: "bg-error text-text-contrast hover:bg-error-light active:bg-error-dark",
  warning: "bg-warning text-text-contrast hover:bg-warning-light active:bg-warning-dark",
  info: "bg-info text-text-contrast hover:bg-info-light active:bg-info-dark",
  grey: "bg-background-paper text-text-primary hover:text-primary hover:bg-grey-25",
};

export const TOGGLE_VARIANT_CLASSES: Record<CoimToggleButtonVariant, Record<CoimColor, string>> = {
  surface: {
    primary: "data-[state=on]:bg-primary data-[state=on]:text-text-contrast",
    secondary: "data-[state=on]:bg-secondary data-[state=on]:text-text-contrast",
    "accent-1": "data-[state=on]:bg-accent-1 data-[state=on]:text-text-contrast",
    "accent-2": "data-[state=on]:bg-accent-2 data-[state=on]:text-text-contrast",
    "accent-3": "data-[state=on]:bg-accent-3 data-[state=on]:text-text-contrast",
    "accent-4": "data-[state=on]:bg-accent-4 data-[state=on]:text-text-contrast",
    "accent-5": "data-[state=on]:bg-accent-5 data-[state=on]:text-text-contrast",
    "accent-6": "data-[state=on]:bg-accent-6 data-[state=on]:text-text-contrast",
    "text-primary": "data-[state=on]:bg-text-primary data-[state=on]:text-text-contrast-alternative",
    "text-secondary": "data-[state=on]:bg-text-secondary data-[state=on]:text-text-contrast-alternative",
    "text-disabled": "data-[state=on]:bg-text-disabled data-[state=on]:text-text-contrast-alternative",
    success: "data-[state=on]:bg-success data-[state=on]:text-text-contrast",
    error: "data-[state=on]:bg-error data-[state=on]:text-text-contrast",
    warning: "data-[state=on]:bg-warning data-[state=on]:text-text-contrast",
    info: "data-[state=on]:bg-info data-[state=on]:text-text-contrast",
    grey: "data-[state=on]:bg-grey-100 data-[state=on]:text-text-primary",
  },
  outlined: {
    primary: "data-[state=on]:border-primary data-[state=on]:text-primary data-[state=on]:bg-transparent",
    secondary: "data-[state=on]:border-secondary data-[state=on]:text-secondary data-[state=on]:bg-transparent",
    "accent-1": "data-[state=on]:border-accent-1 data-[state=on]:text-accent-1 data-[state=on]:bg-transparent",
    "accent-2": "data-[state=on]:border-accent-2 data-[state=on]:text-accent-2 data-[state=on]:bg-transparent",
    "accent-3": "data-[state=on]:border-accent-3 data-[state=on]:text-accent-3 data-[state=on]:bg-transparent",
    "accent-4": "data-[state=on]:border-accent-4 data-[state=on]:text-accent-4 data-[state=on]:bg-transparent",
    "accent-5": "data-[state=on]:border-accent-5 data-[state=on]:text-accent-5 data-[state=on]:bg-transparent",
    "accent-6": "data-[state=on]:border-accent-6 data-[state=on]:text-accent-6 data-[state=on]:bg-transparent",
    "text-primary":
      "data-[state=on]:border-text-primary data-[state=on]:text-text-primary data-[state=on]:bg-transparent",
    "text-secondary":
      "data-[state=on]:border-text-secondary data-[state=on]:text-text-secondary data-[state=on]:bg-transparent",
    "text-disabled":
      "data-[state=on]:border-text-disabled data-[state=on]:text-text-disabled data-[state=on]:bg-transparent",
    success: "data-[state=on]:border-success data-[state=on]:text-success data-[state=on]:bg-transparent",
    error: "data-[state=on]:border-error data-[state=on]:text-error data-[state=on]:bg-transparent",
    warning: "data-[state=on]:border-warning data-[state=on]:text-warning data-[state=on]:bg-transparent",
    info: "data-[state=on]:border-info data-[state=on]:text-info data-[state=on]:bg-transparent",
    grey: "data-[state=on]:border-grey-300 data-[state=on]:text-text-primary data-[state=on]:bg-transparent",
  },
  pastel: {
    primary: "data-[state=on]:bg-primary-light/15 data-[state=on]:text-primary-dark",
    secondary: "data-[state=on]:bg-secondary-light/15 data-[state=on]:text-secondary-dark",
    "accent-1": "data-[state=on]:bg-accent-1-light/15 data-[state=on]:text-accent-1-dark",
    "accent-2": "data-[state=on]:bg-accent-2-light/15 data-[state=on]:text-accent-2-dark",
    "accent-3": "data-[state=on]:bg-accent-3-light/15 data-[state=on]:text-accent-3-dark",
    "accent-4": "data-[state=on]:bg-accent-4-light/15 data-[state=on]:text-accent-4-dark",
    "accent-5": "data-[state=on]:bg-accent-5-light/15 data-[state=on]:text-accent-5-dark",
    "accent-6": "data-[state=on]:bg-accent-6-light/15 data-[state=on]:text-accent-6-dark",
    "text-primary": "data-[state=on]:bg-grey-500/15 data-[state=on]:text-text-primary",
    "text-secondary": "data-[state=on]:bg-grey-500/15 data-[state=on]:text-text-secondary",
    "text-disabled": "data-[state=on]:bg-grey-500/15 data-[state=on]:text-text-disabled",
    success: "data-[state=on]:bg-success-light/15 data-[state=on]:text-success-dark",
    error: "data-[state=on]:bg-error-light/15 data-[state=on]:text-error-dark",
    warning: "data-[state=on]:bg-warning-light/15 data-[state=on]:text-warning-dark",
    info: "data-[state=on]:bg-info-light/15 data-[state=on]:text-info-dark",
    grey: "data-[state=on]:bg-grey-50 data-[state=on]:text-text-primary",
  },
};

export const SELECTION_TEXT_COLOR_CLASSES: Record<CoimColor, string> = {
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
};

export const SWITCH_CHECKED_TRACK_CLASSES: Record<CoimColor, string> = {
  primary: "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
  secondary: "data-[state=checked]:border-secondary data-[state=checked]:bg-secondary",
  "accent-1": "data-[state=checked]:border-accent-1 data-[state=checked]:bg-accent-1",
  "accent-2": "data-[state=checked]:border-accent-2 data-[state=checked]:bg-accent-2",
  "accent-3": "data-[state=checked]:border-accent-3 data-[state=checked]:bg-accent-3",
  "accent-4": "data-[state=checked]:border-accent-4 data-[state=checked]:bg-accent-4",
  "accent-5": "data-[state=checked]:border-accent-5 data-[state=checked]:bg-accent-5",
  "accent-6": "data-[state=checked]:border-accent-6 data-[state=checked]:bg-accent-6",
  "text-primary": "data-[state=checked]:border-text-primary data-[state=checked]:bg-text-primary",
  "text-secondary": "data-[state=checked]:border-text-secondary data-[state=checked]:bg-text-secondary",
  "text-disabled": "data-[state=checked]:border-text-disabled data-[state=checked]:bg-text-disabled",
  success: "data-[state=checked]:border-success data-[state=checked]:bg-success",
  error: "data-[state=checked]:border-error data-[state=checked]:bg-error",
  warning: "data-[state=checked]:border-warning data-[state=checked]:bg-warning",
  info: "data-[state=checked]:border-info data-[state=checked]:bg-info",
  grey: "data-[state=checked]:border-grey-500 data-[state=checked]:bg-grey-500",
};
