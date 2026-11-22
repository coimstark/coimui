<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import {
    PROGRESS_COLOR_TEXT_CLASS,
    type CircularProgressSize,
    type CircularProgressVariant,
    type ProgressColor,
  } from "./types.js";

  interface Props {
    variant?: CircularProgressVariant;
    value?: number;
    size?: CircularProgressSize;
    color?: ProgressColor;
    thickness?: number;
    disableShrink?: boolean;
    label?: string;
    class?: string;
    [key: string]: unknown;
  }

  let {
    variant,
    value,
    size = 40,
    color = "primary",
    thickness = 3.6,
    disableShrink = false,
    label,
    class: className = "",
    ...rest
  }: Props = $props();

  const resolvedVariant = $derived<CircularProgressVariant>(
    variant ?? (value !== undefined ? "determinate" : "indeterminate"),
  );
  const clampedValue = $derived(Math.min(100, Math.max(0, value ?? 0)));
  const radius = $derived((44 - thickness) / 2);
  const circumference = $derived(2 * Math.PI * radius);
  const dashOffset = $derived(((100 - clampedValue) / 100) * circumference);

  const isNamedSize = $derived(typeof size === "string");
  const numericPx = $derived(typeof size === "number" ? `${size}px` : undefined);
  const colorClass = $derived(PROGRESS_COLOR_TEXT_CLASS[color] ?? "text-primary");
  const resolvedAriaLabel = $derived(
    label ??
      (rest["aria-label"] as string | undefined) ??
      (resolvedVariant === "determinate" ? `Progress ${clampedValue}%` : "Loading"),
  );
</script>

<span
  role="progressbar"
  aria-label={resolvedAriaLabel}
  aria-valuemin={resolvedVariant === "determinate" ? 0 : undefined}
  aria-valuemax={resolvedVariant === "determinate" ? 100 : undefined}
  aria-valuenow={resolvedVariant === "determinate" ? clampedValue : undefined}
  data-variant={resolvedVariant}
  style:width={numericPx}
  style:height={numericPx}
  class={cn(
    "coim-circular-progress inline-block leading-none",
    resolvedVariant === "indeterminate"
      ? "coim-circular-progress-indeterminate"
      : "coim-circular-progress-determinate",
    isNamedSize && size,
    colorClass,
    className,
  )}
  {...rest}
>
  <svg class="coim-circular-progress-svg block h-full w-full" viewBox="22 22 44 44">
    <circle
      class={cn(
        resolvedVariant === "determinate"
          ? "coim-circular-progress-circle-determinate"
          : !disableShrink && "coim-circular-progress-circle-indeterminate",
      )}
      cx="44"
      cy="44"
      r={radius}
      fill="none"
      stroke="currentColor"
      stroke-width={thickness}
      stroke-dasharray={resolvedVariant === "determinate" ? circumference.toFixed(3) : undefined}
      stroke-dashoffset={resolvedVariant === "determinate" ? `${dashOffset.toFixed(3)}px` : undefined}
      stroke-linecap="round"
    />
  </svg>
</span>
