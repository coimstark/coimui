<script lang="ts">
  import { onDestroy, type Snippet } from "svelte";
  import { cn } from "../utils.js";
  import { registerPortalOrigin, unregisterPortalOrigin } from "./portal-registry.js";
  import type { PortalContainer } from "./types.js";

  interface Props {
    container?: PortalContainer;
    disablePortal?: boolean;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    container,
    disablePortal = false,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  let portalEl = $state<HTMLDivElement | null>(null);
  let placeholder: Comment | null = null;

  function resolveContainer(target: PortalContainer): HTMLElement | null {
    if (typeof document === "undefined") return null;
    if (!target) return document.body;
    if (typeof target === "function") {
      return target() ?? document.body;
    }
    if (typeof target === "string") {
      return document.querySelector<HTMLElement>(target) ?? document.body;
    }
    return target;
  }

  $effect(() => {
    if (typeof document === "undefined" || !portalEl) return;

    if (!placeholder && portalEl.parentNode) {
      placeholder = document.createComment("coim-portal");
      portalEl.parentNode.insertBefore(placeholder, portalEl);
    }

    if (placeholder?.parentNode) {
      registerPortalOrigin(portalEl, placeholder.parentNode);
    }

    if (disablePortal) {
      if (placeholder?.parentNode && portalEl.parentNode !== placeholder.parentNode) {
        placeholder.parentNode.insertBefore(portalEl, placeholder);
      }
      return;
    }

    const targetEl = resolveContainer(container);
    if (targetEl && portalEl.parentNode !== targetEl) {
      targetEl.appendChild(portalEl);
    }
  });

  onDestroy(() => {
    if (portalEl) {
      unregisterPortalOrigin(portalEl);
      if (portalEl.parentNode && portalEl.parentNode !== placeholder?.parentNode) {
        portalEl.parentNode.removeChild(portalEl);
      }
    }
    placeholder?.remove();
    placeholder = null;
  });
</script>

<div
  bind:this={portalEl}
  data-coim-portal={disablePortal ? "disabled" : "active"}
  class={cn("contents", className)}
  {...rest}
>
  {@render children?.()}
</div>
