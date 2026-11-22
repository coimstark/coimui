import {
  CalendarDate,
  Time,
  getLocalTimeZone,
  parseDate,
  parseTime,
  today,
  type DateValue,
} from "@internationalized/date";
import dayjs from "dayjs";
import type { DateRange } from "bits-ui";

export function parseIsoDateValue(iso: string | undefined): CalendarDate | undefined {
  if (!iso) return undefined;
  try {
    return parseDate(iso);
  } catch {
    return undefined;
  }
}

export function parseIsoTimeValue(iso: string | undefined): Time | undefined {
  if (!iso) return undefined;
  try {
    return parseTime(iso);
  } catch {
    return undefined;
  }
}

export function formatDateWithDayjs(
  value: DateValue | undefined,
  pattern = "MMM D, YYYY",
): string {
  if (!value) return "";
  const jsDate = value.toDate(getLocalTimeZone());
  return dayjs(jsDate).format(pattern);
}

export function getPresetDateRanges(): Array<{ id: string; label: string; range: DateRange }> {
  const end = today(getLocalTimeZone());
  return [
    {
      id: "today",
      label: "Today",
      range: { start: end, end },
    },
    {
      id: "last-7",
      label: "Last 7 Days",
      range: { start: end.subtract({ days: 6 }), end },
    },
    {
      id: "last-30",
      label: "Last 30 Days",
      range: { start: end.subtract({ days: 29 }), end },
    },
  ];
}
