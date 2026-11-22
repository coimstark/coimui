import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { tick } from "svelte";
import {
  CoimAreaChart,
  CoimBarChart,
  CoimFunnelChart,
  CoimGaugeChart,
  CoimHeatmapChart,
  CoimLineChart,
  CoimPieChart,
  CoimRadarChart,
  CoimScatterChart,
  CoimSparklineChart,
} from "./index.js";

const monthlyData = [
  { month: "Jan", revenue: 120, cost: 80 },
  { month: "Feb", revenue: 180, cost: 95 },
  { month: "Mar", revenue: 240, cost: 110 },
];

describe("Charts Subpath", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });

  it("renders Bar, Line, Area, Pie, and Scatter charts with interactive legend toggling", async () => {
    const bar = render(CoimBarChart, {
      props: {
        title: "Monthly Revenue",
        data: monthlyData,
        xKey: "month",
        series: [
          { key: "revenue", label: "Revenue" },
          { key: "cost", label: "Cost" },
        ],
      },
    });
    await tick();
    expect(bar.getByRole("img", { name: "Monthly Revenue" })).toBeInTheDocument();
    const revToggle = bar.getByRole("button", { name: "Revenue" });
    expect(revToggle).toHaveAttribute("aria-pressed", "true");
    await fireEvent.click(revToggle);
    expect(revToggle).toHaveAttribute("aria-pressed", "false");
    bar.unmount();

    const line = render(CoimLineChart, {
      props: { title: "Trend", data: monthlyData, xKey: "month", series: [{ key: "revenue" }] },
    });
    expect(line.container.querySelector("svg")).toBeInTheDocument();
    line.unmount();

    const area = render(CoimAreaChart, {
      props: { title: "Volume", data: monthlyData, xKey: "month", series: [{ key: "revenue" }] },
    });
    expect(area.container.querySelector("svg")).toBeInTheDocument();
    area.unmount();

    const pie = render(CoimPieChart, {
      props: {
        title: "Channels",
        donut: true,
        data: [
          { label: "Direct", value: 45 },
          { label: "Organic", value: 55 },
        ],
      },
    });
    expect(pie.getByText("Direct")).toBeInTheDocument();
    pie.unmount();

    const scatter = render(CoimScatterChart, {
      props: {
        title: "Distribution",
        data: [
          { x: 10, y: 20, series: "A" },
          { x: 30, y: 50, series: "A" },
        ],
      },
    });
    expect(scatter.container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders Sparkline, Gauge, Radar, Heatmap, and Funnel charts cleanly", () => {
    const spark = render(CoimSparklineChart, {
      props: { data: [4, 8, 6, 12, 9], variant: "area" },
    });
    expect(spark.container.querySelector("path")).toBeInTheDocument();
    spark.unmount();

    const gauge = render(CoimGaugeChart, {
      props: { value: 78, label: "Uptime" },
    });
    expect(gauge.getByText("78%")).toBeInTheDocument();
    gauge.unmount();

    const radar = render(CoimRadarChart, {
      props: {
        axes: ["Speed", "Quality", "Reliability", "Security"],
        series: [{ key: "core", label: "Core", values: [90, 85, 92, 88] }],
      },
    });
    expect(radar.getByText("Quality")).toBeInTheDocument();
    radar.unmount();

    const heatmap = render(CoimHeatmapChart, {
      props: {
        data: [
          { x: "Mon", y: "AM", value: 12 },
          { x: "Tue", y: "AM", value: 24 },
        ],
      },
    });
    expect(heatmap.container.querySelectorAll("rect")).toHaveLength(2);
    heatmap.unmount();

    const funnel = render(CoimFunnelChart, {
      props: {
        stages: [
          { label: "Visits", value: 1000 },
          { label: "Signups", value: 350 },
        ],
      },
    });
    expect(funnel.getByText(/Visits · 1,000/)).toBeInTheDocument();
  });
});
