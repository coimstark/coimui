<script lang="ts">
  import { onDestroy, untrack, type Snippet } from "svelte";
  import { cn } from "../../utilities/utils.js";
  import { setDialogContext } from "./dialog-context.js";
  import type { DialogCloseReason, DialogMaxWidth, DialogScroll } from "./types.js";

  interface Props {
    open?: boolean;
    onClose?: (reason?: DialogCloseReason) => void;
    maxWidth?: DialogMaxWidth;
    fullWidth?: boolean;
    fullScreen?: boolean;
    scroll?: DialogScroll;
    disableBackdropClick?: boolean;
    disableEscapeKeyDown?: boolean;
    modal?: boolean;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    open = $bindable(false),
    onClose,
    maxWidth = "sm",
    fullWidth = false,
    fullScreen = false,
    scroll = "paper",
    disableBackdropClick = false,
    disableEscapeKeyDown = false,
    modal = true,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  const uid = $props.id();
  const defaultTitleId = `${uid}-title`;
  const defaultDescriptionId = `${uid}-description`;

  let registeredTitleId = $state<string | undefined>(undefined);
  let registeredDescriptionId = $state<string | undefined>(undefined);

  setDialogContext({
    defaultTitleId,
    defaultDescriptionId,
    registerTitle(id: string) {
      registeredTitleId = id;
      return () => {
        if (registeredTitleId === id) {
          registeredTitleId = undefined;
        }
      };
    },
    registerDescription(id: string) {
      registeredDescriptionId = id;
      return () => {
        if (registeredDescriptionId === id) {
          registeredDescriptionId = undefined;
        }
      };
    },
  });

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

  const maxWidthClass = $derived.by(() => {
    if (fullScreen) return "";
    switch (maxWidth) {
      case "xs":
        return "max-w-[444px]";
      case "sm":
        return "max-w-[600px]";
      case "md":
        return "max-w-[900px]";
      case "lg":
        return "max-w-[1200px]";
      case "xl":
        return "max-w-[1536px]";
      case false:
      default:
        return "max-w-[calc(100vw-2rem)]";
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

  $effect(() => {
    const el = dialogEl;
    if (!el) return;

    if (open && !el.open) {
      untrack(() => {
        previousActiveElement =
          typeof document !== "undefined" && document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
      });
      if (modal && typeof el.showModal === "function") {
        el.showModal();
      } else if (typeof el.show === "function") {
        el.show();
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

  function isPointerOutsideDialog(e: PointerEvent | MouseEvent, el: HTMLDialogElement): boolean {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) {
      return e.target === el;
    }
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  }

  function handlePointerDown(e: PointerEvent) {
    if (!dialogEl) return;
    if (e.target === dialogEl && isPointerOutsideDialog(e, dialogEl)) {
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
      isPointerOutsideDialog(e, dialogEl);
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
      isPointerOutsideDialog(e, dialogEl) &&
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

<dialog
  bind:this={dialogEl}
  closedby={closedByAttr}
  aria-label={ariaLabel}
  aria-labelledby={ariaLabel ? undefined : (ariaLabelledBy ?? registeredTitleId)}
  aria-describedby={ariaDescribedBy ?? registeredDescriptionId}
  data-scroll={scroll}
  data-max-width={maxWidth === false ? "false" : maxWidth}
  onclose={handleDialogClose}
  oncancel={handleCancel}
  onkeydown={handleKeyDown}
  onpointerdown={handlePointerDown}
  onpointerup={handlePointerUp}
  onclick={handleClick}
  class={cn(
    "coim-dialog bg-background-paper text-text-primary shadow-darker-md m-auto flex-col overflow-hidden overscroll-contain rounded-3xl border-0 p-0 backdrop:overscroll-contain backdrop:bg-black/40 backdrop:backdrop-blur-[2px] open:flex",
    scroll === "paper" ? "max-h-[calc(100dvh-4rem)]" : "coim-dialog-scroll-body max-h-[calc(100dvh-2rem)] overflow-y-auto",
    fullWidth && !fullScreen && "w-[calc(100%-2rem)]",
    fullScreen
      ? "coim-dialog-fullscreen h-[calc(100%-2rem)] max-h-none! w-[calc(100%-2rem)] max-w-none!"
      : maxWidthClass,
    className,
  )}
  {...rest}
>
  {@render children?.()}
</dialog>
