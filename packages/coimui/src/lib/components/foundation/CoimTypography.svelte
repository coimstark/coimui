<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import type {
    CoimTypographyProps,
    TypographyAlign,
    TypographyColor,
    TypographyEllipsisLines,
    TypographyVariant,
  } from "./types.js";

  const DEFAULT_TAG_MAP: Record<TypographyVariant, string> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    subtitle1: "h6",
    subtitle2: "h6",
    body1: "p",
    body2: "p",
    button: "span",
    overline: "span",
    caption: "span",
    inherit: "p",
  };

  const VARIANT_CLASSES: Record<TypographyVariant, string> = {
    h1: "coim-typography-h1",
    h2: "coim-typography-h2",
    h3: "coim-typography-h3",
    h4: "coim-typography-h4",
    h5: "coim-typography-h5",
    h6: "coim-typography-h6",
    subtitle1: "coim-typography-subtitle1",
    subtitle2: "coim-typography-subtitle2",
    body1: "coim-typography-body1",
    body2: "coim-typography-body2",
    button: "coim-typography-button",
    overline: "coim-typography-overline",
    caption: "coim-typography-caption",
    inherit: "coim-typography-inherit",
  };

  const COLOR_CLASSES: Record<TypographyColor, string> = {
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
    "text.primary": "text-text-primary",
    "text.secondary": "text-text-secondary",
    "text.disabled": "text-text-disabled",
    "text-muted": "text-text-muted",
    "text-contrast": "text-text-contrast",
    success: "text-success",
    error: "text-error",
    warning: "text-warning",
    info: "text-info",
    grey: "text-grey-500",
    inherit: "text-inherit",
  };

  const ALIGN_CLASSES: Record<TypographyAlign, string> = {
    inherit: "",
    left: "coim-typography-align-left",
    center: "coim-typography-align-center",
    right: "coim-typography-align-right",
    justify: "coim-typography-align-justify",
  };

  const ELLIPSIS_CLASSES: Record<TypographyEllipsisLines, string> = {
    1: "text-ellipsis-line-1",
    2: "text-ellipsis-line-2",
    3: "text-ellipsis-line-3",
    4: "text-ellipsis-line-4",
    5: "text-ellipsis-line-5",
    6: "text-ellipsis-line-6",
  };

  let {
    variant = "body1",
    component,
    as,
    color,
    gutterBottom = false,
    noWrap = false,
    align = "inherit",
    ellipsisLines,
    class: className = "",
    children,
    ...rest
  }: CoimTypographyProps = $props();

  const tag = $derived(component ?? as ?? DEFAULT_TAG_MAP[variant]);
</script>

<svelte:element
  this={tag}
  class={cn(
    "coim-typography",
    VARIANT_CLASSES[variant],
    color ? COLOR_CLASSES[color] : "",
    ALIGN_CLASSES[align],
    gutterBottom && "coim-typography-gutter-bottom",
    noWrap && "coim-typography-nowrap",
    ellipsisLines ? ELLIPSIS_CLASSES[ellipsisLines] : "",
    className,
  )}
  {...rest}
>
  {@render children?.()}
</svelte:element>
