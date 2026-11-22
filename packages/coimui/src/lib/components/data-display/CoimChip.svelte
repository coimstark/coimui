<script lang="ts">
  import type { Snippet } from "svelte";
  import CiCross from "../../icons/ui/CiCross.svelte";
  import type { CoimColor } from "../../theme/types.js";
  import { cn } from "../../utilities/utils.js";

  interface Props {
    label?: string | Snippet;
    variant?: "filled" | "outlined" | "pastel";
    color?: CoimColor;
    size?: "small" | "medium";
    avatar?: Snippet;
    icon?: Snippet;
    deleteIcon?: Snippet;
    clickable?: boolean;
    deletable?: boolean;
    onDelete?: (event?: Event) => void;
    onclick?: (event: MouseEvent) => void;
    href?: string;
    disabled?: boolean;
    multiline?: boolean;
    deleteAriaLabel?: string;
    class?: string;
    labelClass?: string;
    children?: Snippet;
  }

  let {
    label,
    variant = "filled",
    color = "grey",
    size = "medium",
    avatar,
    icon,
    deleteIcon,
    clickable = false,
    deletable = false,
    onDelete,
    onclick,
    href,
    disabled = false,
    multiline = false,
    deleteAriaLabel = "Delete",
    class: className = "",
    labelClass = "",
    children,
  }: Props = $props();

  const isClickable = $derived(Boolean(clickable || onclick || href));
  const isDeletable = $derived(Boolean(deletable || onDelete));

  const chipClasses = $derived(
    cn(
      "coim-chip",
      `coim-chip-${variant}`,
      `coim-chip-${size}`,
      `coim-chip-color-${color}`,
      isClickable && "coim-chip-clickable",
      multiline && "coim-chip-multiline",
      disabled && "is-disabled",
      className,
    ),
  );

  function handleChipClick(event: MouseEvent) {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onclick?.(event);
  }

  function handleDeleteClick(event: MouseEvent) {
    event.stopPropagation();
    if (disabled) return;
    onDelete?.(event);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (disabled) return;
    if (isDeletable && (event.key === "Backspace" || event.key === "Delete")) {
      event.preventDefault();
      onDelete?.(event);
      return;
    }
    if (isClickable && (event.key === "Enter" || event.key === " ")) {
      if (event.currentTarget instanceof HTMLDivElement) {
        event.preventDefault();
        (event.currentTarget as HTMLElement).click();
      }
    }
  }
</script>

{#snippet chipInner()}
  {#if avatar}
    <span class="coim-chip-avatar">{@render avatar()}</span>
  {:else if icon}
    <span class="coim-chip-icon">{@render icon()}</span>
  {/if}

  <span class={cn("coim-chip-label", labelClass)}>
    {#if typeof label === "function"}
      {@render label()}
    {:else if label !== undefined}
      {label}
    {:else if children}
      {@render children()}
    {/if}
  </span>

  {#if isDeletable}
    <button
      type="button"
      class="coim-chip-delete"
      aria-label={deleteAriaLabel}
      {disabled}
      onclick={handleDeleteClick}
    >
      {#if deleteIcon}
        {@render deleteIcon()}
      {:else}
        <CiCross size="tiny" aria-hidden="true" />
      {/if}
    </button>
  {/if}
{/snippet}

{#if href && !isDeletable}
  <a
    href={disabled ? undefined : href}
    aria-disabled={disabled ? "true" : undefined}
    class={chipClasses}
    onclick={handleChipClick}
  >
    {@render chipInner()}
  </a>
{:else if isClickable && !isDeletable}
  <button
    type="button"
    {disabled}
    class={chipClasses}
    onclick={handleChipClick}
  >
    {@render chipInner()}
  </button>
{:else}
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div
    class={chipClasses}
    role={isClickable ? "button" : undefined}
    tabindex={(isClickable || isDeletable) && !disabled ? 0 : undefined}
    aria-disabled={disabled ? "true" : undefined}
    onclick={isClickable ? handleChipClick : undefined}
    onkeydown={isClickable || isDeletable ? handleKeyDown : undefined}
  >
    {@render chipInner()}
  </div>
{/if}
