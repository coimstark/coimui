<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    coimSlide,
    getSlideOffsetTransform,
    prefersReducedMotion,
    resolveTransitionDuration,
    type SlideDirection,
    type TransitionTimeout,
  } from "./transitions.js";

  interface Props {
    in?: boolean;
    direction?: SlideDirection;
    timeout?: TransitionTimeout;
    unmountOnExit?: boolean;
    mountOnEnter?: boolean;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    in: isIn = false,
    direction = "down",
    timeout = 225,
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

  const shouldRender = $derived(unmountOnExit ? isIn : mountOnEnter ? hasEntered || isIn : true);
  const enterDuration = $derived(resolveTransitionDuration(timeout, 225, "enter"));
  const exitDuration = $derived(resolveTransitionDuration(timeout, 195, "exit"));
  const activeDuration = $derived(isIn ? enterDuration : exitDuration);
  const reduced = $derived(prefersReducedMotion());
</script>

{#if shouldRender}
  {#if unmountOnExit}
    <div
      data-coim-transition="slide"
      data-direction={direction}
      data-state={isIn ? "entered" : "exited"}
      in:coimSlide={{ duration: enterDuration, direction }}
      out:coimSlide={{ duration: exitDuration, direction }}
      class={className}
      {...rest}
    >
      {@render children?.()}
    </div>
  {:else}
    <div
      data-coim-transition="slide"
      data-direction={direction}
      data-state={isIn ? "entered" : "exited"}
      aria-hidden={isIn ? undefined : "true"}
      style:transform={reduced ? "none" : isIn ? "translate3d(0, 0, 0)" : getSlideOffsetTransform(direction)}
      style:visibility={isIn ? "visible" : "hidden"}
      style:transition={reduced
        ? "none"
        : `transform ${activeDuration}ms cubic-bezier(0, 0, 0.2, 1), visibility ${activeDuration}ms`}
      class={className}
      {...rest}
    >
      {@render children?.()}
    </div>
  {/if}
{/if}
