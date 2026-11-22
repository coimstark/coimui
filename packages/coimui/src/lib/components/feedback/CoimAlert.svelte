<script lang="ts">
  import type { Snippet } from "svelte";
  import CiCheckSquare from "../../icons/ui/CiCheckSquare.svelte";
  import CiCross from "../../icons/ui/CiCross.svelte";
  import CiCrossSquare from "../../icons/ui/CiCrossSquare.svelte";
  import CiExclamationSquare from "../../icons/ui/CiExclamationSquare.svelte";
  import CiInfoSquare from "../../icons/ui/CiInfoSquare.svelte";
  import type { CoimColor } from "../../theme/types.js";
  import { cn } from "../../utilities/utils.js";
  import type { AlertSeverity, AlertVariant } from "./types.js";

  interface Props {
    severity?: AlertSeverity;
    variant?: AlertVariant;
    color?: AlertSeverity | CoimColor;
    neutral?: boolean;
    icon?: Snippet | false;
    iconMapping?: Partial<Record<AlertSeverity, Snippet>>;
    action?: Snippet;
    onClose?: (event: MouseEvent) => void;
    closeText?: string;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    severity = "success",
    variant = "standard",
    color,
    neutral = false,
    icon,
    iconMapping,
    action,
    onClose,
    closeText = "Close",
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  const resolvedColor = $derived(color ?? severity);

  const mappedSnippet = $derived(iconMapping?.[severity]);

  const variantClasses = $derived.by(() => {
    if (neutral) return "";
    if (variant === "filled") {
      switch (resolvedColor) {
        case "success":
          return "bg-success text-text-contrast font-medium";
        case "info":
          return "bg-info text-text-contrast font-medium";
        case "warning":
          return "bg-warning text-text-contrast font-medium";
        case "error":
          return "bg-error text-text-contrast font-medium";
        case "primary":
          return "bg-primary text-text-contrast font-medium";
        case "secondary":
          return "bg-secondary text-text-contrast font-medium";
        default:
          return "text-text-contrast font-medium";
      }
    }
    if (variant === "outlined") {
      switch (resolvedColor) {
        case "success":
          return "border border-solid border-success/50 text-success bg-transparent";
        case "info":
          return "border border-solid border-info/50 text-info bg-transparent";
        case "warning":
          return "border border-solid border-warning/50 text-warning bg-transparent";
        case "error":
          return "border border-solid border-error/50 text-error bg-transparent";
        case "primary":
          return "border border-solid border-primary/50 text-primary bg-transparent";
        case "secondary":
          return "border border-solid border-secondary/50 text-secondary bg-transparent";
        default:
          return "border border-solid bg-transparent";
      }
    }
    switch (resolvedColor) {
      case "success":
        return "bg-success-light/10 text-success-dark";
      case "info":
        return "bg-info-light/10 text-info-dark";
      case "warning":
        return "bg-warning-light/10 text-warning-dark";
      case "error":
        return "bg-error-light/10 text-error-dark";
      case "primary":
        return "bg-primary-light/10 text-primary-dark";
      case "secondary":
        return "bg-secondary-light/10 text-secondary-dark";
      default:
        return "";
    }
  });

  const iconColorClass = $derived.by(() => {
    if (variant === "filled" && !neutral) return "text-current";
    switch (resolvedColor) {
      case "success":
        return "text-success";
      case "info":
        return "text-info";
      case "warning":
        return "text-warning";
      case "error":
        return "text-error";
      case "primary":
        return "text-primary";
      case "secondary":
        return "text-secondary";
      default:
        return "text-current";
    }
  });
</script>

<div
  role="alert"
  data-severity={severity}
  data-variant={variant}
  class={cn(
    "coim-alert font-body flex items-start rounded-md px-4 py-2 text-base leading-5 font-normal",
    `coim-alert-${variant}`,
    `coim-alert-color-${resolvedColor}`,
    variantClasses,
    neutral && "neutral border-grey-100 bg-background-paper border border-solid",
    className,
  )}
  {...rest}
>
  {#if icon !== false}
    <span class={cn("coim-alert-icon me-3 inline-flex shrink-0 items-center py-0.5", iconColorClass)}>
      {#if icon}
        {@render icon()}
      {:else if mappedSnippet}
        {@render mappedSnippet()}
      {:else if severity === "success"}
        <CiCheckSquare size="medium" />
      {:else if severity === "info"}
        <CiInfoSquare size="medium" />
      {:else if severity === "warning"}
        <CiExclamationSquare size="medium" />
      {:else}
        <CiCrossSquare size="medium" />
      {/if}
    </span>
  {/if}

  <div class="coim-alert-message min-w-0 flex-1 py-0.5">
    {@render children?.()}
  </div>

  {#if action}
    <div class="coim-alert-action ms-auto -me-2 flex shrink-0 items-center ps-4 pt-0">
      {@render action()}
    </div>
  {:else if onClose}
    <div class="coim-alert-action ms-auto -me-2 flex shrink-0 items-center ps-4 pt-0">
      <button
        type="button"
        aria-label={closeText}
        onclick={onClose}
        class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-current opacity-80 transition-opacity hover:opacity-100"
      >
        <CiCross size="small" />
      </button>
    </div>
  {/if}
</div>
