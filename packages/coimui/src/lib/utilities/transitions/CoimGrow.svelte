<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    coimGrow,
    prefersReducedMotion,
    resolveTransitionDuration,
    type TransitionTimeout,
  } from "./transitions.js";

  interface Props {
    in?: boolean;
    timeout?: TransitionTimeout;
    unmountOnExit?: boolean;
    mountOnEnter?: boolean;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    in: isIn = false,
    timeout = 250,
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
  const enterDuration = $derived(resolveTransitionDuration(timeout, 250, "enter"));
  const exitDuration = $derived(resolveTransitionDuration(timeout, 200, "exit"));
  const activeDuration = $derived(isIn ? enterDuration : exitDuration);
  const reduced = $derived(prefersReducedMotion());
</script>

{#if shouldRender}
  {#if unmountOnExit}
    <div
      data-coim-transition="grow"
      data-state={isIn ? "entered" : "exited"}
      in:coimGrow={{ duration: enterDuration }}
      out:coimGrow={{ duration: exitDuration }}
      class={className}
      {...rest}
    >
      {@render children?.()}
    </div>
  {:else}
    <div
      data-coim-transition="grow"
      data-state={isIn ? "entered" : "exited"}
      aria-hidden={isIn ? undefined : "true"}
      style:opacity={isIn ? "1" : "0"}
      style:transform={reduced ? "none" : isIn ? "scale(1)" : "scale(0.75)"}
      style:visibility={isIn ? "visible" : "hidden"}
      style:transition={reduced
        ? "none"
        : `opacity ${activeDuration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${activeDuration}ms cubic-bezier(0.4, 0, 0.2, 1), visibility ${activeDuration}ms`}
      class={className}
      {...rest}
    >
      {@render children?.()}
    </div>
  {/if}
{/if}
