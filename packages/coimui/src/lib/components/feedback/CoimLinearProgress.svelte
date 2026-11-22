<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import {
    PROGRESS_COLOR_TEXT_CLASS,
    type LinearProgressVariant,
    type ProgressColor,
  } from "./types.js";

  interface Props {
    variant?: LinearProgressVariant;
    value?: number;
    valueBuffer?: number;
    color?: ProgressColor;
    label?: string;
    class?: string;
    [key: string]: unknown;
  }

  let {
    variant = "indeterminate",
    value = 0,
    valueBuffer = 0,
    color = "primary",
    label,
    class: className = "",
    ...rest
  }: Props = $props();

  const clampedValue = $derived(Math.min(100, Math.max(0, value)));
  const clampedBuffer = $derived(Math.min(100, Math.max(clampedValue, valueBuffer)));
  const colorClass = $derived(PROGRESS_COLOR_TEXT_CLASS[color] ?? "text-primary");
  const resolvedAriaLabel = $derived(
    label ??
      (rest["aria-label"] as string | undefined) ??
      (variant !== "indeterminate" ? `Progress ${clampedValue}%` : "Loading"),
  );
</script>

<div
  role="progressbar"
  aria-label={resolvedAriaLabel}
  aria-valuemin={variant !== "indeterminate" ? 0 : undefined}
  aria-valuemax={variant !== "indeterminate" ? 100 : undefined}
  aria-valuenow={variant !== "indeterminate" ? clampedValue : undefined}
  data-variant={variant}
  class={cn(
    "coim-linear-progress bg-grey-50 relative block h-1 w-full overflow-hidden rounded-2xl",
    colorClass,
    className,
  )}
  {...rest}
>
  {#if variant === "buffer"}
    <div class="coim-linear-progress-dashed" aria-hidden="true"></div>
    <div
      class="coim-linear-progress-bar coim-linear-progress-bar-buffer rounded-2xl bg-current opacity-35"
      style:width="{clampedBuffer}%"
    ></div>
    <div
      class="coim-linear-progress-bar coim-linear-progress-bar-primary rounded-2xl bg-current"
      style:width="{clampedValue}%"
    ></div>
  {:else if variant === "determinate"}
    <div
      class="coim-linear-progress-bar coim-linear-progress-bar-primary rounded-2xl bg-current"
      style:width="{clampedValue}%"
    ></div>
  {:else}
    <div
      class="coim-linear-progress-bar coim-linear-progress-indeterminate-1 rounded-2xl bg-current"
    ></div>
    <div
      class="coim-linear-progress-bar coim-linear-progress-indeterminate-2 rounded-2xl bg-current"
    ></div>
  {/if}
</div>
