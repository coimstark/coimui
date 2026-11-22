<script lang="ts">
  import type { Snippet } from "svelte";
  import { Accordion } from "bits-ui";
  import { cn } from "../../utilities/utils.js";
  import { tryGetAccordionGroupContext } from "./context.js";
  import type { AccordionVariant } from "./types.js";

  interface Props {
    value?: string;
    expanded?: boolean;
    defaultExpanded?: boolean;
    onChange?: (expanded: boolean) => void;
    onExpandedChange?: (expanded: boolean) => void;
    variant?: AccordionVariant;
    disabled?: boolean;
    square?: boolean;
    class?: string;
    children?: Snippet;
  }

  const uid = $props.id();

  let {
    value,
    expanded = $bindable<boolean | undefined>(undefined),
    defaultExpanded = false,
    onChange,
    onExpandedChange,
    variant: variantProp,
    disabled = false,
    square = false,
    class: className = "",
    children,
  }: Props = $props();

  const groupCtx = tryGetAccordionGroupContext();
  const variant = $derived(variantProp ?? groupCtx?.variant ?? "default");
  const itemValue = $derived(value ?? `coim-accordion-${uid}`);

  let internalExpanded = $state<boolean | undefined>(undefined);
  const isExpanded = $derived(expanded !== undefined ? expanded : (internalExpanded ?? defaultExpanded));

  const itemClass = $derived(
    cn(
      "coim-accordion",
      !square && "coim-accordion-rounded",
      variant === "basic" && "coim-accordion-basic basic",
      variant === "bordered" && "coim-accordion-bordered bordered",
      variant === "surface" && "coim-accordion-surface accordion-container",
      disabled && "coim-accordion-disabled",
      className,
    ),
  );
</script>

{#if groupCtx}
  <Accordion.Item value={itemValue} {disabled} class={itemClass}>
    {@render children?.()}
  </Accordion.Item>
{:else}
  <Accordion.Root
    type="single"
    value={isExpanded ? itemValue : ""}
    onValueChange={(next) => {
      const nextExpanded = next === itemValue;
      expanded = nextExpanded;
      internalExpanded = nextExpanded;
      onChange?.(nextExpanded);
      onExpandedChange?.(nextExpanded);
    }}
    {disabled}
    class={cn(variant === "surface" && "surface-accordion")}
  >
    <Accordion.Item value={itemValue} {disabled} class={itemClass}>
      {@render children?.()}
    </Accordion.Item>
  </Accordion.Root>
{/if}
