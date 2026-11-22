import { describe, expect, it } from "vitest";
import { render } from "@testing-library/svelte";
import {
  CoimIcon,
  IconMap,
  CiHome,
  CheckboxSmallChecked,
  RadiobuttonSmallChecked,
  IllustrationLaunch,
} from "./index.js";

describe("CoimUI Icon System", () => {
  it("exports all 469 UI icons in IconMap", () => {
    expect(Object.keys(IconMap).length).toBe(469);
  });

  it("renders individual UI icons with outlined/contained variants, sizes, and a11y attributes", async () => {
    const { container, rerender } = render(CiHome, {
      props: { variant: "outlined", size: "large" },
    });
    let svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute("width")).toBe("24");
    expect(svg?.getAttribute("height")).toBe("24");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("role")).toBeNull();

    await rerender({ variant: "contained", size: "small", label: "Home" });
    svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("16");
    expect(svg?.getAttribute("role")).toBe("img");
    expect(svg?.getAttribute("aria-label")).toBe("Home");
    expect(svg?.getAttribute("aria-hidden")).toBeNull();
  });

  it("renders dynamic CoimIcon, form icons, and illustrations", () => {
    const dyn = render(CoimIcon, { props: { icon: "CiChartPie", size: 20 } });
    expect(dyn.container.querySelector("svg")?.getAttribute("width")).toBe("20");

    const cb = render(CheckboxSmallChecked, {});
    expect(cb.container.querySelector("svg")).toHaveClass("contained");

    const rb = render(RadiobuttonSmallChecked, {});
    expect(rb.container.querySelector("svg")).toHaveClass("contained");

    const ill = render(IllustrationLaunch, { props: { class: "w-45 h-45" } });
    expect(ill.container.querySelector("svg")).toHaveClass("w-45");
  });
});
