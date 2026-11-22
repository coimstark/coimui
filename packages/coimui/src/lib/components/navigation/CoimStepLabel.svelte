<script lang="ts">
  import type { Snippet } from "svelte";
  import CiCheck from "../../icons/ui/CiCheck.svelte";
  import { cn } from "../../utilities/utils.js";
  import { getStepperContext, tryGetStepContext } from "./context.js";

  interface Props {
    error?: boolean;
    optional?: string | Snippet;
    icon?: Snippet;
    onclick?: () => void;
    class?: string;
    children?: Snippet;
  }

  let {
    error = false,
    optional,
    icon,
    onclick,
    class: className = "",
    children,
  }: Props = $props();

  const stepperCtx = getStepperContext();
  const stepCtx = tryGetStepContext();

  const stepIndex = $derived(stepCtx?.index ?? 0);
  const isActive = $derived(stepCtx?.active ?? false);
  const isCompleted = $derived(stepCtx?.completed ?? false);
  const isDisabled = $derived(stepCtx?.disabled ?? false);
  const isClickable = $derived(!isDisabled && (stepperCtx.nonLinear || Boolean(onclick)));

  function handleSelect() {
    if (isDisabled) return;
    if (stepperCtx.nonLinear) {
      stepperCtx.selectStep(stepIndex);
    }
    onclick?.();
  }
</script>

{#snippet innerContent()}
  <span class="coim-step-icon-container">
    <span
      class={cn(
        "coim-step-icon-badge",
        isActive && !error && "is-active",
        isCompleted && !error && "is-completed",
        error && "is-error",
      )}
    >
      {#if icon}
        {@render icon()}
      {:else if error}
        !
      {:else if isCompleted}
        <CiCheck size="small" />
      {:else}
        {stepIndex + 1}
      {/if}
    </span>
  </span>

  <span class="coim-step-label-container flex flex-col">
    <span class="coim-step-label-text">
      {#if children}
        {@render children()}
      {/if}
    </span>
    {#if optional}
      <span class="font-body text-text-secondary text-xs">
        {#if typeof optional === "string"}
          {optional}
        {:else}
          {@render optional()}
        {/if}
      </span>
    {/if}
  </span>
{/snippet}

{#if isClickable}
  <button
    type="button"
    disabled={isDisabled}
    class={cn(
      "coim-step-label coim-step-label-button",
      `coim-step-label-${stepperCtx.orientation}`,
      stepperCtx.alternativeLabel &&
        stepperCtx.orientation === "horizontal" &&
        "coim-step-label-alternative",
      isActive && "is-active",
      isCompleted && "is-completed",
      error && "is-error",
      className,
    )}
    onclick={handleSelect}
  >
    {@render innerContent()}
  </button>
{:else}
  <div
    class={cn(
      "coim-step-label",
      `coim-step-label-${stepperCtx.orientation}`,
      stepperCtx.alternativeLabel &&
        stepperCtx.orientation === "horizontal" &&
        "coim-step-label-alternative",
      isActive && "is-active",
      isCompleted && "is-completed",
      error && "is-error",
      isDisabled && "opacity-disabled",
      className,
    )}
  >
    {@render innerContent()}
  </div>
{/if}
