<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import { setStepperContext } from "./context.js";
  import type { CoimStepperOrientation } from "./types.js";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "class" | "children"> {
    activeStep?: number;
    orientation?: CoimStepperOrientation;
    alternativeLabel?: boolean;
    nonLinear?: boolean;
    onStepChange?: (step: number) => void;
    class?: string;
    children?: Snippet;
  }

  let {
    activeStep = $bindable(0),
    orientation = "horizontal",
    alternativeLabel = false,
    nonLinear = false,
    onStepChange,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  let stepCounter = 0;

  setStepperContext({
    get activeStep() {
      return activeStep;
    },
    get orientation() {
      return orientation;
    },
    get alternativeLabel() {
      return alternativeLabel;
    },
    get nonLinear() {
      return nonLinear;
    },
    assignIndex: () => stepCounter++,
    selectStep: (index) => {
      activeStep = index;
      onStepChange?.(index);
    },
  });
</script>

<div
  class={cn(
    "coim-stepper",
    `coim-stepper-${orientation}`,
    alternativeLabel && orientation === "horizontal" && "coim-stepper-alternative",
    className,
  )}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</div>
