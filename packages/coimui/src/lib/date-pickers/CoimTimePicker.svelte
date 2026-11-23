<script lang="ts">
  import { Popover } from "bits-ui";
  import { Time } from "@internationalized/date";
  import CiCalendarClock from "../icons/ui/CiCalendarClock.svelte";
  import CiCross from "../icons/ui/CiCross.svelte";
  import { cn } from "../utilities/utils.js";
  import CoimTimeField from "./CoimTimeField.svelte";

  interface Props {
    value?: Time;
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
    analogClock?: boolean;
    onValueChange?: (value: Time | undefined) => void;
    onOpenChange?: (open: boolean) => void;
    class?: string;
  }

  let {
    value = $bindable<Time | undefined>(undefined),
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
    analogClock = false,
    onValueChange,
    onOpenChange,
    class: className = "",
  }: Props = $props();

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = $derived(
    Array.from({ length: Math.floor(60 / Math.max(1, minuteStep)) }, (_, i) => i * minuteStep),
  );

  function selectHour(h: number) {
    const next = new Time(h, value?.minute ?? 0, value?.second ?? 0);
    value = next;
    onValueChange?.(next);
  }

  function selectMinute(m: number) {
    const next = new Time(value?.hour ?? 9, m, value?.second ?? 0);
    value = next;
    onValueChange?.(next);
  }

  const clockAngles = $derived.by(() => {
    const h = value?.hour ?? 9;
    const m = value?.minute ?? 0;
    return {
      hourDeg: ((h % 12) + m / 60) * 30,
      minuteDeg: m * 6,
    };
  });
</script>

<div class={cn("coim-date-field-wrap", className)}>
  <Popover.Root
    {open}
    onOpenChange={(next) => {
      open = next;
      onOpenChange?.(next);
    }}
  >
    <CoimTimeField
      bind:value
      {label}
      {helperText}
      {error}
      {disabled}
      {readonly}
      {required}
      {hourCycle}
      onValueChange={(next) => {
        value = next;
        onValueChange?.(next);
      }}
    >
      {#snippet endAdornment()}
        <span class="ms-auto inline-flex shrink-0 items-center gap-0.5">
          {#if clearable && value && !disabled && !readonly}
            <button
              type="button"
              aria-label={`Clear ${label ?? "time"}`}
              class="text-text-secondary hover:text-error inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm bg-transparent transition-colors"
              onclick={(e) => {
                e.stopPropagation();
                value = undefined;
                onValueChange?.(undefined);
              }}
            >
              <CiCross size="small" />
            </button>
          {/if}
          <Popover.Trigger
            aria-label="Open time selector"
            {disabled}
            class="coim-date-trigger ms-0!"
          >
            <CiCalendarClock size="small" />
          </Popover.Trigger>
        </span>
      {/snippet}
    </CoimTimeField>

    <Popover.Portal>
      <Popover.Content sideOffset={6} class="coim-calendar-card z-50 w-auto min-w-56 outline-none">
        {#if analogClock}
          <div class="mb-3 flex justify-center">
            <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
              <circle cx="60" cy="60" r="54" fill="hsl(var(--grey-25))" stroke="hsl(var(--grey-200))" />
              <line
                x1="60"
                y1="60"
                x2={60 + 28 * Math.sin((clockAngles.hourDeg * Math.PI) / 180)}
                y2={60 - 28 * Math.cos((clockAngles.hourDeg * Math.PI) / 180)}
                stroke="hsl(var(--primary))"
                stroke-width="3"
                stroke-linecap="round"
              />
              <line
                x1="60"
                y1="60"
                x2={60 + 40 * Math.sin((clockAngles.minuteDeg * Math.PI) / 180)}
                y2={60 - 40 * Math.cos((clockAngles.minuteDeg * Math.PI) / 180)}
                stroke="hsl(var(--secondary))"
                stroke-width="2"
                stroke-linecap="round"
              />
              <circle cx="60" cy="60" r="3" fill="hsl(var(--primary))" />
            </svg>
          </div>
        {/if}

        <div class="grid grid-cols-2 gap-2">
          <div class="max-h-48 overflow-y-auto pe-1" role="listbox" aria-label="Hours">
            {#each hours as h (h)}
              <button
                type="button"
                role="option"
                aria-selected={value?.hour === h}
                class={cn(
                  "block w-full rounded px-2 py-1 text-center text-sm tabular-nums",
                  value?.hour === h ? "bg-primary text-primary-contrast font-semibold" : "hover:bg-grey-50",
                )}
                onclick={() => selectHour(h)}
              >
                {String(h).padStart(2, "0")}
              </button>
            {/each}
          </div>

          <div class="max-h-48 overflow-y-auto ps-1" role="listbox" aria-label="Minutes">
            {#each minutes as m (m)}
              <button
                type="button"
                role="option"
                aria-selected={value?.minute === m}
                class={cn(
                  "block w-full rounded px-2 py-1 text-center text-sm tabular-nums",
                  value?.minute === m ? "bg-primary text-primary-contrast font-semibold" : "hover:bg-grey-50",
                )}
                onclick={() => selectMinute(m)}
              >
                {String(m).padStart(2, "0")}
              </button>
            {/each}
          </div>
        </div>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
</div>
