import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CalendarDate, Time } from "@internationalized/date";
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { tick } from "svelte";
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
  formatDateWithDayjs,
  parseIsoDateValue,
  parseIsoTimeValue,
} from "./index.js";

describe("Date & Time Pickers Subpath", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });

  it("renders CoimCalendar, CoimRangeCalendar, and CoimStaticDatePicker with dayjs utilities", async () => {
    const initial = parseIsoDateValue("2026-04-15")!;
    expect(formatDateWithDayjs(initial, "YYYY-MM-DD")).toBe("2026-04-15");
    expect(parseIsoTimeValue("14:30")?.hour).toBe(14);

    const onStatic = vi.fn();
    const stat = render(CoimStaticDatePicker, {
      props: { value: initial, onValueChange: onStatic },
    });
    await tick();
    expect(stat.getByText(/Apr 15, 2026/)).toBeInTheDocument();
    await fireEvent.click(stat.getByRole("button", { name: "Clear" }));
    expect(onStatic).toHaveBeenCalledWith(undefined);
    stat.unmount();

    const cal = render(CoimCalendar, {
      props: { value: new CalendarDate(2026, 4, 15) },
    });
    expect(cal.getByRole("button", { name: "Previous" })).toBeInTheDocument();
    cal.unmount();

    const rangeCal = render(CoimRangeCalendar, {
      props: {
        value: {
          start: new CalendarDate(2026, 4, 10),
          end: new CalendarDate(2026, 4, 14),
        },
      },
    });
    expect(rangeCal.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("renders DateField, TimeField, DatePicker, DateRangePicker, TimePicker, and DateTimePicker", async () => {
    const df = render(CoimDateField, {
      props: { label: "Start date", value: new CalendarDate(2026, 4, 20) },
    });
    expect(df.getByText("Start date")).toBeInTheDocument();
    df.unmount();

    const tf = render(CoimTimeField, {
      props: { label: "Meeting time", value: new Time(10, 30) },
    });
    expect(tf.getByText("Meeting time")).toBeInTheDocument();
    tf.unmount();

    const dp = render(CoimDatePicker, {
      props: { label: "Due date" },
    });
    await fireEvent.click(dp.getByRole("button", { name: "Open calendar" }));
    await tick();
    expect(dp.getByRole("button", { name: "Today" })).toBeInTheDocument();
    dp.unmount();

    const drp = render(CoimDateRangePicker, {
      props: { label: "Reporting period" },
    });
    await fireEvent.click(drp.getByRole("button", { name: "Open date range calendar" }));
    await tick();
    expect(drp.getByRole("button", { name: "Last 7 Days" })).toBeInTheDocument();
    drp.unmount();

    const tp = render(CoimTimePicker, {
      props: { label: "Shift start", analogClock: true },
    });
    await fireEvent.click(tp.getByRole("button", { name: "Open time selector" }));
    await tick();
    expect(tp.getByRole("listbox", { name: "Hours" })).toBeInTheDocument();
    tp.unmount();

    const dtp = render(CoimDateTimePicker, {
      props: { label: "Launch window" },
    });
    expect(dtp.getByText("Launch window")).toBeInTheDocument();
  });
});
