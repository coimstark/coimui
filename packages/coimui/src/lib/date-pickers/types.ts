import type { CalendarDateTime, DateValue, Time } from "@internationalized/date";
import type { DateRange } from "bits-ui";

export interface CoimDateRangePreset {
  id: string;
  label: string;
  range: DateRange;
}

export interface CoimTimeRange {
  start: Time | undefined;
  end: Time | undefined;
}

export interface CoimDateTimeRange {
  start: CalendarDateTime | undefined;
  end: CalendarDateTime | undefined;
}

export type CoimDateGranularity = "day" | "hour" | "minute" | "second";

export type { CalendarDateTime, DateRange, DateValue, Time };
