<script lang="ts">
  import { Calendar } from "bits-ui";
  import type { DateValue } from "@internationalized/date";
  import CiChevronLeftSmall from "../icons/ui/CiChevronLeftSmall.svelte";
  import CiChevronRightSmall from "../icons/ui/CiChevronRightSmall.svelte";
  import { cn } from "../utilities/utils.js";

  interface Props {
    value?: DateValue;
    placeholder?: DateValue;
    minValue?: DateValue;
    maxValue?: DateValue;
    disabled?: boolean;
    readonly?: boolean;
    fixedWeeks?: boolean;
    numberOfMonths?: number;
    locale?: string;
    isDateDisabled?: (date: DateValue) => boolean;
    isDateUnavailable?: (date: DateValue) => boolean;
    onValueChange?: (value: DateValue | undefined) => void;
    class?: string;
  }

  let {
    value = $bindable<DateValue | undefined>(undefined),
    placeholder = $bindable<DateValue | undefined>(undefined),
    minValue,
    maxValue,
    disabled = false,
    readonly = false,
    fixedWeeks = false,
    numberOfMonths = 1,
    locale = "en",
    isDateDisabled,
    isDateUnavailable,
    onValueChange,
    class: className = "",
  }: Props = $props();
</script>

<Calendar.Root
  type="single"
  bind:value
  bind:placeholder
  {minValue}
  {maxValue}
  {disabled}
  {readonly}
  {fixedWeeks}
  {numberOfMonths}
  {locale}
  {isDateDisabled}
  {isDateUnavailable}
  onValueChange={(next) => {
    value = next;
    onValueChange?.(next);
  }}
  class={cn("coim-calendar-card", className)}
>
  {#snippet children({ months, weekdays })}
    <Calendar.Header class="coim-calendar-header">
      <Calendar.PrevButton aria-label="Previous month" class="coim-calendar-nav-btn">
        <CiChevronLeftSmall size="small" />
      </Calendar.PrevButton>
      <Calendar.Heading class="coim-calendar-heading" />
      <Calendar.NextButton aria-label="Next month" class="coim-calendar-nav-btn">
        <CiChevronRightSmall size="small" />
      </Calendar.NextButton>
    </Calendar.Header>

    <div class="flex flex-col gap-4 sm:flex-row">
      {#each months as month (month.value.toString())}
        <Calendar.Grid class="coim-calendar-grid">
          <Calendar.GridHead>
            <Calendar.GridRow>
              {#each weekdays as day, idx (idx)}
                <Calendar.HeadCell class="coim-calendar-head-cell">
                  {day.slice(0, 2)}
                </Calendar.HeadCell>
              {/each}
            </Calendar.GridRow>
          </Calendar.GridHead>
          <Calendar.GridBody>
            {#each month.weeks as weekDates, wi (wi)}
              <Calendar.GridRow>
                {#each weekDates as date (date.toString())}
                  <Calendar.Cell {date} month={month.value} class="coim-calendar-cell">
                    <Calendar.Day class="coim-calendar-day" />
                  </Calendar.Cell>
                {/each}
              </Calendar.GridRow>
            {/each}
          </Calendar.GridBody>
        </Calendar.Grid>
      {/each}
    </div>
  {/snippet}
</Calendar.Root>
