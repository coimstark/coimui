<script lang="ts">
  import { onDestroy, untrack, type Snippet } from "svelte";
  import { cn } from "../../utilities/utils.js";
  import type { DialogCloseReason, DrawerAnchor, DrawerVariant } from "./types.js";

  interface Props {
    open?: boolean;
    anchor?: DrawerAnchor;
    variant?: DrawerVariant;
    surface?: boolean;
    rounded?: boolean;
    disableBackdropClick?: boolean;
    disableEscapeKeyDown?: boolean;
    onClose?: (reason?: DialogCloseReason) => void;
    onOpenChange?: (open: boolean) => void;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    open = $bindable(false),
    anchor = "left",
    variant = "temporary",
    surface = false,
    rounded = true,
    disableBackdropClick = false,
    disableEscapeKeyDown = false,
    onClose,
    onOpenChange,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  let dialogEl = $state<HTMLDialogElement | null>(null);
  let previousActiveElement: HTMLElement | null = null;
  let pendingCloseReason: DialogCloseReason = "close";
  let pointerDownOutside = false;
  let pointerDownInside = false;

  const closedByAttr = $derived.by(() => {
    if (disableBackdropClick && disableEscapeKeyDown) return "none";
    if (disableBackdropClick) return "closerequest";
    if (disableEscapeKeyDown) return "none";
    return "any";
  });

  const anchorClass = $derived.by(() => {
    switch (anchor) {
      case "right":
      case "end":
        return cn(
          "coim-drawer-anchor-right inset-y-0 inset-s-auto inset-e-0 h-dvh max-h-dvh",
          rounded && "rounded-s-2xl",
        );
      case "top":
        return cn(
          "coim-drawer-anchor-top inset-x-0 top-0 bottom-auto w-screen max-w-screen",
          rounded && "rounded-b-2xl",
        );
      case "bottom":
        return cn(
          "coim-drawer-anchor-bottom inset-x-0 top-auto bottom-0 w-screen max-w-screen",
          rounded && "rounded-t-2xl",
        );
      case "left":
      case "start":
      default:
        return cn(
          "coim-drawer-anchor-left inset-y-0 inset-s-0 inset-e-auto h-dvh max-h-dvh",
          rounded && "rounded-e-2xl",
        );
    }
  });

  function restoreFocus() {
    const target = previousActiveElement;
    previousActiveElement = null;
    if (target && target.isConnected && typeof target.focus === "function") {
      target.focus();
    }
  }

  function requestClose(reason: DialogCloseReason) {
    pendingCloseReason = reason;
    if (dialogEl?.open) {
      dialogEl.close();
      return;
    }
    if (open) {
      open = false;
      onClose?.(reason);
    }
    restoreFocus();
  }

  let lastReportedOpen: boolean | undefined = undefined;
  $effect(() => {
    const isOpen = open;
    untrack(() => {
      if (lastReportedOpen !== undefined && lastReportedOpen !== isOpen) {
        onOpenChange?.(isOpen);
      }
      lastReportedOpen = isOpen;
    });
  });

  $effect(() => {
    if (variant !== "temporary") return;
    const el = dialogEl;
    if (!el) return;

    if (open && !el.open) {
      untrack(() => {
        previousActiveElement =
          typeof document !== "undefined" && document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
      });
      if (typeof el.showModal === "function") {
        el.showModal();
      } else {
        el.setAttribute("open", "");
      }
    } else if (!open && el.open) {
      pendingCloseReason = "close";
      el.close();
    }
  });

  onDestroy(() => {
    if (dialogEl?.open) {
      dialogEl.close();
    }
    restoreFocus();
  });

  function isPointerOutsideDrawer(e: PointerEvent | MouseEvent, el: HTMLDialogElement): boolean {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) {
      return e.target === el;
    }
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  }

  function handlePointerDown(e: PointerEvent) {
    if (!dialogEl) return;
    if (e.target === dialogEl && isPointerOutsideDrawer(e, dialogEl)) {
      pointerDownOutside = true;
      pointerDownInside = false;
    } else {
      pointerDownOutside = false;
      pointerDownInside = true;
    }
  }

  function handlePointerUp(e: PointerEvent) {
    if (!dialogEl) return;
    const shouldDismiss =
      !disableBackdropClick &&
      pointerDownOutside &&
      e.target === dialogEl &&
      isPointerOutsideDrawer(e, dialogEl);
    pointerDownOutside = false;
    if (shouldDismiss && dialogEl.open) {
      requestClose("backdropClick");
    }
  }

  function handleClick(e: MouseEvent) {
    if (!dialogEl) return;
    const wasInside = pointerDownInside;
    pointerDownInside = false;
    if (
      !disableBackdropClick &&
      !wasInside &&
      e.target === dialogEl &&
      isPointerOutsideDrawer(e, dialogEl) &&
      dialogEl.open
    ) {
      requestClose("backdropClick");
    }
  }

  function handleCancel(e: Event) {
    if (disableEscapeKeyDown) {
      e.preventDefault();
      return;
    }
    pendingCloseReason = "escapeKeyDown";
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== "Escape" || e.defaultPrevented) return;
    if (disableEscapeKeyDown) {
      e.preventDefault();
      return;
    }
    if (open && dialogEl?.open) {
      e.preventDefault();
      requestClose("escapeKeyDown");
    }
  }

  function handleDialogClose() {
    if (dialogEl) {
      dialogEl.returnValue = "";
    }
    const reason = pendingCloseReason;
    pendingCloseReason = "close";
    if (open) {
      open = false;
      onClose?.(reason);
    }
    restoreFocus();
  }
</script>

{#if variant === "temporary"}
  <dialog
    bind:this={dialogEl}
    closedby={closedByAttr}
    aria-label={ariaLabel}
    aria-labelledby={ariaLabel ? undefined : ariaLabelledBy}
    data-anchor={anchor}
    data-variant={variant}
    onclose={handleDialogClose}
    oncancel={handleCancel}
    onkeydown={handleKeyDown}
    onpointerdown={handlePointerDown}
    onpointerup={handlePointerUp}
    onclick={handleClick}
    class={cn(
      "coim-drawer-paper coim-drawer-temporary bg-background-paper text-text-primary shadow-darker-lg fixed m-0 max-w-full flex-col overflow-y-auto overscroll-contain border-0 p-0 backdrop:overscroll-contain backdrop:bg-black/40 backdrop:backdrop-blur-[2px] open:flex",
      rounded && "coim-drawer-rounded",
      surface && "coim-drawer-surface",
      anchorClass,
      className,
    )}
    {...rest}
  >
    {@render children?.()}
  </dialog>
{:else if variant === "permanent" || open}
  <aside
    aria-label={ariaLabel}
    aria-labelledby={ariaLabel ? undefined : ariaLabelledBy}
    data-anchor={anchor}
    data-variant={variant}
    data-open={variant === "permanent" ? "true" : String(open)}
    class={cn(
      "coim-drawer-paper bg-background-paper text-text-primary flex flex-col overflow-y-auto overscroll-contain",
      rounded && "coim-drawer-rounded",
      surface && "coim-drawer-surface shadow-sm",
      anchorClass,
      className,
    )}
    {...rest}
  >
    {@render children?.()}
  </aside>
{/if}
