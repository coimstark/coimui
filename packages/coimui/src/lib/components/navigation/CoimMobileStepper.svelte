<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import CiChevronLeftSmall from "../../icons/ui/CiChevronLeftSmall.svelte";
  import CiChevronRightSmall from "../../icons/ui/CiChevronRightSmall.svelte";
  import { cn } from "../../utilities/utils.js";
  import type { CoimMobileStepperVariant } from "./types.js";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "class" | "children"> {
    steps: number;
    activeStep?: number;
    variant?: CoimMobileStepperVariant;
    position?: "bottom" | "top" | "static";
    backLabel?: string;
    nextLabel?: string;
    backButton?: Snippet;
    nextButton?: Snippet;
    onBack?: () => void;
    onNext?: () => void;
    class?: string;
  }

  let {
    steps,
    activeStep = $bindable(0),
    variant = "dots",
    position = "static",
    backLabel = "Back",
    nextLabel = "Next",
    backButton,
    nextButton,
    onBack,
    onNext,
    class: className = "",
    ...rest
  }: Props = $props();

  const safeSteps = $derived(Math.max(1, Math.floor(steps)));
  const clampedStep = $derived(Math.min(Math.max(0, Math.floor(activeStep)), safeSteps - 1));
  const progressPercent = $derived(
    safeSteps <= 1 ? 100 : Math.round((clampedStep / (safeSteps - 1)) * 100),
  );

  function handleBack() {
    if (clampedStep <= 0) return;
    activeStep = clampedStep - 1;
    onBack?.();
  }

  function handleNext() {
    if (clampedStep >= safeSteps - 1) return;
    activeStep = clampedStep + 1;
    onNext?.();
  }
</script>

<div
  class={cn(
    "coim-mobile-stepper",
    position === "bottom" && "sticky bottom-0 z-10",
    position === "top" && "sticky top-0 z-10",
    className,
  )}
  {...rest}
>
  {#if backButton}
    {@render backButton()}
  {:else}
    <button
      type="button"
      disabled={clampedStep === 0}
      class="coim-btn coim-btn-text coim-btn-size-small coim-btn-color-primary"
      onclick={handleBack}
    >
      <CiChevronLeftSmall size="small" />
      <span>{backLabel}</span>
    </button>
  {/if}

  {#if variant === "dots"}
    <div class="coim-mobile-stepper-dots" role="status" aria-label={`Step ${clampedStep + 1} of ${safeSteps}`}>
      {#each Array.from({ length: safeSteps }, (_, i) => i) as stepIdx (stepIdx)}
        <span
          class={cn("coim-mobile-stepper-dot", stepIdx === clampedStep && "is-active")}
        ></span>
      {/each}
    </div>
  {:else if variant === "progress"}
    <div
      class="coim-mobile-stepper-progress"
      role="progressbar"
      aria-label={`Step ${clampedStep + 1} of ${safeSteps}`}
      aria-valuenow={clampedStep + 1}
      aria-valuemin={1}
      aria-valuemax={safeSteps}
    >
      <div class="coim-mobile-stepper-progress-bar" style={`width: ${progressPercent}%`}></div>
    </div>
  {:else}
    <div class="font-body text-text-secondary text-sm">
      {clampedStep + 1} / {safeSteps}
    </div>
  {/if}

  {#if nextButton}
    {@render nextButton()}
  {:else}
    <button
      type="button"
      disabled={clampedStep >= safeSteps - 1}
      class="coim-btn coim-btn-text coim-btn-size-small coim-btn-color-primary"
      onclick={handleNext}
    >
      <span>{nextLabel}</span>
      <CiChevronRightSmall size="small" />
    </button>
  {/if}
</div>
