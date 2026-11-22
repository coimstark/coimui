<script lang="ts">
  import { ToggleGroup } from "bits-ui";
  import type { Snippet } from "svelte";
  import type { CoimColor } from "../../theme/types.js";
  import { cn } from "../../utilities/utils.js";
  import { setToggleGroupContext } from "./context.svelte.js";
  import type { CoimButtonSize, CoimToggleButtonVariant } from "./types.js";

  interface Props {
    type?: "single" | "multiple";
    value?: string | string[];
    onValueChange?: (value: any) => void;
    variant?: CoimToggleButtonVariant;
    size?: CoimButtonSize;
    color?: CoimColor;
    orientation?: "horizontal" | "vertical";
    disabled?: boolean;
    loop?: boolean;
    rovingFocus?: boolean;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    type = "single",
    value = $bindable<string | string[] | undefined>(undefined),
    onValueChange,
    variant = "surface",
    size = "medium",
    color = "primary",
    orientation = "horizontal",
    disabled = false,
    loop = true,
    rovingFocus = true,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  setToggleGroupContext({
    get variant() {
      return variant;
    },
    get color() {
      return color;
    },
    get size() {
      return size;
    },
    get disabled() {
      return disabled;
    },
    get orientation() {
      return orientation;
    },
  });

  const groupClass = $derived(
    cn(
      "coim-toggle-group inline-flex gap-1",
      orientation === "vertical" && "coim-toggle-group-vertical flex-col",
      className,
    ),
  );
</script>

{#if type === "multiple"}
  <ToggleGroup.Root
    type="multiple"
    value={Array.isArray(value) ? value : value ? [value] : []}
    onValueChange={(next: string[]) => {
      value = next;
      onValueChange?.(next);
    }}
    {orientation}
    {disabled}
    {loop}
    {rovingFocus}
    class={groupClass}
    {...rest}
  >
    {#if children}
      {@render children()}
    {/if}
  </ToggleGroup.Root>
{:else}
  <ToggleGroup.Root
    type="single"
    value={typeof value === "string" ? value : ""}
    onValueChange={(next: string) => {
      value = next;
      onValueChange?.(next);
    }}
    {orientation}
    {disabled}
    {loop}
    {rovingFocus}
    class={groupClass}
    {...rest}
  >
    {#if children}
      {@render children()}
    {/if}
  </ToggleGroup.Root>
{/if}
