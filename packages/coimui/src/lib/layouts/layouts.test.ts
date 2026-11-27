import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/svelte";
import { createRawSnippet, tick } from "svelte";
import {
  CoimThemeProvider,
  ContentType,
  Elevation,
  MenuShowState,
  MenuType,
  THEME_OPTIONS,
  TopNavType,
} from "../theme/index.js";
import {
  CoimAppShell,
  CoimAuthLayout,
  CoimListingPageContent,
  LayoutState,
  type CoimNavItem,
} from "./index.js";
import { findPrimaryNavItem, resolveLabel } from "./nav-utils.js";

const sampleItems: CoimNavItem[] = [
  {
    id: "dashboards",
    label: "Dashboards",
    icon: "CiChartPie",
    href: "/dashboards",
    children: [
      {
        id: "default",
        label: "Default Dashboard",
        description: "Overview metrics and sales cards",
        icon: "CiHome",
        href: "/dashboards/default",
      },
      {
        id: "analytics",
        label: "Analytics Dashboard",
        description: "Traffic and conversion trends",
        icon: "CiChartBar",
        href: "/dashboards/analytics",
      },
    ],
  },
  {
    id: "users",
    label: "Users",
    icon: "CiUsers",
    href: "/users",
    children: [
      {
        id: "users-list",
        label: "Users List",
        description: "Manage members and roles",
        icon: "CiUser",
        href: "/users/list",
      },
    ],
  },
  {
    id: "single",
    label: "Single Page",
    icon: "CiStar",
    href: "/single",
  },
];

function createMatchMediaController(initialMatches = true) {
  let currentMatches = initialMatches;
  const listeners = new Map<string, Set<(e: MediaQueryListEvent) => void>>();

  const mock = vi.fn().mockImplementation((query: string) => ({
    get matches() {
      if (query.includes("prefers-color-scheme: dark")) return false;
      return currentMatches;
    },
    media: query,
    onchange: null,
    addEventListener: (_type: string, cb: (e: MediaQueryListEvent) => void) => {
      if (!listeners.has(query)) listeners.set(query, new Set());
      listeners.get(query)!.add(cb);
    },
    removeEventListener: (_type: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners.get(query)?.delete(cb);
    },
    dispatchEvent: () => true,
  }));

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: mock,
  });

  return {
    emitAll(matches: boolean) {
      currentMatches = matches;
      for (const [query, cbs] of listeners.entries()) {
        if (query.includes("prefers-color-scheme")) continue;
        for (const cb of cbs) {
          cb({ matches, media: query } as MediaQueryListEvent);
        }
      }
    },
  };
}

describe("LayoutState & CoimAppShell", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    document.documentElement.className = "";
    document.documentElement.removeAttribute("dir");
  });

  it("handles comfort, minimal, single-layer widths and breakpoint transitions", () => {
    const layout = new LayoutState({ persist: false });
    expect(layout.leftMenuType).toBe(MenuType.Comfort);
    expect(layout.leftMenuWidth).toEqual({ primary: 116, secondary: 260 });

    layout.setLeftMenuType(MenuType.Minimal);
    expect(layout.leftMenuWidth).toEqual({ primary: 60, secondary: 260 });

    layout.setLeftMenuType(MenuType.SingleLayer);
    expect(layout.leftMenuWidth).toEqual({ primary: 280, secondary: 0 });

    layout.setPrimaryBreakpointMatch(false);
    expect(layout.showLeftMobileButton).toBe(true);
    expect(layout.leftPrimaryCurrent).toBe(MenuShowState.Hide);
    expect(layout.leftMenuWidth).toEqual({ primary: 0, secondary: 0 });

    layout.showLeftInMobile();
    expect(layout.leftPrimaryCurrent).toBe(MenuShowState.TemporaryShow);
    expect(layout.leftShowBackdrop).toBe(true);

    layout.hideLeft();
    expect(layout.leftPrimaryCurrent).toBe(MenuShowState.Hide);
    expect(layout.leftShowBackdrop).toBe(false);
  });

  it("renders CoimAppShell, switches theme/layout options in configurator, and collapses cleanly on mobile", async () => {
    const mm = createMatchMediaController(true);
    const onNavigate = vi.fn();

    const childSnippet = createRawSnippet(() => ({
      render: () => `<div data-testid="shell-child">Dashboard body</div>`,
    }));

    const { getByLabelText, getByRole, getByTestId, container } = render(CoimAppShell, {
      props: {
        items: sampleItems,
        currentPath: "/dashboards/default",
        onNavigate,
        persistMenu: false,
        children: childSnippet,
      },
    });

    await tick();
    expect(getByTestId("shell-child")).toBeInTheDocument();

    const mainEl = container.querySelector("main#coim-main-content") as HTMLElement;
    expect(mainEl).toBeTruthy();
    expect(mainEl.style.paddingInlineStart).toBe("376px");

    // Open Theme Configuration drawer
    const configBtn = getByRole("button", { name: "Theme configuration" });
    await fireEvent.click(configBtn);
    await tick();

    const drawerDialog = getByRole("dialog", { name: "Configuration" });
    expect(drawerDialog).toHaveAttribute("open");

    // Switch menu type to minimal & single-layer
    await fireEvent.click(getByRole("button", { name: "Minimal" }));
    await tick();
    expect(mainEl.style.paddingInlineStart).toBe("320px");

    await fireEvent.click(getByRole("button", { name: "Single Layer" }));
    await tick();
    expect(mainEl.style.paddingInlineStart).toBe("280px");

    // Switch palette, topNav, content, elevation
    await fireEvent.click(getByRole("button", { name: "Blue" }));
    await fireEvent.click(getByRole("button", { name: "Full Width" }));
    await fireEvent.click(getByRole("button", { name: "Fluid" }));
    await fireEvent.click(getByRole("button", { name: "Flat" }));
    await tick();

    expect(document.documentElement.classList.contains(THEME_OPTIONS.BLUE)).toBe(true);
    expect(document.documentElement.classList.contains(Elevation.Flat)).toBe(true);

    // Full top-nav moves header outside main
    expect(mainEl.querySelector("header")).toBeNull();
    expect(container.querySelector("header")).toBeTruthy();

    // Reset back to defaults
    await fireEvent.click(getByRole("button", { name: "Reset Defaults" }));
    await tick();
    expect(document.documentElement.classList.contains(THEME_OPTIONS.PURPLE)).toBe(true);
    expect(mainEl.style.paddingInlineStart).toBe("376px");

    // Collapse to mobile breakpoint
    mm.emitAll(false);
    await tick();
    expect(mainEl.style.paddingInlineStart).toBe("0px");
    const mobileToggle = getByLabelText("Toggle navigation menu");
    expect(mobileToggle.className).toContain("flex");

    await fireEvent.click(mobileToggle);
    await tick();
    expect(mobileToggle).toHaveAttribute("aria-expanded", "true");
  });

  it("opens search dialog, filters results, and updates notification unread count", async () => {
    createMatchMediaController(true);

    const { getByLabelText, getByPlaceholderText, queryByText } = render(CoimAppShell, {
      props: {
        items: sampleItems,
        currentPath: "/dashboards/default",
        persistMenu: false,
      },
    });
    await tick();

    // Search dialog filter
    await fireEvent.click(getByLabelText("Open search"));
    await tick();
    const searchInput = getByPlaceholderText("Search");
    await fireEvent.input(searchInput, { target: { value: "Data Grid" } });
    await tick();
    expect(queryByText("Data Grid Engine")).toBeTruthy();
    expect(queryByText("Charts Gallery")).toBeNull();

    // Notifications badge disappears on open & close
    const badge = getByLabelText("2 unread notifications");
    expect(badge).toHaveTextContent("2");
    await fireEvent.click(getByLabelText("Notifications"));
    await tick();
    await fireEvent.click(getByLabelText("Notifications"));
    await tick();
    expect(document.body.querySelector('[aria-label$="unread notifications"]')).toBeNull();
  });

  it("renders CoimListingPageContent & filters nested menu items and renders CoimAuthLayout", async () => {
    const onNavigate = vi.fn();
    const { container: listContainer, getByPlaceholderText, queryByText } = render(CoimListingPageContent, {
      props: {
        items: sampleItems,
        currentPath: "/dashboards",
        onNavigate,
      },
    });

    const cardLinks = listContainer.querySelectorAll("a");
    expect(cardLinks.length).toBe(2);
    expect(cardLinks[0]?.innerHTML).toContain("bg-primary-light/10");
    expect(cardLinks[1]?.innerHTML).toContain("bg-secondary-light/10");
    expect(queryByText("Default Dashboard")).toBeTruthy();
    expect(queryByText("Analytics Dashboard")).toBeTruthy();

    await fireEvent.input(getByPlaceholderText("Filter..."), {
      target: { value: "Analytics" },
    });
    await tick();
    expect(queryByText("Default Dashboard")).toBeNull();
    expect(queryByText("Analytics Dashboard")).toBeTruthy();

    const scrollSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const authChild = createRawSnippet(() => ({
      render: () => `<div data-testid="auth-child">Sign In</div>`,
    }));
    const authView = render(CoimAuthLayout, {
      props: {
        currentPath: "/auth/sign-in",
        children: authChild,
      },
    });
    await tick();
    expect(authView.getByTestId("auth-child")).toBeInTheDocument();
    expect(scrollSpy).toHaveBeenCalledWith(0, 0);
    scrollSpy.mockRestore();
  });

  it("respects outer CoimThemeProvider context overrides when wrapped", async () => {
    createMatchMediaController(true);
    const wrapped = render(CoimThemeProvider, {
      props: {
        persist: false,
        defaults: {
          themeColor: THEME_OPTIONS.GREEN,
          elevation: Elevation.Flat,
          contentType: ContentType.Fluid,
          topNavType: TopNavType.Full,
        },
        children: createRawSnippet(() => ({
          render: () => "<span>Themed child</span>",
        })),
      },
    });
    await tick();
    expect(wrapped.getByText("Themed child")).toBeInTheDocument();
    expect(document.documentElement.classList.contains(THEME_OPTIONS.GREEN)).toBe(true);
    expect(document.documentElement.classList.contains(Elevation.Flat)).toBe(true);
  });

  it("resolves nested primary nav owners and built-in label fallbacks", () => {
    const itemsWithRoot: CoimNavItem[] = [
      {
        id: "overview",
        label: "Overview",
        href: "/",
        children: [{ id: "projects", label: "Projects", href: "/projects" }],
      },
      ...sampleItems,
    ];

    expect(findPrimaryNavItem(itemsWithRoot, [], "/")?.id).toBe("overview");
    expect(findPrimaryNavItem(itemsWithRoot, [], "/projects")?.id).toBe("overview");
    expect(findPrimaryNavItem(itemsWithRoot, [], "/dashboards/analytics")?.id).toBe("dashboards");
    expect(findPrimaryNavItem(itemsWithRoot, [], "/users/list")?.id).toBe("users");

    expect(resolveLabel(undefined, "menu-minimal")).toBe("Minimal");
    expect(resolveLabel((k) => k, "reset-theme")).toBe("Reset Defaults");
    expect(resolveLabel((k) => (k === "menu-minimal" ? "Kompakt" : k), "menu-minimal")).toBe("Kompakt");
  });

  it("supports custom logoSlot, SingleLayer ctaSlot, fullHeight flush mode, hidden theme config, and keepUserProfileOnAccountSwitch", async () => {
    createMatchMediaController(true);
    const onAccountSwitch = vi.fn();
    localStorage.setItem("coim-test-sl-menu", MenuType.SingleLayer);

    const logoSnippet = createRawSnippet((params: () => { compact: boolean }) => ({
      render: () => `<span data-testid="custom-logo" data-compact="${params().compact}">CustomBrand</span>`,
    }));
    const ctaSnippet = createRawSnippet(() => ({
      render: () => `<div data-testid="sidebar-cta">Quota Box</div>`,
    }));
    const bodySnippet = createRawSnippet(() => ({
      render: () => `<div data-testid="flush-body">Inbox</div>`,
    }));

    const view = render(CoimAppShell, {
      props: {
        items: sampleItems,
        currentPath: "/dashboards/default",
        menuStorageKey: "coim-test-sl-menu",
        persistMenu: true,
        showThemeConfiguration: false,
        showFooter: false,
        fullHeight: true,
        disableContentWrapper: true,
        keepUserProfileOnAccountSwitch: true,
        activeAccountId: "ws-2",
        user: { name: "Sari Dewi", email: "sari@tokokita.id" },
        accounts: [
          { id: "ws-1", name: "Toko Pusat", email: "Paket Gratis" },
          { id: "ws-2", name: "Cabang Bandung", email: "Paket Starter" },
        ],
        onAccountSwitch,
        logoSlot: logoSnippet,
        ctaSlot: ctaSnippet,
        children: bodySnippet,
      },
    });
    await tick();

    expect(view.getByTestId("custom-logo")).toHaveTextContent("CustomBrand");
    expect(view.getByTestId("sidebar-cta")).toBeInTheDocument();
    expect(view.queryByRole("button", { name: "Theme configuration" })).toBeNull();
    expect(view.container.querySelector("footer")).toBeNull();
    expect(view.container.querySelector("main#coim-main-content .h-\\[calc\\(100dvh-4rem\\)\\]")).toBeTruthy();

    // Initials avatar fallback renders even without avatar URL
    const userTrigger = view.getByLabelText("Open user menu for Sari Dewi");
    expect(userTrigger.textContent).toContain("SD");

    await fireEvent.click(userTrigger);
    await tick();
    await fireEvent.click(view.getByText("Switch Account"));
    await tick();
    await fireEvent.click(view.getByText("Toko Pusat"));
    await tick();

    expect(onAccountSwitch).toHaveBeenCalledWith(expect.objectContaining({ id: "ws-1" }));
    // keepUserProfileOnAccountSwitch preserves the user's name in header trigger
    expect(view.getByLabelText("Open user menu for Sari Dewi")).toBeInTheDocument();
  });
});
