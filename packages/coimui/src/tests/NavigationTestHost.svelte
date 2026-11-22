<script lang="ts">
  import {
    CoimBottomNavigation,
    CoimBottomNavigationAction,
    CoimBreadcrumbs,
    CoimLink,
    CoimMenu,
    CoimMenuDivider,
    CoimMenuItem,
    CoimMenubar,
    CoimMobileStepper,
    CoimPagination,
    CoimSpeedDial,
    CoimSpeedDialAction,
    CoimStep,
    CoimStepContent,
    CoimStepLabel,
    CoimStepper,
    CoimTab,
    CoimTabPanel,
    CoimTabs,
    CoimToolbar,
    type CoimBreadcrumbItem,
    type CoimMenubarSection,
  } from "../lib/components/navigation/index.js";

  interface Props {
    onBottomNavChange?: (val: string | number) => void;
    onPaginationChange?: (page: number) => void;
    onSpeedAction?: () => void;
    onStepSelect?: (step: number) => void;
    onTabChange?: (tab: string) => void;
    onMenuSelect?: (action: string) => void;
  }

  let {
    onBottomNavChange,
    onPaginationChange,
    onSpeedAction,
    onStepSelect,
    onTabChange,
    onMenuSelect,
  }: Props = $props();

  let bottomValue = $state<string | number>("home");
  let page = $state(2);
  let dialOpen = $state(false);
  let activeStep = $state(0);
  let mobileStep = $state(1);
  let tabValue = $state("overview");
  let menuOpen = $state(false);

  const crumbs: CoimBreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Workspace", href: "/workspace" },
    { label: "Components", href: "/workspace/components" },
    { label: "Navigation", href: "/workspace/components/nav" },
    { label: "Current Page" },
  ];

  const menubarSections: CoimMenubarSection[] = [
    {
      value: "file",
      label: "File",
      items: fileMenuItems,
    },
    {
      value: "edit",
      label: "Edit",
      items: editMenuItems,
    },
  ];
</script>

{#snippet fileMenuItems()}
  <CoimMenuItem label="New File" hint="Ctrl+N" onSelect={() => onMenuSelect?.("new")} />
  <CoimMenuDivider />
  <CoimMenuItem label="Export" onSelect={() => onMenuSelect?.("export")} />
{/snippet}

{#snippet editMenuItems()}
  <CoimMenuItem label="Duplicate" onSelect={() => onMenuSelect?.("duplicate")} />
{/snippet}

<div data-testid="navigation-host">
  <CoimLink href="/docs" underline="always">Read Documentation</CoimLink>

  <CoimBreadcrumbs items={crumbs} maxItems={3} itemsBeforeCollapse={1} itemsAfterCollapse={1} />

  <CoimBottomNavigation
    bind:value={bottomValue}
    onValueChange={(next) => onBottomNavChange?.(next)}
  >
    <CoimBottomNavigationAction value="home" label="Home" />
    <CoimBottomNavigationAction value="orders" label="Orders" />
  </CoimBottomNavigation>

  <CoimPagination
    count={8}
    bind:page
    showFirstButton
    showLastButton
    onChange={(next) => onPaginationChange?.(next)}
  />

  <CoimSpeedDial bind:open={dialOpen} ariaLabel="Quick Actions">
    <CoimSpeedDialAction tooltipTitle="Create Project" onclick={onSpeedAction}>
      <span>+</span>
    </CoimSpeedDialAction>
  </CoimSpeedDial>

  <CoimStepper bind:activeStep nonLinear onStepChange={(step) => onStepSelect?.(step)}>
    <CoimStep index={0}>
      <CoimStepLabel>Account</CoimStepLabel>
      <CoimStepContent>Account details panel</CoimStepContent>
    </CoimStep>
    <CoimStep index={1}>
      <CoimStepLabel optional="Optional">Profile</CoimStepLabel>
      <CoimStepContent>Profile details panel</CoimStepContent>
    </CoimStep>
  </CoimStepper>

  <CoimMobileStepper steps={3} bind:activeStep={mobileStep} variant="dots" />

  <CoimTabs bind:value={tabValue} onValueChange={(next) => onTabChange?.(next)} hairline>
    {#snippet tabs()}
      <CoimTab value="overview" label="Overview" />
      <CoimTab value="security" label="Security" />
      <CoimTab value="audit" label="Audit" disabled />
    {/snippet}
    <CoimTabPanel value="overview">Overview Content</CoimTabPanel>
    <CoimTabPanel value="security">Security Content</CoimTabPanel>
    <CoimTabPanel value="audit">Audit Content</CoimTabPanel>
  </CoimTabs>

  <CoimMenu bind:open={menuOpen} label="Actions Menu">
    <CoimMenuItem label="Rename" onSelect={() => onMenuSelect?.("rename")} />
    <CoimMenuDivider />
    <CoimMenuItem label="Archive" disabled />
  </CoimMenu>

  <CoimMenubar menus={menubarSections} />

  <CoimToolbar ariaLabel="Formatting toolbar">
    <button type="button" tabindex={0}>Bold</button>
    <button type="button" tabindex={-1}>Italic</button>
    <button type="button" tabindex={-1}>Underline</button>
  </CoimToolbar>
</div>
