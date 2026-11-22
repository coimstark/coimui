<script lang="ts">
  import { Toggle, ToggleGroup } from "bits-ui";
  import type { Snippet } from "svelte";
  import type { CoimColor } from "../../theme/types.js";
  import { cn } from "../../utilities/utils.js";
  import { tryGetToggleGroupContext } from "./context.svelte.js";
  import { TOGGLE_VARIANT_CLASSES } from "./styles.js";
  import type { CoimButtonSize, CoimToggleButtonVariant } from "./types.js";

  interface Props {
    value: string;
    selected?: boolean;
    onSelectedChange?: (selected: boolean) => void;
    variant?: CoimToggleButtonVariant;
    size?: CoimButtonSize;
    color?: CoimColor;
    disabled?: boolean;
    class?: string;
    children?: Snippet<[{ pressed: boolean }]>;
    [key: string]: unknown;
  }

  let {
    value,
    selected = $bindable(false),
    onSelectedChange,
    variant: variantProp,
    size: sizeProp,
    color: colorProp,
    disabled: disabledProp,
    class: className = "",
    children: content,
    ...rest
  }: Props = $props();

  const groupCtx = tryGetToggleGroupContext();

  const variant = $derived(variantProp ?? groupCtx?.variant ?? "surface");
  const size = $derived(sizeProp ?? groupCtx?.size ?? "medium");
  const color = $derived(colorProp ?? groupCtx?.color ?? "primary");
  const isDisabled = $derived(Boolean(disabledProp ?? groupCtx?.disabled ?? false));

  const sizeClass = $derived(
    size === "tiny"
      ? variant === "outlined"
        ? "coim-toggle-btn-size-tiny rounded-sm px-[calc(0.375rem-1px)] py-[calc(0.375rem-1px)] text-base leading-4"
        : "coim-toggle-btn-size-tiny rounded-sm px-1.5 py-1.5 text-base leading-4"
      : size === "small"
        ? variant === "outlined"
          ? "coim-toggle-btn-size-small rounded-sm px-[calc(0.5rem-1px)] py-[calc(0.5rem-1px)] text-base leading-4"
          : "coim-toggle-btn-size-small rounded-sm px-2 py-2 text-base leading-4"
        : size === "large"
          ? variant === "outlined"
            ? "coim-toggle-btn-size-large rounded-lg px-[calc(0.5rem-1px)] py-[calc(0.5rem-1px)] text-base leading-6"
            : "coim-toggle-btn-size-large rounded-lg px-2 py-2 text-base leading-6"
          : variant === "outlined"
            ? "coim-toggle-btn-size-medium rounded-md px-[calc(0.5rem-1px)] py-[calc(0.5rem-1px)] text-base leading-5"
            : "coim-toggle-btn-size-medium rounded-md px-2 py-2 text-base leading-5",
  );

  const itemClass = $derived(
    cn(
      "coim-toggle-btn font-body text-text-primary inline-flex cursor-pointer items-center justify-center font-medium tracking-normal normal-case shadow-none transition-all select-none hover:bg-grey-50 hover:text-text-primary-dark",
      `coim-toggle-btn-${variant}`,
      `coim-toggle-btn-color-${color}`,
      variant === "outlined" ? "border border-solid border-transparent" : "border-none",
      sizeClass,
      TOGGLE_VARIANT_CLASSES[variant][color],
      isDisabled && "opacity-disabled pointer-events-none cursor-default",
      className,
    ),
  );
</script>

{#if groupCtx}
  <ToggleGroup.Item {value} disabled={isDisabled} class={itemClass} {...rest}>
    {#snippet children({ pressed })}
      {#if content}
        {@render content({ pressed })}
      {/if}
    {/snippet}
  </ToggleGroup.Item>
{:else}
  <Toggle.Root
    bind:pressed={selected}
    onPressedChange={(next: boolean) => {
      selected = next;
      onSelectedChange?.(next);
    }}
    disabled={isDisabled}
    class={itemClass}
    data-value={value}
    {...rest}
  >
    {#snippet children({ pressed })}
      {#if content}
        {@render content({ pressed })}
      {/if}
    {/snippet}
  </Toggle.Root>
{/if}
