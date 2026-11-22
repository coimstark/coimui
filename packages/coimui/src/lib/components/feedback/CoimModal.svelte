<script lang="ts" module>
  const openModalStack: symbol[] = [];
</script>

<script lang="ts">
  import { onDestroy, untrack, type Snippet } from "svelte";
  import { CoimPortal } from "../../utilities/portal/index.js";
  import { cn } from "../../utilities/utils.js";
  import CoimBackdrop from "./CoimBackdrop.svelte";

  interface Props {
    open?: boolean;
    onClose?: (reason?: "backdropClick" | "escapeKeyDown") => void;
    keepMounted?: boolean;
    hideBackdrop?: boolean;
    invisibleBackdrop?: boolean;
    disableBackdropClick?: boolean;
    disableEscapeKeyDown?: boolean;
    disablePortal?: boolean;
    disableRestoreFocus?: boolean;
    backdropTimeout?: number;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    open = $bindable(false),
    onClose,
    keepMounted = false,
    hideBackdrop = false,
    invisibleBackdrop = false,
    disableBackdropClick = false,
    disableEscapeKeyDown = false,
    disablePortal = false,
    disableRestoreFocus = false,
    backdropTimeout = 225,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  const modalToken = Symbol("coim-modal");
  let containerEl = $state<HTMLDivElement | null>(null);
  let previousActiveElement: HTMLElement | null = null;

  function restorePreviousFocus() {
    if (disableRestoreFocus) {
      previousActiveElement = null;
      return;
    }
    const target = previousActiveElement;
    previousActiveElement = null;
    if (target && target.isConnected && typeof target.focus === "function") {
      target.focus();
    }
  }

  function removeFromStack() {
    const idx = openModalStack.indexOf(modalToken);
    if (idx !== -1) {
      openModalStack.splice(idx, 1);
    }
  }

  function closeModal(reason: "backdropClick" | "escapeKeyDown") {
    if (!open) return;
    open = false;
    onClose?.(reason);
  }

  function handleBackdropClick() {
    if (disableBackdropClick) return;
    closeModal("backdropClick");
  }

  $effect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;

    if (open) {
      untrack(() => {
        previousActiveElement =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
      });
      if (!openModalStack.includes(modalToken)) {
        openModalStack.push(modalToken);
      }
      queueMicrotask(() => {
        if (open && containerEl && !containerEl.contains(document.activeElement)) {
          containerEl.focus();
        }
      });

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Escape" || event.defaultPrevented) return;
        const isTopMost = openModalStack[openModalStack.length - 1] === modalToken;
        if (!isTopMost) return;
        if (disableEscapeKeyDown) {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        closeModal("escapeKeyDown");
      };

      window.addEventListener("keydown", onKeyDown);
      return () => {
        window.removeEventListener("keydown", onKeyDown);
      };
    }

    removeFromStack();
    restorePreviousFocus();
  });

  onDestroy(() => {
    removeFromStack();
    restorePreviousFocus();
  });
</script>

{#if open || keepMounted}
  <CoimPortal {disablePortal}>
    <div
      bind:this={containerEl}
      role="presentation"
      tabindex="-1"
      hidden={!open}
      aria-hidden={!open ? "true" : undefined}
      data-coim-modal="true"
      data-state={open ? "open" : "closed"}
      class={cn("fixed inset-0 z-50 outline-none", !open && "pointer-events-none hidden", className)}
      {...rest}
    >
      {#if !hideBackdrop}
        <CoimBackdrop
          {open}
          invisible={invisibleBackdrop}
          timeout={backdropTimeout}
          onclick={handleBackdropClick}
        />
      {/if}
      <div class="relative z-50">
        {@render children?.()}
      </div>
    </div>
  </CoimPortal>
{/if}
