<script lang="ts">
  import { getLocalTimeZone, today, type DateValue } from "@internationalized/date";
  import { cn } from "../utilities/utils.js";
  import CoimCalendar from "./CoimCalendar.svelte";
  import { formatDateWithDayjs } from "./utils.js";

  interface Props {
    value?: DateValue;
    minValue?: DateValue;
    maxValue?: DateValue;
    disabled?: boolean;
    title?: string;
    onValueChange?: (value: DateValue | undefined) => void;
    class?: string;
  }

  let {
    value = $bindable<DateValue | undefined>(undefined),
    minValue,
    maxValue,
    disabled = false,
    title = "Select date",
    onValueChange,
    class: className = "",
  }: Props = $props();
</script>

<div class={cn("coim-calendar-card inline-flex flex-col gap-3", className)}>
  <div class="border-grey-100 border-b pb-2.5">
    <div class="text-text-secondary text-xs font-semibold uppercase tracking-wide">{title}</div>
    <div class="font-heading text-text-primary mt-0.5 text-lg font-semibold">
      {value ? formatDateWithDayjs(value, "ddd, MMM D, YYYY") : "No date selected"}
    </div>
  </div>

  <CoimCalendar
    bind:value
    {minValue}
    {maxValue}
    {disabled}
    class="min-w-0 border-0 p-0 shadow-none"
    onValueChange={(next) => {
      value = next;
      onValueChange?.(next);
    }}
  />

  <div class="border-grey-100 flex items-center justify-between border-t pt-2.5 text-xs">
    <button
      type="button"
      class="text-text-secondary hover:text-primary font-medium"
      onclick={() => {
        value = undefined;
        onValueChange?.(undefined);
      }}
    >
      Clear
    </button>
    <button
      type="button"
      class="text-primary hover:underline font-medium"
      onclick={() => {
        const next = today(getLocalTimeZone());
        value = next;
        onValueChange?.(next);
      }}
    >
      Today
    </button>
  </div>
</div>
