import type { Snippet } from "svelte";
import type { CoimColor } from "../../theme/types.js";

export type CoimButtonVariant = "contained" | "outlined" | "text" | "pastel" | "surface";
export type CoimButtonSize = "tiny" | "small" | "medium" | "large";
export type CoimLoadingPosition = "start" | "center" | "end";

export type CoimFabSize = "small" | "medium" | "large" | "xlarge";
export type CoimFabVariant = "circular" | "extended";

export type CoimToggleButtonVariant = "outlined" | "surface" | "pastel";

export type CoimInputVariant = "standard" | "surface-standard" | "outlined" | "filled";
export type CoimInputSize = "small" | "medium";

export type CoimSelectionSize = "small" | "medium";
export type CoimSelectionVariant = "filled" | "outlined";
export type CoimLabelPlacement = "end" | "start" | "top" | "bottom";

export type CoimRatingSize = "small" | "medium" | "large";

export interface CoimMaskOptions {
  /** Pattern string (`0`: digit, `a`: letter, `*`: alphanumeric, `#`: 1-9) or `"currency"`. */
  pattern: string;
  /** Custom token regex map overriding defaults, e.g. `{ "#": /[1-9]/ }`. */
  definitions?: Record<string, RegExp>;
  /** Currency prefix when `pattern === "currency"`. */
  currencyPrefix?: string;
  /** Decimal digits for `"currency"` pattern (default `2`). */
  decimals?: number;
}

export interface CoimSelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface CoimSelectGroup<T = string> {
  label: string;
  options: CoimSelectOption<T>[];
}

export type CoimAutocompleteOptionItem<T = string> =
  | string
  | {
      value: T;
      label: string;
      disabled?: boolean;
      group?: string;
      description?: string;
    };

export interface CoimNormalizedOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
  description?: string;
}

export interface CoimHighlightPart {
  text: string;
  highlight: boolean;
}

export interface CoimSliderMark {
  value: number;
  label?: string;
}

export type CoimDropzoneAccept = string | string[] | Record<string, string[]>;

export interface CoimDropzoneFileObject {
  name: string;
  size: number;
  type?: string;
  preview?: string;
  path?: string;
  relativePath?: string;
  file?: File;
}

export type CoimDropzoneFile = File | CoimDropzoneFileObject;

export type CoimDropzoneErrorCode = "file-invalid-type" | "file-too-large" | "file-too-small" | "too-many-files";

export interface CoimDropzoneError {
  code: CoimDropzoneErrorCode;
  message: string;
}

export interface CoimDropzoneRejection {
  file: File;
  errors: CoimDropzoneError[];
}

export interface CoimFormControlContextValue {
  readonly id: string;
  readonly labelId: string;
  readonly helperId: string;
  readonly error: boolean;
  readonly disabled: boolean;
  readonly required: boolean;
  readonly readOnly: boolean;
  readonly size: CoimInputSize;
  readonly fullWidth: boolean;
  readonly variant: CoimInputVariant;
  readonly surface: boolean;
  readonly hasHelperText: boolean;
  registerHelperText: () => () => void;
}

export interface CoimControlLabelContextValue {
  readonly id: string;
  readonly labelId: string;
  readonly disabled: boolean;
}

export interface CoimButtonGroupContextValue {
  readonly variant: CoimButtonVariant;
  readonly color: CoimColor;
  readonly size: CoimButtonSize;
  readonly disabled: boolean;
  readonly orientation: "horizontal" | "vertical";
  readonly fullWidth: boolean;
}

export interface CoimToggleGroupContextValue {
  readonly variant: CoimToggleButtonVariant;
  readonly color: CoimColor;
  readonly size: CoimButtonSize;
  readonly disabled: boolean;
  readonly orientation: "horizontal" | "vertical";
}

export interface CoimRadioGroupContextValue {
  readonly color: CoimColor;
  readonly size: CoimSelectionSize;
  readonly variant: CoimSelectionVariant;
  readonly disabled: boolean;
  readonly readOnly: boolean;
  readonly row: boolean;
}

export type TextOrSnippet = string | Snippet;
