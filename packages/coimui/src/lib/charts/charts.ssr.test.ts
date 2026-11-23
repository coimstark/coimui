import { describe, expect, it } from "vitest";
import { render } from "svelte/server";
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

const sample = [
  { x: "Q1", a: 10, b: 20 },
  { x: "Q2", a: 30, b: 25 },
];

describe("Charts SSR Safety", () => {
  it("renders all 10 chart components cleanly on server", () => {
    expect(render(CoimBarChart, { props: { data: sample, xKey: "x", series: [{ key: "a" }] } }).body).toContain("<svg");
    expect(render(CoimLineChart, { props: { data: sample, xKey: "x", series: [{ key: "a" }] } }).body).toContain("<svg");
    expect(render(CoimAreaChart, { props: { data: sample, xKey: "x", series: [{ key: "a" }] } }).body).toContain("<svg");
    expect(render(CoimPieChart, { props: { data: [{ label: "A", value: 50 }] } }).body).toContain("<svg");
    expect(render(CoimScatterChart, { props: { data: [{ x: 1, y: 2 }] } }).body).toContain("<svg");
    expect(render(CoimSparklineChart, { props: { data: [1, 2, 3] } }).body).toContain("<svg");
    expect(render(CoimGaugeChart, { props: { value: 64 } }).body).toContain("64%");
    expect(render(CoimRadarChart, { props: { axes: ["A", "B", "C"], series: [{ key: "s", label: "S", values: [1, 2, 3] }] } }).body).toContain("<svg");
    expect(render(CoimHeatmapChart, { props: { data: [{ x: "1", y: "A", value: 5 }] } }).body).toContain("<svg");
    expect(render(CoimFunnelChart, { props: { stages: [{ label: "Top", value: 100 }] } }).body).toContain("Top");
    expect(render(CoimBarChart, { props: { data: [{ x: "Q1", min: 5, max: 20 }], xKey: "x", series: [{ key: "range", minKey: "min", maxKey: "max" }] } }).body).toContain("<svg");
    expect(render(CoimScatterChart, { props: { secondaryYAxis: true, data: [{ x: 1, y: 2, yAxis: "right" }] } }).body).toContain("<svg");
    expect(render(CoimGaugeChart, { props: { value: 64, showPointer: true } }).body).toContain("gauge-pointer");
    expect(render(CoimRadarChart, { props: { gridShape: "circular", axes: ["A", "B", "C"], series: [{ key: "s", label: "S", values: [1, 2, 3] }] } }).body).toContain("<circle");
    expect(render(CoimFunnelChart, { props: { curve: "smooth", stages: [{ label: "Top", value: 100 }, { label: "Bot", value: 40 }] } }).body).toContain("<path");
  });
});
