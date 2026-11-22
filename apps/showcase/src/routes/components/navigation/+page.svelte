<script lang="ts">
  import {
    CoimBottomNavigation,
    CoimBottomNavigationAction,
    CoimBreadcrumbs,
    CoimButton,
    CoimGrid,
    CoimLink,
    CoimMenu,
    CoimMenuDivider,
    CoimMenuItem,
    CoimMenubar,
    CoimMobileStepper,
    CoimPagination,
    CoimSpeedDial,
    CoimSpeedDialAction,
    CoimStack,
    CoimStep,
    CoimStepContent,
    CoimStepLabel,
    CoimStepper,
    CoimTab,
    CoimTabPanel,
    CoimTabs,
    CoimToolbar,
    CoimTypography,
    toast,
    type CoimMenubarSection,
  } from "@coimui/svelte";
  import { CiBell, CiChartBar, CiPen, CiHome, CiPlus, CiUser } from "@coimui/svelte/icons";
  import ComponentDocCard from "#lib/components/ComponentDocCard.svelte";
  import { COMPONENT_CODE_EXAMPLES } from "#lib/examples/component-docs.ts";

  let activeTab = $state("overview");
  let menuOpen = $state(false);
  let page = $state(2);
  let activeStep = $state(0);
  let mobileStep = $state(1);
  let bottomNav = $state<string | number>("home");
  let dialOpen = $state(false);

  const menubarSections: CoimMenubarSection[] = [
    { value: "file", label: "File", items: fileItems },
    { value: "view", label: "View", items: viewItems },
  ];
</script>

{#snippet fileItems()}
  <CoimMenuItem label="New Workspace" hint="Ctrl+N" onSelect={() => toast.info("Created workspace")} />
  <CoimMenuDivider />
  <CoimMenuItem label="Export JSON" onSelect={() => toast.success("Exported configuration")} />
{/snippet}

{#snippet viewItems()}
  <CoimMenuItem label="Compact Mode" onSelect={() => toast.info("Compact mode selected")} />
  <CoimMenuItem label="Grid Lines" onSelect={() => toast.info("Grid lines toggled")} />
{/snippet}

<svelte:head>
  <title>CoimUI Showcase — Navigation</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Components", href: "/components" }, { label: "Navigation" }]} />
    <CoimTypography variant="h1" class="mt-2">Navigation</CoimTypography>
    <p class="text-text-secondary mt-1">
      Breadcrumbs, tabs, dropdown menus, desktop menubars, toolbars with roving focus, pagination, steppers, and bottom navigation.
    </p>
  </div>

  <CoimTypography variant="h2">Tabs, Menus, Pagination &amp; Steppers</CoimTypography>

  <ComponentDocCard
    title="Tabs, Menus, Menubar & Toolbar"
    description="ARIA-compliant keyboard-navigable tabs, popover dropdown menus, menubar, and roving-tabindex toolbars."
    code={COMPONENT_CODE_EXAMPLES.tabsAndMenus}
  >
    <CoimStack spacing={4}>
      <CoimTabs bind:value={activeTab} hairline>
        {#snippet tabs()}
          <CoimTab value="overview" label="Overview" />
          <CoimTab value="permissions" label="Permissions" />
          <CoimTab value="webhooks" label="Webhooks" />
        {/snippet}
        <CoimTabPanel value="overview">
          <p class="text-text-secondary text-sm">Overview configuration panel with automatic arrow-key selection.</p>
        </CoimTabPanel>
        <CoimTabPanel value="permissions">
          <p class="text-text-secondary text-sm">Role-scoped permissions matrix preview.</p>
        </CoimTabPanel>
        <CoimTabPanel value="webhooks">
          <p class="text-text-secondary text-sm">Signed event delivery endpoints.</p>
        </CoimTabPanel>
      </CoimTabs>

      <div class="flex flex-wrap items-center gap-4">
        <CoimMenu bind:open={menuOpen} label="Actions Menu">
          <CoimMenuItem label="Duplicate Record" onSelect={() => toast.info("Record duplicated")} />
          <CoimMenuDivider />
          <CoimMenuItem label="Archive" onSelect={() => toast.warning("Archived")} />
        </CoimMenu>

        <CoimMenubar menus={menubarSections} />

        <CoimLink href="/docs" underline="always">Read Documentation</CoimLink>
      </div>

      <CoimToolbar ariaLabel="Quick formatting bar" class="border-grey-200 rounded-lg border px-2 py-1">
        <CoimButton size="small" onclick={() => toast.info("Bold")}>Bold</CoimButton>
        <CoimButton size="small" onclick={() => toast.info("Italic")}>Italic</CoimButton>
        <CoimButton size="small" onclick={() => toast.info("Underline")}>Underline</CoimButton>
      </CoimToolbar>
    </CoimStack>
  </ComponentDocCard>

  <ComponentDocCard
    title="Breadcrumbs, Pagination, Steppers, Bottom Navigation & SpeedDial"
    description="Sequential workflow navigation, compact mobile pagination, and quick-action speed dial."
    code={COMPONENT_CODE_EXAMPLES.steppersAndPagination}
  >
    <CoimStack spacing={5}>
      <CoimBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Components", href: "/components" },
          { label: "Enterprise", href: "/components/navigation" },
          { label: "Steppers" },
        ]}
        maxItems={3}
      />

      <CoimPagination count={10} bind:page showFirstButton showLastButton />

      <CoimGrid container spacing={4}>
        <CoimGrid size={{ xs: 12, md: 6 }}>
          <CoimStepper bind:activeStep nonLinear>
            <CoimStep index={0}>
              <CoimStepLabel>Profile</CoimStepLabel>
              <CoimStepContent>Step 1: Verify workspace owner details.</CoimStepContent>
            </CoimStep>
            <CoimStep index={1}>
              <CoimStepLabel optional="Optional">Integrations</CoimStepLabel>
              <CoimStepContent>Step 2: Configure optional webhook targets.</CoimStepContent>
            </CoimStep>
            <CoimStep index={2}>
              <CoimStepLabel>Launch</CoimStepLabel>
              <CoimStepContent>Step 3: Review checklist and publish live.</CoimStepContent>
            </CoimStep>
          </CoimStepper>
        </CoimGrid>

        <CoimGrid size={{ xs: 12, md: 6 }}>
          <CoimStack spacing={4}>
            <CoimMobileStepper steps={4} bind:activeStep={mobileStep} variant="progress" />

            <CoimBottomNavigation bind:value={bottomNav} class="border-grey-200 rounded-xl border">
              <CoimBottomNavigationAction value="home" label="Home">
                {#snippet icon()}<CiHome size={18} />{/snippet}
              </CoimBottomNavigationAction>
              <CoimBottomNavigationAction value="metrics" label="Metrics">
                {#snippet icon()}<CiChartBar size={18} />{/snippet}
              </CoimBottomNavigationAction>
              <CoimBottomNavigationAction value="alerts" label="Alerts">
                {#snippet icon()}<CiBell size={18} />{/snippet}
              </CoimBottomNavigationAction>
              <CoimBottomNavigationAction value="profile" label="Profile">
                {#snippet icon()}<CiUser size={18} />{/snippet}
              </CoimBottomNavigationAction>
            </CoimBottomNavigation>

            <div class="relative flex h-24 items-end justify-end">
              <CoimSpeedDial bind:open={dialOpen} ariaLabel="Quick Navigation Actions" direction="left">
                <CoimSpeedDialAction tooltipTitle="New Record" onclick={() => toast.success("New record")}>
                  <CiPlus size={16} />
                </CoimSpeedDialAction>
                <CoimSpeedDialAction tooltipTitle="Quick Edit" onclick={() => toast.info("Quick edit")}>
                  <CiPen size={16} />
                </CoimSpeedDialAction>
              </CoimSpeedDial>
            </div>
          </CoimStack>
        </CoimGrid>
      </CoimGrid>
    </CoimStack>
  </ComponentDocCard>
</CoimStack>
