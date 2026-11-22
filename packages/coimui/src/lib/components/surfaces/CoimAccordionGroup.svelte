<script lang="ts">
  import type { Snippet } from "svelte";
  import { Accordion } from "bits-ui";
  import { cn } from "../../utilities/utils.js";
  import { setAccordionGroupContext } from "./context.js";
  import type { AccordionVariant } from "./types.js";

  interface Props {
    type?: "single" | "multiple";
    value?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    variant?: AccordionVariant;
    disabled?: boolean;
    loop?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    type = "single",
    value = $bindable(),
    onValueChange,
    variant = "default",
    disabled = false,
    loop = true,
    class: className = "",
    children,
  }: Props = $props();

  setAccordionGroupContext({
    get variant() {
      return variant;
    },
  });

  const singleValue = $derived(typeof value === "string" ? value : "");
  const multipleValue = $derived(Array.isArray(value) ? value : []);
</script>

{#if type === "multiple"}
  <Accordion.Root
    type="multiple"
    value={multipleValue}
    onValueChange={(next) => {
      value = next;
      onValueChange?.(next);
    }}
    {disabled}
    {loop}
    class={cn(
      "coim-accordion-group",
      variant === "surface" && "surface-accordion flex flex-col gap-3",
      className,
    )}
  >
    {@render children?.()}
  </Accordion.Root>
{:else}
  <Accordion.Root
    type="single"
    value={singleValue}
    onValueChange={(next) => {
      value = next;
      onValueChange?.(next);
    }}
    {disabled}
    {loop}
    class={cn(
      "coim-accordion-group",
      variant === "surface" && "surface-accordion flex flex-col gap-3",
      className,
    )}
  >
    {@render children?.()}
  </Accordion.Root>
{/if}
