<script lang="ts">
  import { Tooltip } from "bits-ui";
  import { getAllContexts, type Snippet } from "svelte";
  import { cn } from "../../utilities/utils.js";
  import type { TooltipAlign, TooltipPlacement, TooltipSide } from "./types.js";

  interface Props {
    title?: string | Snippet;
    content?: string | Snippet;
    placement?: TooltipPlacement;
    side?: TooltipSide;
    align?: TooltipAlign;
    sideOffset?: number;
    size?: "medium" | "large";
    arrow?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    delayDuration?: number;
    disableHoverableContent?: boolean;
    disableCloseOnTriggerClick?: boolean;
    class?: string;
    trigger?: Snippet<[{ props: Record<string, unknown> }]>;
    children?: Snippet;
  }

  let {
    title,
    content,
    placement,
    side,
    align,
    sideOffset = 6,
    size = "medium",
    arrow = false,
    open = $bindable(false),
    onOpenChange,
    disabled = false,
    delayDuration,
    disableHoverableContent = false,
    disableCloseOnTriggerClick = false,
    class: className = "",
    trigger,
    children,
  }: Props = $props();

  function hasBitsTooltipProvider(): boolean {
    const contexts = getAllContexts();
    for (const [key, value] of contexts.entries()) {
      if (typeof key === "symbol" && key.description === "Tooltip.Provider" && value != null) {
        return true;
      }
    }
    return false;
  }

  const hasProvider = hasBitsTooltipProvider();

  const resolvedSide = $derived.by<TooltipSide>(() => {
    if (side) return side;
    if (!placement) return "top";
    const [parsedSide] = placement.split("-") as [TooltipSide];
    return parsedSide;
  });

  const resolvedAlign = $derived.by<TooltipAlign>(() => {
    if (align) return align;
    if (!placement || !placement.includes("-")) return "center";
    const [, parsedAlign] = placement.split("-") as [TooltipSide, TooltipAlign];
    return parsedAlign;
  });

  const resolvedContent = $derived(content ?? title);
  const hasContent = $derived(
    resolvedContent !== undefined && resolvedContent !== null && resolvedContent !== "",
  );
</script>

{#snippet tooltipCore()}
  <Tooltip.Root
    bind:open
    {onOpenChange}
    {disabled}
    {delayDuration}
    {disableHoverableContent}
    {disableCloseOnTriggerClick}
  >
    <Tooltip.Trigger>
      {#snippet child({ props })}
        {#if trigger}
          {@render trigger({ props })}
        {:else}
          {@const { type: _omitType, disabled: _omitDisabled, tabindex: _omitTab, ...spanProps } =
            props as Record<string, unknown>}
          <span
            {...spanProps}
            class="coim-tooltip-trigger inline-flex"
            onfocusin={(e) => {
              const fn = props.onfocus as ((ev: FocusEvent) => void) | undefined;
              fn?.(e as unknown as FocusEvent);
            }}
            onfocusout={(e) => {
              const next = e.relatedTarget as Node | null;
              if (next && (e.currentTarget as HTMLElement).contains(next)) return;
              const fn = props.onblur as ((ev: FocusEvent) => void) | undefined;
              fn?.(e as unknown as FocusEvent);
            }}
          >
            {@render children?.()}
          </span>
        {/if}
      {/snippet}
    </Tooltip.Trigger>

    {#if hasContent && !disabled}
      <Tooltip.Portal>
        <Tooltip.Content
          role="tooltip"
          side={resolvedSide}
          align={resolvedAlign}
          {sideOffset}
          class={cn(
            "coim-tooltip-content border-grey-200 bg-background-paper font-body text-text-primary shadow-darker-sm z-100 rounded-sm border border-solid px-3 py-1.5 text-sm font-semibold",
            size === "large" && "coim-tooltip-large px-4.75 py-[calc(0.5rem-1px)] text-base leading-4",
            className,
          )}
        >
          {#if arrow}
            <Tooltip.Arrow class="coim-tooltip-arrow text-background-paper fill-current" />
          {/if}
          {#if typeof resolvedContent === "function"}
            {@render (resolvedContent as Snippet)()}
          {:else}
            {resolvedContent}
          {/if}
        </Tooltip.Content>
      </Tooltip.Portal>
    {/if}
  </Tooltip.Root>
{/snippet}

{#if hasProvider}
  {@render tooltipCore()}
{:else}
  <Tooltip.Provider delayDuration={delayDuration ?? 150}>
    {@render tooltipCore()}
  </Tooltip.Provider>
{/if}
