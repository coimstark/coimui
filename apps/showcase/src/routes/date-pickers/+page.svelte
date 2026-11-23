<script lang="ts">
  import { CoimBreadcrumbs, CoimGrid, CoimStack, CoimTypography } from "@coimui/svelte";
  import {
    CalendarDate,
    CalendarDateTime,
    Time,
    CoimCalendar,
    CoimDateField,
    CoimDatePicker,
    CoimDateRangePicker,
    CoimDateTimePicker,
    CoimDateTimeRangePicker,
    CoimRangeCalendar,
    CoimStaticDatePicker,
    CoimTimeField,
    CoimTimePicker,
    CoimTimeRangePicker,
    formatDateWithDayjs,
    getPresetDateRanges,
    type CoimDateTimeRange,
    type CoimTimeRange,
    type DateRange,
    type DateValue,
  } from "@coimui/svelte/date-pickers";
  import ComponentDocCard from "#lib/components/ComponentDocCard.svelte";
  import { COMPONENT_CODE_EXAMPLES } from "#lib/examples/component-docs.ts";

  let singleDate = $state<DateValue | undefined>(new CalendarDate(2026, 11, 22));
  let rangeValue = $state<DateRange>({
    start: new CalendarDate(2026, 11, 18),
    end: new CalendarDate(2026, 11, 26),
  });
  let fieldDate = $state<DateValue | undefined>(new CalendarDate(2026, 11, 22));
  let fieldTime = $state<Time | undefined>(new Time(14, 30));
  let digitalTime = $state<Time | undefined>(new Time(9, 15));
  let analogTime = $state<Time | undefined>(new Time(16, 45));
  let dateTime = $state<CalendarDateTime | undefined>(new CalendarDateTime(2026, 11, 22, 10, 30));
  let timeRange = $state<CoimTimeRange>({ start: new Time(9, 0), end: new Time(17, 30) });
  let dateTimeRange = $state<CoimDateTimeRange>({
    start: new CalendarDateTime(2026, 11, 22, 9, 0),
    end: new CalendarDateTime(2026, 11, 24, 17, 0),
  });
  let staticDate = $state<DateValue | undefined>(new CalendarDate(2026, 11, 25));

  const presets = getPresetDateRanges();
</script>

<svelte:head>
  <title>CoimUI Showcase — Date & Time Pickers</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Date & Time Pickers" }]} />
    <CoimTypography variant="h1" class="mt-2">Date &amp; Time Pickers</CoimTypography>
    <p class="text-text-secondary mt-1">
      Timezone-safe ISO date/time primitives backed by @internationalized/date, Bits UI, and Day.js formatting.
    </p>
  </div>

  <CoimTypography variant="h2">Pickers, Fields &amp; Inline Calendars</CoimTypography>

  <ComponentDocCard
    title="DatePicker, DateRangePicker, TimePicker, TimeRangePicker, DateTimePicker & DateTimeRangePicker"
    description="Segmented keyboard fields paired with accessible popover calendars, range presets, clearable triggers, and digital/analog clocks."
    packageEntry="@coimui/svelte/date-pickers"
    code={COMPONENT_CODE_EXAMPLES.datePickers}
  >
    <CoimGrid container spacing={4}>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimDatePicker
          label="Single Date"
          bind:value={singleDate}
          clearable
          helperText={singleDate ? `Formatted: ${formatDateWithDayjs(singleDate, "MMM D, YYYY")}` : undefined}
        />
      </CoimGrid>

      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimDateRangePicker
          label="Reporting Window"
          bind:value={rangeValue}
          clearable
          {presets}
          showPresets
        />
      </CoimGrid>

      <CoimGrid size={{ xs: 12, sm: 6, md: 4 }}>
        <CoimDateField label="Segmented Date Field" bind:value={fieldDate} />
      </CoimGrid>

      <CoimGrid size={{ xs: 12, sm: 6, md: 4 }}>
        <CoimTimeField label="Segmented Time Field" bind:value={fieldTime} hourCycle={24} />
      </CoimGrid>

      <CoimGrid size={{ xs: 12, md: 4 }}>
        <CoimDateTimePicker label="Scheduled Deployment" bind:value={dateTime} clearable />
      </CoimGrid>

      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimTimePicker label="Digital Time Picker" bind:value={digitalTime} minuteStep={15} clearable />
      </CoimGrid>

      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimTimePicker label="Analog Clock Picker" bind:value={analogTime} analogClock clearable />
      </CoimGrid>

      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimTimeRangePicker label="Support Shift Hours" bind:value={timeRange} clearable />
      </CoimGrid>

      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimDateTimeRangePicker label="Maintenance Window" bind:value={dateTimeRange} clearable />
      </CoimGrid>
    </CoimGrid>
  </ComponentDocCard>

  <ComponentDocCard
    title="Inline Calendar, Range Calendar & Static DatePicker"
    description="Embedded calendar surfaces suitable for scheduling sidebars and reservation cards."
    packageEntry="@coimui/svelte/date-pickers"
    code={COMPONENT_CODE_EXAMPLES.datePickers}
  >
    <div class="flex flex-wrap items-start gap-6">
      <CoimCalendar bind:value={singleDate} />
      <CoimRangeCalendar bind:value={rangeValue} numberOfMonths={1} />
      <CoimStaticDatePicker title="Release Target" bind:value={staticDate} />
    </div>
  </ComponentDocCard>
</CoimStack>
