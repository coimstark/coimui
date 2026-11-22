<script lang="ts">
  import type { Snippet } from "svelte";
  import CiCheckSquare from "../../icons/ui/CiCheckSquare.svelte";
  import CiCross from "../../icons/ui/CiCross.svelte";
  import CiCrossSquare from "../../icons/ui/CiCrossSquare.svelte";
  import CiExclamationSquare from "../../icons/ui/CiExclamationSquare.svelte";
  import CiInfoSquare from "../../icons/ui/CiInfoSquare.svelte";
  import { clickAway } from "../../utilities/click-away/click-away.js";
  import { CoimPortal } from "../../utilities/portal/index.js";
  import {
    coimFade,
    coimSlide,
    resolveTransitionDuration,
  } from "../../utilities/transitions/transitions.js";
  import { cn } from "../../utilities/utils.js";
  import type {
    SnackbarCloseReason,
    ToastAnchorOrigin,
    ToastVariant,
  } from "./types.js";

  interface Props {
    open?: boolean;
    message?: string;
    title?: string;
    description?: string;
    variant?: ToastVariant;
    autoHideDuration?: number | null;
    anchorOrigin?: ToastAnchorOrigin;
    action?: Snippet;
    actionLabel?: string;
    onAction?: () => void;
    onClose?: (reason: SnackbarCloseReason) => void;
    closable?: boolean;
    closeOnClickAway?: boolean;
    inline?: boolean;
    disablePortal?: boolean;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    open = $bindable(false),
    message,
    title,
    description,
    variant = "default",
    autoHideDuration = null,
    anchorOrigin = { vertical: "bottom", horizontal: "right" },
    action,
    actionLabel,
    onAction,
    onClose,
    closable = true,
    closeOnClickAway = false,
    inline = false,
    disablePortal = false,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  $effect(() => {
    if (inline || !open || typeof window === "undefined") return;
    if (autoHideDuration === null || autoHideDuration <= 0) return;

    const timer = setTimeout(() => {
      open = false;
      onClose?.("timeout");
    }, autoHideDuration);

    return () => clearTimeout(timer);
  });

  function handleDismiss() {
    if (!inline) {
      open = false;
    }
    onClose?.("dismiss");
  }

  function handleClickAway() {
    if (!closeOnClickAway || inline || !open) return;
    open = false;
    onClose?.("clickaway");
  }

  const iconColorClass = $derived.by(() => {
    switch (variant) {
      case "success":
        return "text-success";
      case "info":
        return "text-info";
      case "warning":
        return "text-warning";
      case "error":
        return "text-error";
      default:
        return "";
    }
  });

  const positionClass = $derived.by(() => {
    const v = anchorOrigin.vertical === "top" ? "top-6" : "bottom-6";
    const h =
      anchorOrigin.horizontal === "left"
        ? "inset-s-6"
        : anchorOrigin.horizontal === "center"
          ? "left-1/2 -translate-x-1/2"
          : "inset-e-6";
    return `${v} ${h}`;
  });

  const slideDirection = $derived<"down" | "up">(
    anchorOrigin.vertical === "top" ? "down" : "up",
  );
  const enterDuration = $derived(resolveTransitionDuration(200, 200, "enter"));
  const exitDuration = $derived(resolveTransitionDuration(150, 150, "exit"));
</script>

{#snippet snackbarCard()}
  <div
    role={variant === "error" ? "alert" : "status"}
    aria-live={variant === "error" ? "assertive" : "polite"}
    aria-atomic="true"
    data-variant={variant}
    in:coimSlide={{ duration: enterDuration, direction: slideDirection }}
    out:coimFade={{ duration: exitDuration }}
    use:clickAway={{ enabled: !inline && closeOnClickAway && open, onClickAway: handleClickAway }}
    class={cn(
      "coim-snackbar-content border-grey-100 bg-background-paper font-body text-text-primary shadow-darker-sm pointer-events-auto flex max-w-md min-w-72 items-center gap-2 rounded-lg border border-solid px-4 py-2.5 text-base leading-5",
      variant !== "default" && `coim-snackbar-${variant}`,
      className,
    )}
    {...rest}
  >
    {#if variant !== "default"}
      <span class={cn("coim-snackbar-icon me-1 inline-flex shrink-0 items-center", iconColorClass)}>
        {#if variant === "success"}
          <CiCheckSquare size="medium" />
        {:else if variant === "info"}
          <CiInfoSquare size="medium" />
        {:else if variant === "warning"}
          <CiExclamationSquare size="medium" />
        {:else if variant === "error"}
          <CiCrossSquare size="medium" />
        {/if}
      </span>
    {/if}

    <div class="coim-snackbar-message min-w-0 flex-1">
      {#if children}
        {@render children()}
      {:else}
        {#if title}
          <div class="font-semibold">{title}</div>
        {/if}
        {#if message}
          <div class={cn(title && "text-text-secondary text-sm")}>{message}</div>
        {/if}
        {#if description}
          <div class="text-text-secondary text-sm">{description}</div>
        {/if}
      {/if}
    </div>

    {#if action || (actionLabel && onAction) || closable}
      <div class="coim-snackbar-action ms-auto flex shrink-0 items-center gap-1 ps-4">
        {#if action}
          {@render action()}
        {:else if actionLabel && onAction}
          <button
            type="button"
            onclick={onAction}
            class="font-body text-primary hover:bg-primary-light/10 cursor-pointer rounded-xs border-0 bg-transparent px-2.5 py-1 text-sm font-semibold transition-colors"
          >
            {actionLabel}
          </button>
        {/if}
        {#if closable}
          <button
            type="button"
            aria-label="Close"
            onclick={handleDismiss}
            class="text-text-secondary hover:bg-grey-25 hover:text-text-primary inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-xs border-0 bg-transparent transition-colors"
          >
            <CiCross size="small" />
          </button>
        {/if}
      </div>
    {/if}
  </div>
{/snippet}

{#if inline}
  {@render snackbarCard()}
{:else if open}
  <CoimPortal {disablePortal}>
    <div class={cn("coim-snackbar-root pointer-events-none fixed z-120", positionClass)}>
      {@render snackbarCard()}
    </div>
  </CoimPortal>
{/if}
