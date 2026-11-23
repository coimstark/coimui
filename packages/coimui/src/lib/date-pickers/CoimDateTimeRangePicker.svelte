<script lang="ts">
  import { DateField, Popover, type DateRange } from "bits-ui";
  import {
    CalendarDate,
    CalendarDateTime,
    Time,
    getLocalTimeZone,
    today,
    type DateValue,
  } from "@internationalized/date";
  import CiCalendarClock from "../icons/ui/CiCalendarClock.svelte";
  import CiCross from "../icons/ui/CiCross.svelte";
  import { cn } from "../utilities/utils.js";
  import CoimRangeCalendar from "./CoimRangeCalendar.svelte";
  import CoimTimeField from "./CoimTimeField.svelte";
  import type { CoimDateRangePreset, CoimDateTimeRange } from "./types.js";
  import { getPresetDateRanges } from "./utils.js";

  interface Props {
    value?: CoimDateTimeRange;
    open?: boolean;
    label?: string;
    helperText?: string;
    error?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    clearable?: boolean;
    minValue?: DateValue;
    maxValue?: DateValue;
    numberOfMonths?: number;
    hourCycle?: 12 | 24;
    presets?: CoimDateRangePreset[];
    showPresets?: boolean;
    locale?: string;
    onValueChange?: (value: CoimDateTimeRange) => void;
    onOpenChange?: (open: boolean) => void;
    class?: string;
  }

  let {
    value = $bindable<CoimDateTimeRange>({ start: undefined, end: undefined }),
    open = $bindable(false),
    label,
    helperText,
    error = false,
    disabled = false,
    readonly = false,
    required = false,
    clearable = false,
    minValue,
    maxValue,
    numberOfMonths = 2,
    hourCycle = 24,
    presets,
    showPresets = true,
    locale = "en",
    onValueChange,
    onOpenChange,
    class: className = "",
  }: Props = $props();

  const uid = $props.id();
  const labelId = `${uid}-label`;

  const resolvedPresets = $derived(presets ?? (showPresets ? getPresetDateRanges() : []));

  const dateRangePart = $derived<DateRange>({
    start: value.start
      ? new CalendarDate(value.start.year, value.start.month, value.start.day)
      : undefined,
    end: value.end
      ? new CalendarDate(value.end.year, value.end.month, value.end.day)
      : undefined,
  });

  const startTimePart = $derived(
    value.start ? new Time(value.start.hour, value.start.minute, value.start.second) : new Time(9, 0),
  );
  const endTimePart = $derived(
    value.end ? new Time(value.end.hour, value.end.minute, value.end.second) : new Time(17, 0),
  );

  function toCalendarDateTime(d: DateValue | undefined, t: Time): CalendarDateTime | undefined {
    if (!d) return undefined;
    return new CalendarDateTime(d.year, d.month, d.day, t.hour, t.minute, t.second);
  }

  function updateStartDateTime(nextStart: DateValue | undefined) {
    const dt =
      nextStart instanceof CalendarDateTime
        ? nextStart
        : toCalendarDateTime(nextStart, startTimePart);
    const next: CoimDateTimeRange = { start: dt, end: value.end };
    value = next;
    onValueChange?.(next);
  }

  function updateEndDateTime(nextEnd: DateValue | undefined) {
    const dt =
      nextEnd instanceof CalendarDateTime ? nextEnd : toCalendarDateTime(nextEnd, endTimePart);
    const next: CoimDateTimeRange = { start: value.start, end: dt };
    value = next;
    onValueChange?.(next);
  }

  function updateDateRange(range: DateRange) {
    const next: CoimDateTimeRange = {
      start: toCalendarDateTime(range.start, startTimePart),
      end: toCalendarDateTime(range.end, endTimePart),
    };
    value = next;
    onValueChange?.(next);
  }

  function updateStartTime(nextTime: Time | undefined) {
    if (!nextTime) return;
    const base = dateRangePart.start ?? today(getLocalTimeZone());
    const next: CoimDateTimeRange = {
      start: toCalendarDateTime(base, nextTime),
      end: value.end,
    };
    value = next;
    onValueChange?.(next);
  }

  function updateEndTime(nextTime: Time | undefined) {
    if (!nextTime) return;
    const base = dateRangePart.end ?? dateRangePart.start ?? today(getLocalTimeZone());
    const next: CoimDateTimeRange = {
      start: value.start,
      end: toCalendarDateTime(base, nextTime),
    };
    value = next;
    onValueChange?.(next);
  }

  function clearRange() {
    const next: CoimDateTimeRange = { start: undefined, end: undefined };
    value = next;
    onValueChange?.(next);
  }
</script>

<div class={cn("coim-date-field-wrap", error && "coim-error", className)}>
  {#if label}
    <span id={labelId} class="coim-date-field-label">
      {label}{required ? " *" : ""}
    </span>
  {/if}

  <Popover.Root
    {open}
    onOpenChange={(next) => {
      open = next;
      onOpenChange?.(next);
    }}
  >
    <div
      class="coim-date-input flex-wrap"
      role="group"
      aria-labelledby={label ? labelId : undefined}
      aria-label={!label ? "Date and time range" : undefined}
    >
      <DateField.Root
        value={value.start}
        {disabled}
        {readonly}
        {required}
        {minValue}
        {maxValue}
        granularity="minute"
        {hourCycle}
        {locale}
        onValueChange={updateStartDateTime}
      >
        <DateField.Label class="sr-only">Start date and time</DateField.Label>
        <DateField.Input class="inline-flex items-center">
          {#snippet children({ segments })}
            {#each segments as { part, value: segVal }, idx (`s-${idx}-${part}`)}
              {#if part === "literal"}
                <span class="text-text-secondary select-none">{segVal}</span>
              {:else}
                <DateField.Segment {part} class="coim-date-segment">
                  {segVal}
                </DateField.Segment>
              {/if}
            {/each}
          {/snippet}
        </DateField.Input>
      </DateField.Root>

      <span class="text-text-secondary px-1 select-none">→</span>

      <DateField.Root
        value={value.end}
        {disabled}
        {readonly}
        {required}
        {minValue}
        {maxValue}
        granularity="minute"
        {hourCycle}
        {locale}
        onValueChange={updateEndDateTime}
      >
        <DateField.Label class="sr-only">End date and time</DateField.Label>
        <DateField.Input class="inline-flex items-center">
          {#snippet children({ segments })}
            {#each segments as { part, value: segVal }, idx (`e-${idx}-${part}`)}
              {#if part === "literal"}
                <span class="text-text-secondary select-none">{segVal}</span>
              {:else}
                <DateField.Segment {part} class="coim-date-segment">
                  {segVal}
                </DateField.Segment>
              {/if}
            {/each}
          {/snippet}
        </DateField.Input>
      </DateField.Root>

      <span class="ms-auto inline-flex shrink-0 items-center gap-0.5">
        {#if clearable && (value.start || value.end) && !disabled && !readonly}
          <button
            type="button"
            aria-label={`Clear ${label ?? "date and time range"}`}
            class="text-text-secondary hover:text-error inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm bg-transparent transition-colors"
            onclick={(e) => {
              e.stopPropagation();
              clearRange();
            }}
          >
            <CiCross size="small" />
          </button>
        {/if}
        <Popover.Trigger
          aria-label="Open date and time range picker"
          {disabled}
          class="coim-date-trigger ms-0!"
        >
          <CiCalendarClock size="small" />
        </Popover.Trigger>
      </span>
    </div>

    <Popover.Portal>
      <Popover.Content sideOffset={6} class="coim-calendar-card z-50 flex flex-col gap-3 outline-none">
        <div class="flex flex-col gap-3 md:flex-row">
          {#if resolvedPresets.length > 0}
            <div class="border-grey-100 flex flex-row flex-wrap gap-1 border-b pb-2 md:w-36 md:flex-col md:border-e md:border-b-0 md:pe-3 md:pb-0">
              {#each resolvedPresets as preset (preset.id)}
                <button
                  type="button"
                  class="hover:bg-grey-50 text-text-primary rounded-md px-2.5 py-1.5 text-start text-xs font-medium"
                  onclick={() => updateDateRange(preset.range)}
                >
                  {preset.label}
                </button>
              {/each}
            </div>
          {/if}

          <CoimRangeCalendar
            value={dateRangePart}
            {minValue}
            {maxValue}
            {disabled}
            {readonly}
            {numberOfMonths}
            {locale}
            class="border-0 p-0 shadow-none"
            onValueChange={updateDateRange}
          />
        </div>

        <div class="border-grey-100 flex flex-wrap items-end justify-between gap-3 border-t pt-3">
          <div class="flex flex-wrap items-end gap-3">
            <CoimTimeField
              value={startTimePart}
              label="Start time"
              {hourCycle}
              {disabled}
              {readonly}
              onValueChange={updateStartTime}
            />
            <CoimTimeField
              value={endTimePart}
              label="End time"
              {hourCycle}
              {disabled}
              {readonly}
              onValueChange={updateEndTime}
            />
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="text-text-secondary hover:text-primary px-2 py-1 text-xs font-medium"
              onclick={clearRange}
            >
              Clear
            </button>
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
        </div>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>

  {#if helperText}
    <p class={cn("text-xs", error ? "text-error" : "text-text-secondary")}>
      {helperText}
    </p>
  {/if}
</div>
