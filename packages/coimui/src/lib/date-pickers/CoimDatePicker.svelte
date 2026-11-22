<script lang="ts">
  import { DatePicker } from "bits-ui";
  import { getLocalTimeZone, today, type DateValue } from "@internationalized/date";
  import CiCalendar from "../icons/ui/CiCalendar.svelte";
  import CiChevronLeftSmall from "../icons/ui/CiChevronLeftSmall.svelte";
  import CiChevronRightSmall from "../icons/ui/CiChevronRightSmall.svelte";
  import { cn } from "../utilities/utils.js";

  interface Props {
    value?: DateValue;
    placeholder?: DateValue;
    open?: boolean;
    label?: string;
    helperText?: string;
    error?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    minValue?: DateValue;
    maxValue?: DateValue;
    locale?: string;
    onValueChange?: (value: DateValue | undefined) => void;
    onOpenChange?: (open: boolean) => void;
    class?: string;
  }

  let {
    value = $bindable<DateValue | undefined>(undefined),
    placeholder = $bindable<DateValue | undefined>(undefined),
    open = $bindable(false),
    label,
    helperText,
    error = false,
    disabled = false,
    readonly = false,
    required = false,
    minValue,
    maxValue,
    locale = "en",
    onValueChange,
    onOpenChange,
    class: className = "",
  }: Props = $props();
</script>

<DatePicker.Root
  bind:value
  bind:placeholder
  bind:open
  {disabled}
  {readonly}
  {required}
  {minValue}
  {maxValue}
  {locale}
  onValueChange={(next) => {
    value = next;
    onValueChange?.(next);
  }}
  onOpenChange={(next) => {
    open = next;
    onOpenChange?.(next);
  }}
>
  <div class={cn("coim-date-field-wrap", error && "coim-error", className)}>
    {#if label}
      <DatePicker.Label class="coim-date-field-label">
        {label}{required ? " *" : ""}
      </DatePicker.Label>
    {/if}

    <DatePicker.Input class="coim-date-input">
      {#snippet children({ segments })}
        {#each segments as { part, value: segVal }, idx (`${idx}-${part}`)}
          {#if part === "literal"}
            <span class="text-text-secondary select-none">{segVal}</span>
          {:else}
            <DatePicker.Segment {part} class="coim-date-segment">
              {segVal}
            </DatePicker.Segment>
          {/if}
        {/each}
        <DatePicker.Trigger aria-label="Open calendar" class="coim-date-trigger">
          <CiCalendar size="small" />
        </DatePicker.Trigger>
      {/snippet}
    </DatePicker.Input>

    {#if helperText}
      <p class={cn("text-xs", error ? "text-error" : "text-text-secondary")}>
        {helperText}
      </p>
    {/if}
  </div>

  <DatePicker.Portal>
    <DatePicker.Content sideOffset={6} class="z-50 outline-none">
      <DatePicker.Calendar class="coim-calendar-card">
        {#snippet children({ months, weekdays })}
          <DatePicker.Header class="coim-calendar-header">
            <DatePicker.PrevButton aria-label="Previous month" class="coim-calendar-nav-btn">
              <CiChevronLeftSmall size="small" />
            </DatePicker.PrevButton>
            <DatePicker.Heading class="coim-calendar-heading" />
            <DatePicker.NextButton aria-label="Next month" class="coim-calendar-nav-btn">
              <CiChevronRightSmall size="small" />
            </DatePicker.NextButton>
          </DatePicker.Header>

          {#each months as month (month.value.toString())}
            <DatePicker.Grid class="coim-calendar-grid">
              <DatePicker.GridHead>
                <DatePicker.GridRow>
                  {#each weekdays as day, idx (idx)}
                    <DatePicker.HeadCell class="coim-calendar-head-cell">
                      {day.slice(0, 2)}
                    </DatePicker.HeadCell>
                  {/each}
                </DatePicker.GridRow>
              </DatePicker.GridHead>
              <DatePicker.GridBody>
                {#each month.weeks as weekDates, wi (wi)}
                  <DatePicker.GridRow>
                    {#each weekDates as date (date.toString())}
                      <DatePicker.Cell {date} month={month.value} class="coim-calendar-cell">
                        <DatePicker.Day class="coim-calendar-day" />
                      </DatePicker.Cell>
                    {/each}
                  </DatePicker.GridRow>
                {/each}
              </DatePicker.GridBody>
            </DatePicker.Grid>
          {/each}

          <div class="border-grey-100 mt-3 flex items-center justify-between border-t pt-2.5 text-xs">
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
                const nowDate = today(getLocalTimeZone());
                value = nowDate;
                placeholder = nowDate;
                onValueChange?.(nowDate);
                open = false;
              }}
            >
              Today
            </button>
          </div>
        {/snippet}
      </DatePicker.Calendar>
    </DatePicker.Content>
  </DatePicker.Portal>
</DatePicker.Root>
