import type { DateValue } from "@internationalized/date";
import type { DateRange } from "bits-ui";

export interface CoimDateRangePreset {
  id: string;
  label: string;
  range: DateRange;
}

export type CoimDateGranularity = "day" | "hour" | "minute" | "second";

export type { DateValue, DateRange };
