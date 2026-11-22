import { describe, expect, it } from "vitest";
import { CalendarDate, CalendarDateTime, Time } from "@internationalized/date";
import { render } from "svelte/server";
import {
  CoimCalendar,
  CoimDateField,
  CoimDatePicker,
  CoimDateRangePicker,
  CoimDateTimePicker,
  CoimRangeCalendar,
  CoimStaticDatePicker,
  CoimTimeField,
  CoimTimePicker,
} from "./index.js";

describe("Date Pickers SSR Safety", () => {
  it("renders all date & time pickers cleanly on server", () => {
    const d = new CalendarDate(2026, 4, 15);
    const t = new Time(9, 30);
    const dt = new CalendarDateTime(2026, 4, 15, 9, 30);

    expect(render(CoimCalendar, { props: { value: d } }).body).toContain("coim-calendar-card");
    expect(render(CoimRangeCalendar, { props: { value: { start: d, end: d } } }).body).toContain("coim-calendar-card");
    expect(render(CoimDateField, { props: { label: "Date", value: d } }).body).toContain("coim-date-input");
    expect(render(CoimTimeField, { props: { label: "Time", value: t } }).body).toContain("coim-date-input");
    expect(render(CoimDatePicker, { props: { label: "Picker", value: d } }).body).toContain("Open calendar");
    expect(render(CoimDateRangePicker, { props: { label: "Range", value: { start: d, end: d } } }).body).toContain("Open date range calendar");
    expect(render(CoimTimePicker, { props: { label: "Clock", value: t } }).body).toContain("Open time selector");
    expect(render(CoimDateTimePicker, { props: { label: "DateTime", value: dt } }).body).toContain("Open date and time picker");
    expect(render(CoimStaticDatePicker, { props: { value: d } }).body).toContain("Apr 15, 2026");
  });
});
