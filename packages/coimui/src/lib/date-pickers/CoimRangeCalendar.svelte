<script lang="ts">
  import { RangeCalendar, type DateRange } from "bits-ui";
  import type { DateValue } from "@internationalized/date";
  import CiChevronLeftSmall from "../icons/ui/CiChevronLeftSmall.svelte";
  import CiChevronRightSmall from "../icons/ui/CiChevronRightSmall.svelte";
  import { cn } from "../utilities/utils.js";

  interface Props {
    value?: DateRange;
    placeholder?: DateValue;
    minValue?: DateValue;
    maxValue?: DateValue;
    disabled?: boolean;
    readonly?: boolean;
    numberOfMonths?: number;
    locale?: string;
    onValueChange?: (value: DateRange) => void;
    class?: string;
  }

  let {
    value = $bindable<DateRange>({ start: undefined, end: undefined }),
    placeholder = $bindable<DateValue | undefined>(undefined),
    minValue,
    maxValue,
    disabled = false,
    readonly = false,
    numberOfMonths = 1,
    locale = "en",
    onValueChange,
    class: className = "",
  }: Props = $props();
</script>

<RangeCalendar.Root
  bind:value
  bind:placeholder
  {minValue}
  {maxValue}
  {disabled}
  {readonly}
  {numberOfMonths}
  {locale}
  onValueChange={(next) => {
    value = next;
    onValueChange?.(next);
  }}
  class={cn("coim-calendar-card", className)}
>
  {#snippet children({ months, weekdays })}
    <RangeCalendar.Header class="coim-calendar-header">
      <RangeCalendar.PrevButton aria-label="Previous month" class="coim-calendar-nav-btn">
        <CiChevronLeftSmall size="small" />
      </RangeCalendar.PrevButton>
      <RangeCalendar.Heading class="coim-calendar-heading" />
      <RangeCalendar.NextButton aria-label="Next month" class="coim-calendar-nav-btn">
        <CiChevronRightSmall size="small" />
      </RangeCalendar.NextButton>
    </RangeCalendar.Header>

    <div class="flex flex-col gap-4 sm:flex-row">
      {#each months as month (month.value.toString())}
        <RangeCalendar.Grid class="coim-calendar-grid">
          <RangeCalendar.GridHead>
            <RangeCalendar.GridRow>
              {#each weekdays as day, idx (idx)}
                <RangeCalendar.HeadCell class="coim-calendar-head-cell">
                  {day.slice(0, 2)}
                </RangeCalendar.HeadCell>
              {/each}
            </RangeCalendar.GridRow>
          </RangeCalendar.GridHead>
          <RangeCalendar.GridBody>
            {#each month.weeks as weekDates, wi (wi)}
              <RangeCalendar.GridRow>
                {#each weekDates as date (date.toString())}
                  <RangeCalendar.Cell {date} month={month.value} class="coim-calendar-cell">
                    <RangeCalendar.Day class="coim-calendar-day" />
                  </RangeCalendar.Cell>
                {/each}
              </RangeCalendar.GridRow>
            {/each}
          </RangeCalendar.GridBody>
        </RangeCalendar.Grid>
      {/each}
    </div>
  {/snippet}
</RangeCalendar.Root>
