<script lang="ts">
  import type { Snippet } from "svelte";
  import CiCheckSquare from "../../icons/ui/CiCheckSquare.svelte";
  import CiCrossSquare from "../../icons/ui/CiCrossSquare.svelte";
  import CiExclamationSquare from "../../icons/ui/CiExclamationSquare.svelte";
  import CiInfoSquare from "../../icons/ui/CiInfoSquare.svelte";
  import { cn } from "../../utilities/utils.js";
  import CoimCircularProgress from "./CoimCircularProgress.svelte";
  import CoimDialog from "./CoimDialog.svelte";
  import CoimDialogActions from "./CoimDialogActions.svelte";
  import CoimDialogContent from "./CoimDialogContent.svelte";
  import CoimDialogContentText from "./CoimDialogContentText.svelte";
  import CoimDialogTitle from "./CoimDialogTitle.svelte";
  import type { AlertSeverity, DialogCloseReason, DialogMaxWidth } from "./types.js";

  interface Props {
    open?: boolean;
    title?: string | Snippet;
    description?: string | Snippet;
    severity?: AlertSeverity;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    autoClose?: boolean;
    maxWidth?: DialogMaxWidth;
    disableBackdropClick?: boolean;
    disableEscapeKeyDown?: boolean;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
    onClose?: (reason?: DialogCloseReason) => void;
    onOpenChange?: (open: boolean) => void;
    class?: string;
    children?: Snippet;
  }

  let {
    open = $bindable(false),
    title = "Confirm action",
    description,
    severity = "warning",
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
    autoClose = true,
    maxWidth = "xs",
    disableBackdropClick = false,
    disableEscapeKeyDown = false,
    onConfirm,
    onCancel,
    onClose,
    onOpenChange,
    class: className = "",
    children,
  }: Props = $props();

  let internalPending = $state(false);
  const isLoading = $derived(loading || internalPending);

  const iconBadgeClass = $derived.by(() => {
    switch (severity) {
      case "success":
        return "bg-success-light/10 text-success";
      case "info":
        return "bg-info-light/10 text-info";
      case "error":
        return "bg-error-light/10 text-error";
      case "warning":
      default:
        return "bg-warning-light/10 text-warning";
    }
  });

  const confirmButtonClass = $derived.by(() => {
    switch (severity) {
      case "error":
        return "bg-error hover:bg-error-dark text-text-contrast";
      case "warning":
        return "bg-warning hover:bg-warning-dark text-text-contrast";
      case "success":
        return "bg-success hover:bg-success-dark text-text-contrast";
      case "info":
      default:
        return "bg-primary hover:bg-primary-dark text-text-contrast";
    }
  });

  function handleCancel() {
    if (isLoading) return;
    open = false;
    onCancel?.();
  }

  function handleDialogClose(reason?: DialogCloseReason) {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      onCancel?.();
    }
    onClose?.(reason);
  }

  async function handleConfirm() {
    if (isLoading) return;
    try {
      const result = onConfirm?.();
      if (result && typeof (result as Promise<void>).then === "function") {
        internalPending = true;
        await result;
      }
      if (autoClose) {
        open = false;
      }
    } finally {
      internalPending = false;
    }
  }
</script>

<CoimDialog
  bind:open
  {maxWidth}
  fullWidth
  disableBackdropClick={disableBackdropClick || isLoading}
  disableEscapeKeyDown={disableEscapeKeyDown || isLoading}
  onClose={handleDialogClose}
  {onOpenChange}
  class={className}
>
  <CoimDialogTitle class="flex items-center gap-3">
    <span class={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md", iconBadgeClass)}>
      {#if severity === "success"}
        <CiCheckSquare size="medium" />
      {:else if severity === "info"}
        <CiInfoSquare size="medium" />
      {:else if severity === "error"}
        <CiCrossSquare size="medium" />
      {:else}
        <CiExclamationSquare size="medium" />
      {/if}
    </span>
    <span class="min-w-0 flex-1">
      {#if typeof title === "string"}
        {title}
      {:else}
        {@render title()}
      {/if}
    </span>
  </CoimDialogTitle>

  {#if description || children}
    <CoimDialogContent>
      {#if description}
        {#if typeof description === "string"}
          <CoimDialogContentText>{description}</CoimDialogContentText>
        {:else}
          {@render description()}
        {/if}
      {/if}
      {@render children?.()}
    </CoimDialogContent>
  {/if}

  <CoimDialogActions>
    <button
      type="button"
      disabled={isLoading}
      onclick={handleCancel}
      class="font-body text-text-primary hover:bg-grey-25 inline-flex cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
    >
      {cancelText}
    </button>
    <button
      type="button"
      disabled={isLoading}
      aria-busy={isLoading ? "true" : undefined}
      onclick={handleConfirm}
      class={cn(
        "font-body inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border-0 px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        confirmButtonClass,
      )}
    >
      {#if isLoading}
        <CoimCircularProgress size="tiny" color="inherit" label="Loading" />
      {/if}
      <span>{confirmText}</span>
    </button>
  </CoimDialogActions>
</CoimDialog>
