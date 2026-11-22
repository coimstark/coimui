import { describe, expect, it } from "vitest";
import { render } from "svelte/server";
import { CoimThemeProvider, CiHome, CoimIcon, IllustrationLaunch } from "../index.js";

describe("Phase B SSR Safety", () => {
  it("renders CoimThemeProvider and icons on server without DOM globals", () => {
    const provider = render(CoimThemeProvider, {});
    expect(provider.body).toBeDefined();

    const home = render(CiHome, { props: { size: "large", variant: "outlined", label: "Home" } });
    expect(home.body).toContain("<svg");
    expect(home.body).toContain('aria-label="Home"');

    const dyn = render(CoimIcon, { props: { icon: "CiChartPie", size: "medium" } });
    expect(dyn.body).toContain("<svg");

    const illus = render(IllustrationLaunch, {});
    expect(illus.body).toContain("<svg");
  });
});
