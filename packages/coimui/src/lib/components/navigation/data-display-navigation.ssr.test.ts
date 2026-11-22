import { describe, expect, it } from "vitest";
import { render } from "svelte/server";
import DataDisplayTestHost from "../../../tests/DataDisplayTestHost.svelte";
import NavigationTestHost from "../../../tests/NavigationTestHost.svelte";

describe("Data Display and Navigation SSR Safety", () => {
  it("renders all data-display and navigation components cleanly on server", () => {
    const dataDisplay = render(DataDisplayTestHost);
    expect(dataDisplay.body).toContain("data-testid=\"data-display-host\"");
    expect(dataDisplay.body).toContain("coim-timeline");
    expect(dataDisplay.body).toContain("coim-tree-view");
    expect(dataDisplay.body).toContain("coim-table-sort-button");

    const navigation = render(NavigationTestHost);
    expect(navigation.body).toContain("data-testid=\"navigation-host\"");
    expect(navigation.body).toContain("coim-breadcrumbs-ol");
    expect(navigation.body).toContain("coim-bottom-navigation");
    expect(navigation.body).toContain("coim-pagination");
    expect(navigation.body).toContain("coim-stepper");
    expect(navigation.body).toContain("coim-tabs-root");
    expect(navigation.body).toContain("coim-menubar");
    expect(navigation.body).toContain("role=\"toolbar\"");
  });
});
