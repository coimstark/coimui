<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    coimCollapse,
    prefersReducedMotion,
    resolveTransitionDuration,
    type CollapseOrientation,
    type TransitionTimeout,
  } from "./transitions.js";

  interface Props {
    in?: boolean;
    timeout?: TransitionTimeout;
    orientation?: CollapseOrientation;
    collapsedSize?: number | string;
    unmountOnExit?: boolean;
    mountOnEnter?: boolean;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    in: isIn = false,
    timeout = 250,
    orientation = "vertical",
    collapsedSize = 0,
    unmountOnExit = false,
    mountOnEnter = false,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  let hasEntered = $state(false);
  $effect(() => {
    if (isIn) hasEntered = true;
  });

  const collapsedNum = $derived(
    typeof collapsedSize === "number"
      ? Math.max(0, collapsedSize)
      : Math.max(0, Number.parseFloat(collapsedSize) || 0),
  );
  const collapsedCss = $derived(
    typeof collapsedSize === "number" ? `${Math.max(0, collapsedSize)}px` : collapsedSize,
  );

  const shouldRender = $derived(
    unmountOnExit && collapsedNum === 0 ? isIn : mountOnEnter ? hasEntered || isIn : true,
  );
  const enterDuration = $derived(resolveTransitionDuration(timeout, 250, "enter"));
  const exitDuration = $derived(resolveTransitionDuration(timeout, 200, "exit"));
  const activeDuration = $derived(isIn ? enterDuration : exitDuration);
  const reduced = $derived(prefersReducedMotion());

  let wrapperEl = $state<HTMLDivElement | null>(null);
  let measuredSize = $state<number | null>(null);

  $effect(() => {
    if (!wrapperEl || typeof window === "undefined") return;
    if (isIn) {
      measuredSize =
        orientation === "horizontal" ? wrapperEl.scrollWidth : wrapperEl.scrollHeight;
    }
  });

  const targetDimension = $derived.by(() => {
    if (!isIn) return collapsedCss;
    if (measuredSize && measuredSize > 0) return `${measuredSize}px`;
    return "auto";
  });
</script>

{#if shouldRender}
  {#if unmountOnExit && collapsedNum === 0}
    <div
      data-coim-transition="collapse"
      data-orientation={orientation}
      data-state={isIn ? "entered" : "exited"}
      in:coimCollapse={{ duration: enterDuration, orientation, collapsedSize: collapsedNum }}
      out:coimCollapse={{ duration: exitDuration, orientation, collapsedSize: collapsedNum }}
      class={className}
      {...rest}
    >
      {@render children?.()}
    </div>
  {:else}
    <div
      bind:this={wrapperEl}
      data-coim-transition="collapse"
      data-orientation={orientation}
      data-state={isIn ? "entered" : "exited"}
      aria-hidden={!isIn && collapsedNum === 0 ? "true" : undefined}
      style:overflow="hidden"
      style:height={orientation === "vertical" ? targetDimension : undefined}
      style:width={orientation === "horizontal" ? targetDimension : undefined}
      style:visibility={!isIn && collapsedNum === 0 ? "hidden" : "visible"}
      style:transition={reduced
        ? "none"
        : `${orientation === "horizontal" ? "width" : "height"} ${activeDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`}
      class={className}
      {...rest}
    >
      {@render children?.()}
    </div>
  {/if}
{/if}
