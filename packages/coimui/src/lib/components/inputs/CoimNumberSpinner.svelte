<script lang="ts">
  import CoimNumberField from "./CoimNumberField.svelte";
  import type { CoimInputSize, CoimInputVariant } from "./types.js";

  interface Props {
    id?: string;
    value?: number | null;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    variant?: CoimInputVariant;
    size?: CoimInputSize;
    surface?: boolean;
    error?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    fullWidth?: boolean;
    placeholder?: string;
    label?: string;
    onValueChange?: (value: number | null) => void;
    class?: string;
  }

  let { value = $bindable<number | null>(0), ...rest }: Props = $props();
</script>

<CoimNumberField bind:value {...rest} />
