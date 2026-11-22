<script lang="ts">
  import { Popover } from "bits-ui";
  import {
    CalendarDate,
    CalendarDateTime,
    Time,
    getLocalTimeZone,
    now,
    type DateValue,
  } from "@internationalized/date";
  import CiCalendarClock from "../icons/ui/CiCalendarClock.svelte";
  import { cn } from "../utilities/utils.js";
  import CoimCalendar from "./CoimCalendar.svelte";
  import CoimDateField from "./CoimDateField.svelte";
  import CoimTimeField from "./CoimTimeField.svelte";

  interface Props {
    value?: CalendarDateTime;
    open?: boolean;
    label?: string;
    helperText?: string;
    error?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    hourCycle?: 12 | 24;
    onValueChange?: (value: CalendarDateTime | undefined) => void;
    onOpenChange?: (open: boolean) => void;
    class?: string;
  }

  let {
    value = $bindable<CalendarDateTime | undefined>(undefined),
    open = $bindable(false),
    label,
    helperText,
    error = false,
    disabled = false,
    readonly = false,
    required = false,
    hourCycle = 24,
    onValueChange,
    onOpenChange,
    class: className = "",
  }: Props = $props();

  const datePart = $derived(
    value ? new CalendarDate(value.year, value.month, value.day) : undefined,
  );
  const timePart = $derived(
    value ? new Time(value.hour, value.minute, value.second) : new Time(9, 0),
  );

  function updateDate(nextDate: DateValue | undefined) {
    if (!nextDate) {
      value = undefined;
      onValueChange?.(undefined);
      return;
    }
    const next = new CalendarDateTime(
      nextDate.year,
      nextDate.month,
      nextDate.day,
      timePart.hour,
      timePart.minute,
      timePart.second,
    );
    value = next;
    onValueChange?.(next);
  }

  function updateTime(nextTime: Time | undefined) {
    if (!nextTime) return;
    const base = datePart ?? now(getLocalTimeZone());
    const next = new CalendarDateTime(
      base.year,
      base.month,
      base.day,
      nextTime.hour,
      nextTime.minute,
      nextTime.second,
    );
    value = next;
    onValueChange?.(next);
  }
</script>

<div class={cn("coim-date-field-wrap", className)}>
  <Popover.Root
    {open}
    onOpenChange={(next) => {
      open = next;
      onOpenChange?.(next);
    }}
  >
    <CoimDateField
      value={datePart}
      {label}
      {helperText}
      {error}
      {disabled}
      {readonly}
      {required}
      onValueChange={updateDate}
    >
      {#snippet endAdornment()}
        <Popover.Trigger
          aria-label="Open date and time picker"
          {disabled}
          class="coim-date-trigger"
        >
          <CiCalendarClock size="small" />
        </Popover.Trigger>
      {/snippet}
    </CoimDateField>

    <Popover.Portal>
      <Popover.Content sideOffset={6} class="coim-calendar-card z-50 flex flex-col gap-3 outline-none">
        <CoimCalendar
          value={datePart}
          {disabled}
          {readonly}
          class="border-0 p-0 shadow-none"
          onValueChange={updateDate}
        />

        <div class="border-grey-100 flex items-end justify-between gap-3 border-t pt-3">
          <CoimTimeField
            value={timePart}
            label="Time"
            {hourCycle}
            {disabled}
            {readonly}
            onValueChange={updateTime}
          />
          <button
            type="button"
            class="coim-btn coim-btn-contained coim-btn-size-small coim-btn-color-primary"
            onclick={() => {
              open = false;
              onOpenChange?.(false);
            }}
          >
            Done
          </button>
        </div>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
</div>
