<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import { getStepperContext, setStepContext } from "./context.js";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "class" | "children"> {
    index?: number;
    active?: boolean;
    completed?: boolean;
    disabled?: boolean;
    hideConnector?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    index: indexProp,
    active: activeProp,
    completed: completedProp,
    disabled = false,
    hideConnector = false,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  const stepperCtx = getStepperContext();
  const autoIndex = stepperCtx.assignIndex();

  const stepIndex = $derived(indexProp ?? autoIndex);
  const isActive = $derived(activeProp ?? (!disabled && stepperCtx.activeStep === stepIndex));
  const isCompleted = $derived(
    completedProp ?? (!isActive && stepIndex < stepperCtx.activeStep),
  );

  setStepContext({
    get index() {
      return stepIndex;
    },
    get active() {
      return isActive;
    },
    get completed() {
      return isCompleted;
    },
    get disabled() {
      return disabled;
    },
  });
</script>

<div
  aria-current={isActive ? "step" : undefined}
  class={cn("coim-step", `coim-step-${stepperCtx.orientation}`, className)}
  {...rest}
>
  {#if !hideConnector && stepIndex > 0}
    <div
      aria-hidden="true"
      class={cn("coim-step-connector", `coim-step-connector-${stepperCtx.orientation}`)}
    >
      <span class="coim-step-connector-line"></span>
    </div>
  {/if}

  {#if children}
    {@render children()}
  {/if}
</div>
