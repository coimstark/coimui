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
  CoimVersionSelect,
  LayoutState,
  type CoimNavItem,
} from "./index.js";
import { findActiveAccordionChain, findPrimaryNavItem, resolveLabel } from "./nav-utils.js";

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

  it("derives CoimVersionSelect default label from versions[0] when selectedVersion is omitted", async () => {
    const onSelectVersion = vi.fn();
    const onNavigate = vi.fn();

    const view = render(CoimVersionSelect, {
      props: {
        versions: [
          { label: "CoimUI v1.1.1", href: "/" },
          { label: "Components", href: "/components" },
        ],
        onSelectVersion,
        onNavigate,
      },
    });
    await tick();

    const trigger = view.getByRole("button", { name: "CoimUI v1.1.1" });
    expect(trigger).toBeInTheDocument();

    await fireEvent.click(trigger);
    await tick();
    await fireEvent.click(view.getByRole("menuitem", { name: "Components" }));
    await tick();

    expect(onSelectVersion).toHaveBeenCalledWith("Components");
    expect(onNavigate).toHaveBeenCalledWith("/components");
  });

  it("expands sibling and active groups freely in SingleLayer mode, syncs on route change, and fires onNavigate once", async () => {
    createMatchMediaController(true);
    localStorage.setItem("coim-test-nav-bug", MenuType.SingleLayer);

    const coimItems: CoimNavItem[] = [
      { id: "inbox", label: "Inbox", href: "/app/inbox", icon: "CiMessages" },
      {
        id: "crm",
        label: "Pelanggan & CRM",
        href: "/app/kontak",
        icon: "CiUsers",
        children: [
          { id: "kontak", label: "Kontak & Pelanggan", href: "/app/kontak" },
          { id: "prospek", label: "Papan Prospek", href: "/app/prospek" },
        ],
      },
      {
        id: "growth",
        label: "Siaran & Otomasi",
        href: "/app/siaran",
        icon: "CiAnnouncement",
        children: [
          { id: "siaran", label: "Siaran WhatsApp", href: "/app/siaran" },
          { id: "otomasi", label: "Otomasi & Asisten AI", href: "/app/otomasi" },
        ],
      },
      {
        id: "pengaturan",
        label: "Pengaturan",
        href: "/app/pengaturan/saluran",
        icon: "CiSettings",
        children: [
          { id: "saluran", label: "Saluran", href: "/app/pengaturan/saluran" },
          { id: "tagihan", label: "Tagihan & Paket", href: "/app/pengaturan/tagihan" },
        ],
      },
    ];

    const onNavigate = vi.fn();
    const view = render(CoimAppShell, {
      props: {
        items: coimItems,
        currentPath: "/app/kontak",
        menuStorageKey: "coim-test-nav-bug",
        persistMenu: true,
        onNavigate,
      },
    });
    await tick();

    const crmBtn = view.getByRole("button", { name: "Pelanggan & CRM" });
    const growthBtn = view.getByRole("button", { name: "Siaran & Otomasi" });
    const settingsBtn = view.getByRole("button", { name: "Pengaturan" });

    // Initial route /app/kontak opens Pelanggan & CRM cleanly
    expect(crmBtn).toHaveAttribute("aria-expanded", "true");
    expect(growthBtn).toHaveAttribute("aria-expanded", "false");
    expect(settingsBtn).toHaveAttribute("aria-expanded", "false");
    expect(view.getByRole("link", { name: "Kontak & Pelanggan" })).toHaveAttribute("aria-current", "page");

    // Click sibling Siaran & Otomasi while /app/kontak is active: must expand Siaran & Otomasi
    await fireEvent.click(growthBtn);
    await tick();
    expect(growthBtn).toHaveAttribute("aria-expanded", "true");
    expect(crmBtn).toHaveAttribute("aria-expanded", "false");
    expect(crmBtn.className).toContain("text-primary-fg!");
    expect(growthBtn.className).not.toContain("text-primary-fg!");
    expect(document.getElementById(growthBtn.getAttribute("aria-controls")!)).toHaveAttribute("data-state", "open");
    const crmPanel = document.getElementById(crmBtn.getAttribute("aria-controls")!);
    expect(crmPanel).toHaveAttribute("data-state", "closed");
    expect(crmPanel).toHaveAttribute("aria-hidden", "true");

    // Background items array identity refresh on same route must NOT wipe manually opened group
    await view.rerender({
      items: coimItems.map((i) => ({ ...i })),
      currentPath: "/app/kontak",
      menuStorageKey: "coim-test-nav-bug",
      persistMenu: true,
      onNavigate,
    });
    await tick();
    expect(growthBtn).toHaveAttribute("aria-expanded", "true");

    // Click sibling Pengaturan -> Pengaturan opens, Siaran & Otomasi closes
    await fireEvent.click(settingsBtn);
    await tick();
    expect(settingsBtn).toHaveAttribute("aria-expanded", "true");
    expect(growthBtn).toHaveAttribute("aria-expanded", "false");

    // Toggle active group open -> closed -> open
    await fireEvent.click(crmBtn);
    await tick();
    expect(crmBtn).toHaveAttribute("aria-expanded", "true");
    await fireEvent.click(crmBtn);
    await tick();
    expect(crmBtn).toHaveAttribute("aria-expanded", "false");
    await fireEvent.click(crmBtn);
    await tick();
    expect(crmBtn).toHaveAttribute("aria-expanded", "true");

    // Open Pengaturan and navigate to Tagihan & Paket -> onNavigate called ONCE, then sync route
    await fireEvent.click(settingsBtn);
    await tick();
    await fireEvent.click(view.getByRole("link", { name: "Tagihan & Paket" }));
    await tick();
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith("/app/pengaturan/tagihan");

    await view.rerender({
      items: coimItems,
      currentPath: "/app/pengaturan/tagihan",
      menuStorageKey: "coim-test-nav-bug",
      persistMenu: true,
      onNavigate,
    });
    await tick();
    expect(settingsBtn).toHaveAttribute("aria-expanded", "true");
    expect(crmBtn).toHaveAttribute("aria-expanded", "false");
    expect(view.getByRole("link", { name: "Tagihan & Paket" })).toHaveAttribute("aria-current", "page");

    // Navigate back to leaf route /app/inbox -> all accordions collapse cleanly
    await view.rerender({
      items: coimItems,
      currentPath: "/app/inbox",
      menuStorageKey: "coim-test-nav-bug",
      persistMenu: true,
      onNavigate,
    });
    await tick();
    expect(settingsBtn).toHaveAttribute("aria-expanded", "false");
    expect(crmBtn).toHaveAttribute("aria-expanded", "false");
    expect(view.getByRole("link", { name: "Inbox" })).toHaveAttribute("aria-current", "page");

    // Browser Back simulation back to /app/pengaturan/tagihan restores Pengaturan expanded
    await view.rerender({
      items: coimItems,
      currentPath: "/app/pengaturan/tagihan",
      menuStorageKey: "coim-test-nav-bug",
      persistMenu: true,
      onNavigate,
    });
    await tick();
    expect(settingsBtn).toHaveAttribute("aria-expanded", "true");
  });

  it("handles nested multi-level accordions and mobile SingleLayer drawer without premature collapse", async () => {
    const mm = createMatchMediaController(false);
    localStorage.setItem("coim-test-mobile-nav", MenuType.SingleLayer);

    const nestedItems: CoimNavItem[] = [
      {
        id: "pages",
        label: "Pages",
        children: [
          {
            id: "menu-levels",
            label: "Menu Levels",
            children: [
              { id: "level-2", label: "Level 2", href: "/menu-levels/level-two" },
              {
                id: "level-2-subs",
                label: "Level 2 Subs",
                children: [{ id: "level-3", label: "Level 3", href: "/menu-levels/level-two-subs/level-three" }],
              },
            ],
          },
        ],
      },
      {
        id: "settings",
        label: "Settings",
        children: [{ id: "billing", label: "Billing", href: "/settings/billing" }],
      },
    ];

    expect(findActiveAccordionChain(nestedItems, "/menu-levels/level-two-subs/level-three")).toEqual([
      { indent: 0, id: "pages" },
      { indent: 1, id: "menu-levels" },
      { indent: 2, id: "level-2-subs" },
    ]);

    const onNavigate = vi.fn();
    const view = render(CoimAppShell, {
      props: {
        items: nestedItems,
        currentPath: "/menu-levels/level-two-subs/level-three",
        menuStorageKey: "coim-test-mobile-nav",
        persistMenu: true,
        onNavigate,
      },
    });
    await tick();
    mm.emitAll(false);
    await tick();

    const mobileToggle = view.getByLabelText("Toggle navigation menu");
    await fireEvent.click(mobileToggle);
    await tick();
    expect(mobileToggle).toHaveAttribute("aria-expanded", "true");

    // Deep-linked nested chain is immediately expanded
    expect(view.getByRole("button", { name: "Pages" })).toHaveAttribute("aria-expanded", "true");
    expect(view.getByRole("button", { name: "Menu Levels" })).toHaveAttribute("aria-expanded", "true");
    expect(view.getByRole("button", { name: "Level 2 Subs" })).toHaveAttribute("aria-expanded", "true");

    // Expanding sibling group on mobile keeps mobile drawer open and allows navigation
    const settingsBtn = view.getByRole("button", { name: "Settings" });
    await fireEvent.click(settingsBtn);
    await tick();
    expect(settingsBtn).toHaveAttribute("aria-expanded", "true");
    expect(mobileToggle).toHaveAttribute("aria-expanded", "true");

    await fireEvent.click(view.getByRole("link", { name: "Billing" }));
    await tick();
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith("/settings/billing");
  });
});
