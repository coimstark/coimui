import { describe, expect, it } from "vitest";
import { render } from "svelte/server";
import { createRawSnippet } from "svelte";
import {
  CoimAppShell,
  CoimAuthLayout,
  CoimListingPageContent,
  type CoimNavItem,
} from "./index.js";

const menuItems: CoimNavItem[] = [
  {
    id: "dashboards",
    label: "Dashboards",
    icon: "CiChartPie",
    href: "/dashboards",
    children: [
      {
        id: "default",
        label: "Default",
        description: "Primary dashboard",
        icon: "CiHome",
        href: "/dashboards/default",
      },
    ],
  },
];

describe("Phase C Layouts SSR Safety", () => {
  it("renders CoimAppShell, CoimAuthLayout, and CoimListingPageContent cleanly on server", () => {
    const child = createRawSnippet(() => ({
      render: () => "<section><h1>Dashboard SSR</h1></section>",
    }));

    const shell = render(CoimAppShell, {
      props: {
        items: menuItems,
        currentPath: "/dashboards/default",
        children: child,
      },
    });

    expect(shell.body).toContain('href="#coim-main-content"');
    expect(shell.body).toContain("Dashboard SSR");
    expect(shell.body).toContain("<header");
    expect(shell.body).toContain("<nav");
    expect(shell.body).toContain("<main");
    expect(shell.body).toContain("<footer");
    expect(shell.body).toContain("<svg");

    const auth = render(CoimAuthLayout, {
      props: {
        currentPath: "/auth/sign-in",
        children: createRawSnippet(() => ({ render: () => "<div>Auth Form</div>" })),
      },
    });
    expect(auth.body).toContain("Auth Form");

    const listing = render(CoimListingPageContent, {
      props: {
        items: menuItems,
        currentPath: "/dashboards",
      },
    });
    expect(listing.body).toContain("Default");
  });
});
