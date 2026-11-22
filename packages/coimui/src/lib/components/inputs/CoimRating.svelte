<script lang="ts">
  import type { Snippet } from "svelte";
  import CiStar from "../../icons/ui/CiStar.svelte";
  import { cn } from "../../utilities/utils.js";
  import type { CoimRatingSize } from "./types.js";

  interface Props {
    value?: number | null;
    max?: number;
    precision?: 1 | 0.5;
    size?: CoimRatingSize;
    readOnly?: boolean;
    disabled?: boolean;
    highlightSelectedOnly?: boolean;
    name?: string;
    "aria-label"?: string;
    icon?: Snippet;
    emptyIcon?: Snippet;
    onValueChange?: (value: number | null) => void;
    class?: string;
  }

  let {
    value = $bindable<number | null>(0),
    max = 5,
    precision = 1,
    size = "medium",
    readOnly = false,
    disabled = false,
    highlightSelectedOnly = false,
    name,
    "aria-label": ariaLabel = "Rating",
    icon,
    emptyIcon,
    onValueChange,
    class: className = "",
  }: Props = $props();

  let hoverValue = $state<number | null>(null);
  const displayValue = $derived(hoverValue ?? value ?? 0);
  const items = $derived(Array.from({ length: max }, (_, idx) => idx + 1));

  const iconPx = $derived(size === "small" ? 16 : size === "large" ? 24 : 20);

  function selectValue(next: number) {
    if (disabled || readOnly) return;
    const toggled = value === next ? null : next;
    value = toggled;
    onValueChange?.(toggled);
  }

  function resolvePointerRating(event: MouseEvent): number | null {
    const starEl = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-star-index]");
    if (!starEl) return null;
    const itemIndex = Number(starEl.dataset.starIndex);
    if (!Number.isFinite(itemIndex)) return null;
    if (precision === 0.5) {
      const rect = starEl.getBoundingClientRect();
      const relX = event.clientX - rect.left;
      return relX < rect.width / 2 ? itemIndex - 0.5 : itemIndex;
    }
    return itemIndex;
  }

  function handleSliderMouseMove(event: MouseEvent) {
    if (disabled || readOnly) return;
    const resolved = resolvePointerRating(event);
    if (resolved !== null) {
      hoverValue = resolved;
    }
  }

  function handleSliderClick(event: MouseEvent) {
    if (disabled || readOnly) return;
    const resolved = resolvePointerRating(event);
    if (resolved !== null) {
      selectValue(resolved);
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (disabled || readOnly) return;
    const step = precision;
    const curr = value ?? 0;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = Math.min(max, curr + step);
      value = next;
      onValueChange?.(next);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      const next = Math.max(0, curr - step);
      value = next;
      onValueChange?.(next);
    } else if (event.key === "Home") {
      event.preventDefault();
      value = step;
      onValueChange?.(step);
    } else if (event.key === "End") {
      event.preventDefault();
      value = max;
      onValueChange?.(max);
    }
  }
</script>

{#snippet ratingItems()}
  {#if name}
    <input type="hidden" {name} value={value ?? 0} />
  {/if}

  {#each items as starIndex (starIndex)}
    {@const filled = highlightSelectedOnly
      ? displayValue === starIndex
      : displayValue >= starIndex}
    {@const half =
      !highlightSelectedOnly &&
      precision === 0.5 &&
      displayValue >= starIndex - 0.5 &&
      displayValue < starIndex}

    <span
      class="coim-rating-item border-0 bg-transparent p-0"
      data-star-index={starIndex}
      aria-hidden="true"
    >
      <span class="coim-rating-icon">
        <span class={filled ? "coim-rating-icon-filled" : "coim-rating-icon-empty"}>
          {#if filled && icon}
            {@render icon()}
          {:else if !filled && emptyIcon}
            {@render emptyIcon()}
          {:else}
            <CiStar variant={filled ? "contained" : "outlined"} size={iconPx} />
          {/if}
        </span>
        {#if half}
          <span class="coim-rating-half-overlay coim-rating-icon-filled">
            {#if icon}
              {@render icon()}
            {:else}
              <CiStar variant="contained" size={iconPx} />
            {/if}
          </span>
        {/if}
      </span>
    </span>
  {/each}
{/snippet}

{#if readOnly}
  <div
    role="img"
    aria-label={ariaLabel}
    data-disabled={disabled ? "" : undefined}
    data-readonly=""
    class={cn(
      "coim-rating",
      `coim-rating-size-${size}`,
      disabled && "coim-disabled",
      "coim-readonly",
      className,
    )}
  >
    {@render ratingItems()}
  </div>
{:else}
  <div
    role="slider"
    tabindex={disabled ? -1 : 0}
    aria-label={ariaLabel}
    aria-valuemin={0}
    aria-valuemax={max}
    aria-valuenow={value ?? 0}
    aria-disabled={disabled || undefined}
    data-disabled={disabled ? "" : undefined}
    onmousemove={handleSliderMouseMove}
    onclick={handleSliderClick}
    onkeydown={handleKeyDown}
    onmouseleave={() => (hoverValue = null)}
    class={cn(
      "coim-rating focus-visible:outline-primary/75 rounded-xs focus-visible:outline-2",
      `coim-rating-size-${size}`,
      disabled && "coim-disabled",
      className,
    )}
  >
    {@render ratingItems()}
  </div>
{/if}
