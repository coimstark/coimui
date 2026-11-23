<script lang="ts">
  import { Popover, TimeField } from "bits-ui";
  import { Time } from "@internationalized/date";
  import CiCalendarClock from "../icons/ui/CiCalendarClock.svelte";
  import CiCross from "../icons/ui/CiCross.svelte";
  import { cn } from "../utilities/utils.js";
  import type { CoimTimeRange } from "./types.js";

  interface Props {
    value?: CoimTimeRange;
    open?: boolean;
    label?: string;
    helperText?: string;
    error?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    clearable?: boolean;
    hourCycle?: 12 | 24;
    minuteStep?: number;
    locale?: string;
    onValueChange?: (value: CoimTimeRange) => void;
    onOpenChange?: (open: boolean) => void;
    class?: string;
  }

  let {
    value = $bindable<CoimTimeRange>({ start: undefined, end: undefined }),
    open = $bindable(false),
    label,
    helperText,
    error = false,
    disabled = false,
    readonly = false,
    required = false,
    clearable = false,
    hourCycle = 24,
    minuteStep = 15,
    locale = "en",
    onValueChange,
    onOpenChange,
    class: className = "",
  }: Props = $props();

  const uid = $props.id();
  const labelId = `${uid}-label`;

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = $derived(
    Array.from({ length: Math.floor(60 / Math.max(1, minuteStep)) }, (_, i) => i * minuteStep),
  );

  const hasInvalidOrder = $derived(
    Boolean(value.start && value.end && value.start.compare(value.end) > 0),
  );

  function setStart(nextStart: Time | undefined) {
    const next: CoimTimeRange = { start: nextStart, end: value.end };
    value = next;
    onValueChange?.(next);
  }

  function setEnd(nextEnd: Time | undefined) {
    const next: CoimTimeRange = { start: value.start, end: nextEnd };
    value = next;
    onValueChange?.(next);
  }

  function selectStartHour(h: number) {
    setStart(new Time(h, value.start?.minute ?? 0, value.start?.second ?? 0));
  }

  function selectStartMinute(m: number) {
    setStart(new Time(value.start?.hour ?? 9, m, value.start?.second ?? 0));
  }

  function selectEndHour(h: number) {
    setEnd(new Time(h, value.end?.minute ?? 0, value.end?.second ?? 0));
  }

  function selectEndMinute(m: number) {
    setEnd(new Time(value.end?.hour ?? 17, m, value.end?.second ?? 0));
  }

  function clearRange() {
    const next: CoimTimeRange = { start: undefined, end: undefined };
    value = next;
    onValueChange?.(next);
  }
</script>

<div class={cn("coim-date-field-wrap", (error || hasInvalidOrder) && "coim-error", className)}>
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
      class="coim-date-input"
      role="group"
      aria-labelledby={label ? labelId : undefined}
      aria-label={!label ? "Time range" : undefined}
    >
      <TimeField.Root
        value={value.start}
        {disabled}
        {readonly}
        {required}
        {hourCycle}
        granularity="minute"
        {locale}
        onValueChange={setStart}
      >
        <TimeField.Label class="sr-only">Start time</TimeField.Label>
        <TimeField.Input class="inline-flex items-center">
          {#snippet children({ segments })}
            {#each segments as { part, value: segVal }, idx (`s-${idx}-${part}`)}
              {#if part === "literal"}
                <span class="text-text-secondary select-none">{segVal}</span>
              {:else}
                <TimeField.Segment {part} class="coim-date-segment">
                  {segVal}
                </TimeField.Segment>
              {/if}
            {/each}
          {/snippet}
        </TimeField.Input>
      </TimeField.Root>

      <span class="text-text-secondary px-1 select-none">→</span>

      <TimeField.Root
        value={value.end}
        {disabled}
        {readonly}
        {required}
        {hourCycle}
        granularity="minute"
        {locale}
        onValueChange={setEnd}
      >
        <TimeField.Label class="sr-only">End time</TimeField.Label>
        <TimeField.Input class="inline-flex items-center">
          {#snippet children({ segments })}
            {#each segments as { part, value: segVal }, idx (`e-${idx}-${part}`)}
              {#if part === "literal"}
                <span class="text-text-secondary select-none">{segVal}</span>
              {:else}
                <TimeField.Segment {part} class="coim-date-segment">
                  {segVal}
                </TimeField.Segment>
              {/if}
            {/each}
          {/snippet}
        </TimeField.Input>
      </TimeField.Root>

      <span class="ms-auto inline-flex shrink-0 items-center gap-0.5">
        {#if clearable && (value.start || value.end) && !disabled && !readonly}
          <button
            type="button"
            aria-label={`Clear ${label ?? "time range"}`}
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
          aria-label="Open time range selector"
          {disabled}
          class="coim-date-trigger ms-0!"
        >
          <CiCalendarClock size="small" />
        </Popover.Trigger>
      </span>
    </div>

    <Popover.Portal>
      <Popover.Content sideOffset={6} class="coim-calendar-card z-50 w-auto min-w-80 outline-none">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-text-secondary mb-1.5 text-xs font-semibold">Start Time</div>
            <div class="grid grid-cols-2 gap-1.5">
              <div class="max-h-44 overflow-y-auto pe-1" role="listbox" aria-label="Start hours">
                {#each hours as h (h)}
                  <button
                    type="button"
                    role="option"
                    aria-selected={value.start?.hour === h}
                    class={cn(
                      "block w-full rounded px-2 py-1 text-center text-sm tabular-nums",
                      value.start?.hour === h
                        ? "bg-primary text-primary-contrast font-semibold"
                        : "hover:bg-grey-50",
                    )}
                    onclick={() => selectStartHour(h)}
                  >
                    {String(h).padStart(2, "0")}
                  </button>
                {/each}
              </div>
              <div class="max-h-44 overflow-y-auto ps-1" role="listbox" aria-label="Start minutes">
                {#each minutes as m (m)}
                  <button
                    type="button"
                    role="option"
                    aria-selected={value.start?.minute === m}
                    class={cn(
                      "block w-full rounded px-2 py-1 text-center text-sm tabular-nums",
                      value.start?.minute === m
                        ? "bg-primary text-primary-contrast font-semibold"
                        : "hover:bg-grey-50",
                    )}
                    onclick={() => selectStartMinute(m)}
                  >
                    {String(m).padStart(2, "0")}
                  </button>
                {/each}
              </div>
            </div>
          </div>

          <div class="border-grey-100 border-s ps-4">
            <div class="text-text-secondary mb-1.5 text-xs font-semibold">End Time</div>
            <div class="grid grid-cols-2 gap-1.5">
              <div class="max-h-44 overflow-y-auto pe-1" role="listbox" aria-label="End hours">
                {#each hours as h (h)}
                  <button
                    type="button"
                    role="option"
                    aria-selected={value.end?.hour === h}
                    class={cn(
                      "block w-full rounded px-2 py-1 text-center text-sm tabular-nums",
                      value.end?.hour === h
                        ? "bg-primary text-primary-contrast font-semibold"
                        : "hover:bg-grey-50",
                    )}
                    onclick={() => selectEndHour(h)}
                  >
                    {String(h).padStart(2, "0")}
                  </button>
                {/each}
              </div>
              <div class="max-h-44 overflow-y-auto ps-1" role="listbox" aria-label="End minutes">
                {#each minutes as m (m)}
                  <button
                    type="button"
                    role="option"
                    aria-selected={value.end?.minute === m}
                    class={cn(
                      "block w-full rounded px-2 py-1 text-center text-sm tabular-nums",
                      value.end?.minute === m
                        ? "bg-primary text-primary-contrast font-semibold"
                        : "hover:bg-grey-50",
                    )}
                    onclick={() => selectEndMinute(m)}
                  >
                    {String(m).padStart(2, "0")}
                  </button>
                {/each}
              </div>
            </div>
          </div>
        </div>

        <div class="border-grey-100 mt-3 flex items-center justify-between border-t pt-2.5 text-xs">
          <button
            type="button"
            class="text-text-secondary hover:text-primary font-medium"
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
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>

  {#if hasInvalidOrder}
    <p class="text-error text-xs">End time should not be earlier than start time.</p>
  {:else if helperText}
    <p class={cn("text-xs", error ? "text-error" : "text-text-secondary")}>
      {helperText}
    </p>
  {/if}
</div>
