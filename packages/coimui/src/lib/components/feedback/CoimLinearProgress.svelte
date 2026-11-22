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
    variant,
    value,
    valueBuffer = 0,
    color = "primary",
    label,
    class: className = "",
    ...rest
  }: Props = $props();

  const resolvedVariant = $derived<LinearProgressVariant>(
    variant ?? (value !== undefined ? "determinate" : "indeterminate"),
  );
  const clampedValue = $derived(Math.min(100, Math.max(0, value ?? 0)));
  const clampedBuffer = $derived(Math.min(100, Math.max(clampedValue, valueBuffer)));
  const colorClass = $derived(PROGRESS_COLOR_TEXT_CLASS[color] ?? "text-primary");
  const resolvedAriaLabel = $derived(
    label ??
      (rest["aria-label"] as string | undefined) ??
      (resolvedVariant !== "indeterminate" ? `Progress ${clampedValue}%` : "Loading"),
  );
</script>

<div
  role="progressbar"
  aria-label={resolvedAriaLabel}
  aria-valuemin={resolvedVariant !== "indeterminate" ? 0 : undefined}
  aria-valuemax={resolvedVariant !== "indeterminate" ? 100 : undefined}
  aria-valuenow={resolvedVariant !== "indeterminate" ? clampedValue : undefined}
  data-variant={resolvedVariant}
  class={cn(
    "coim-linear-progress bg-grey-50 relative block h-1 w-full overflow-hidden rounded-2xl",
    colorClass,
    className,
  )}
  {...rest}
>
  {#if resolvedVariant === "buffer"}
    <div class="coim-linear-progress-dashed" aria-hidden="true"></div>
    <div
      class="coim-linear-progress-bar coim-linear-progress-bar-buffer rounded-2xl bg-current opacity-35"
      style:width="{clampedBuffer}%"
    ></div>
    <div
      class="coim-linear-progress-bar coim-linear-progress-bar-primary rounded-2xl bg-current"
      style:width="{clampedValue}%"
    ></div>
  {:else if resolvedVariant === "determinate"}
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
