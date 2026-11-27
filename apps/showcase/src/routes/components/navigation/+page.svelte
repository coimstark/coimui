<script lang="ts">
  import {
    CoimBottomNavigation,
    CoimBottomNavigationAction,
    CoimBreadcrumbs,
    CoimButton,
    CoimFormControlLabel,
    CoimGrid,
    CoimLink,
    CoimMenu,
    CoimMenuDivider,
    CoimMenuItem,
    CoimMenubar,
    CoimMobileStepper,
    CoimPagination,
    CoimSelect,
    CoimSpeedDial,
    CoimSpeedDialAction,
    CoimStack,
    CoimStep,
    CoimStepContent,
    CoimStepLabel,
    CoimStepper,
    CoimSwitch,
    CoimTab,
    CoimTabPanel,
    CoimTabs,
    CoimToolbar,
    CoimTypography,
    toast,
    type CoimMenubarSection,
  } from "@coimui/svelte";
  import { CiBell, CiChartBar, CiHome, CiPen, CiPlus, CiUser } from "@coimui/svelte/icons";
  import ComponentDocCard from "#lib/components/ComponentDocCard.svelte";
  import type { ComponentApiGroup } from "#lib/components/doc-types.ts";

  const END_SCRIPT = "</" + "script>";

  let activeTab = $state("overview");
  let tabsVariant = $state<"standard" | "scrollable" | "fullWidth">("standard");
  let tabsHairline = $state(true);
  let menuOpen = $state(false);
  let page = $state(2);
  let pageShape = $state<"circular" | "rounded">("rounded");
  let pageVariant = $state<"text" | "outlined" | "surface">("outlined");
  let activeStep = $state(0);
  let mobileStep = $state(1);
  let bottomNav = $state<string | number>("home");
  let dialOpen = $state(false);
  let textFormats = $state({ bold: true, italic: false, underline: false });

  const menubarSections: CoimMenubarSection[] = [
    { value: "file", label: "File", items: fileItems },
    { value: "view", label: "View", items: viewItems },
  ];

  const tabsMenuCode = $derived(`<script lang="ts">
  import { CoimTabs, CoimTab, CoimTabPanel, CoimMenu, CoimMenuItem, CoimToolbar } from "@coimui/svelte";
  let value = $state("${activeTab}");
${END_SCRIPT}

<CoimTabs bind:value variant="${tabsVariant}"${tabsHairline ? " hairline" : ""}>
  {#snippet tabs()}
    <CoimTab value="overview" label="Overview" />
    <CoimTab value="permissions" label="Permissions" />
    <CoimTab value="webhooks" label="Webhooks" />
  {/snippet}
  <CoimTabPanel value="overview">Overview details</CoimTabPanel>
  <CoimTabPanel value="permissions">Permissions matrix</CoimTabPanel>
  <CoimTabPanel value="webhooks">Webhooks log</CoimTabPanel>
</CoimTabs>`);

  const steppersCode = $derived(`<script lang="ts">
  import { CoimPagination, CoimStepper, CoimStep, CoimStepLabel } from "@coimui/svelte";
  let page = $state(${page});
  let activeStep = $state(${activeStep});
${END_SCRIPT}

<CoimPagination count={10} bind:page variant="${pageVariant}" shape="${pageShape}" showFirstButton showLastButton />
<CoimStepper bind:activeStep nonLinear>
  <CoimStep index={0}><CoimStepLabel>Profile</CoimStepLabel></CoimStep>
  <CoimStep index={1}><CoimStepLabel optional="Optional">Integrations</CoimStepLabel></CoimStep>
  <CoimStep index={2}><CoimStepLabel>Launch</CoimStepLabel></CoimStep>
</CoimStepper>`);

  const tabsMenuApiGroups: ComponentApiGroup[] = [
    {
      title: "CoimTabs, CoimTab & CoimTabPanel",
      props: [
        { name: "value", type: "string", kind: "bindable", description: "Active tab value synchronized across triggers and panels." },
        { name: "variant / hairline / size", type: "\"standard\" | \"scrollable\" | \"fullWidth\" / boolean / \"tiny\" | \"small\" | \"medium\"", description: "Layout mode, bottom hairline border, and compact sizing." },
        { name: "tabs", type: "Snippet", kind: "snippet", description: "Slot receiving CoimTab elements (or pass declarative items array)." },
      ],
    },
    {
      title: "CoimMenu, CoimMenubar, CoimToolbar & CoimLink",
      props: [
        { name: "CoimMenu.open / label", type: "boolean / string", kind: "bindable", description: "Dropdown trigger and open state holding CoimMenuItem & CoimMenuDivider." },
        { name: "CoimMenubar.menus", type: "CoimMenubarSection[]", description: "Desktop menu bar sections with snippet-driven menus." },
        { name: "CoimToolbar", type: "orientation?, ariaLabel?", description: "Horizontal/vertical control group with arrow-key roving focus." },
        { name: "CoimLink.underline", type: "\"none\" | \"hover\" | \"always\"", defaultValue: "\"hover\"", description: "Anchor typography link with underline control." },
      ],
    },
  ];

  const steppersApiGroups: ComponentApiGroup[] = [
    {
      title: "CoimPagination & CoimBreadcrumbs & CoimStepper",
      props: [
        { name: "CoimPagination.count / page", type: "number / number", kind: "bindable", description: "Total pages and active page index with variant/shape/color props." },
        { name: "CoimStepper.activeStep / nonLinear", type: "number / boolean", kind: "bindable", description: "Zero-based active step index supporting optional horizontal/vertical layout." },
        { name: "CoimBreadcrumbs.items / maxItems", type: "BreadcrumbItem[] / number", description: "Collapses middle crumbs smoothly when exceeding maxItems." },
      ],
    },
    {
      title: "CoimMobileStepper, CoimBottomNavigation & CoimSpeedDial",
      props: [
        { name: "CoimMobileStepper", type: "steps, activeStep (bindable), variant?: \"text\" | \"dots\" | \"progress\"", kind: "bindable", description: "Compact mobile step progress indicator." },
        { name: "CoimBottomNavigation", type: "value (bindable), showLabels?", kind: "bindable", description: "Bottom navigation bar wrapping CoimBottomNavigationAction." },
        { name: "CoimSpeedDial", type: "open (bindable), direction?: \"up\" | \"down\" | \"left\" | \"right\"", kind: "bindable", description: "Expandable floating quick-action menu holding CoimSpeedDialAction items." },
      ],
    },
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
    id="coim-tabs"
    title="Tabs, Menus, Menubar &amp; Toolbar"
    description="ARIA-compliant keyboard-navigable tabs, popover dropdown menus, menubar, and roving-tabindex toolbars."
    code={tabsMenuCode}
    apiGroups={tabsMenuApiGroups}
  >
    <CoimStack spacing={4}>
      <CoimTabs bind:value={activeTab} variant={tabsVariant} hairline={tabsHairline}>
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
        <CoimButton
          size="small"
          variant={textFormats.bold ? "pastel" : "text"}
          aria-pressed={textFormats.bold}
          onclick={() => {
            textFormats = { ...textFormats, bold: !textFormats.bold };
            toast.info(`Bold ${textFormats.bold ? "on" : "off"}`);
          }}
        >
          Bold
        </CoimButton>
        <CoimButton
          size="small"
          variant={textFormats.italic ? "pastel" : "text"}
          aria-pressed={textFormats.italic}
          onclick={() => {
            textFormats = { ...textFormats, italic: !textFormats.italic };
            toast.info(`Italic ${textFormats.italic ? "on" : "off"}`);
          }}
        >
          Italic
        </CoimButton>
        <CoimButton
          size="small"
          variant={textFormats.underline ? "pastel" : "text"}
          aria-pressed={textFormats.underline}
          onclick={() => {
            textFormats = { ...textFormats, underline: !textFormats.underline };
            toast.info(`Underline ${textFormats.underline ? "on" : "off"}`);
          }}
        >
          Underline
        </CoimButton>
      </CoimToolbar>
    </CoimStack>

    {#snippet controls()}
      <div class="grid gap-3 sm:grid-cols-2 sm:items-center">
        <CoimSelect
          label="Tabs Variant"
          size="small"
          value={tabsVariant}
          onValueChange={(v) => {
            if (v === "standard" || v === "scrollable" || v === "fullWidth") tabsVariant = v;
          }}
          options={[
            { value: "standard", label: "standard" },
            { value: "scrollable", label: "scrollable" },
            { value: "fullWidth", label: "fullWidth" },
          ]}
          fullWidth
        />
        <CoimFormControlLabel label="Tabs Hairline Divider">
          <CoimSwitch bind:checked={tabsHairline} />
        </CoimFormControlLabel>
      </div>
    {/snippet}
  </ComponentDocCard>

  <ComponentDocCard
    id="coim-steppers"
    title="Breadcrumbs, Pagination, Steppers, Bottom Navigation &amp; SpeedDial"
    description="Sequential workflow navigation, compact mobile pagination, and quick-action speed dial."
    code={steppersCode}
    apiGroups={steppersApiGroups}
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

      <CoimPagination
        count={10}
        bind:page
        variant={pageVariant}
        shape={pageShape}
        showFirstButton
        showLastButton
      />

      <CoimGrid container spacing={4}>
        <CoimGrid size={{ xs: 12, md: 6 }}>
          <CoimStack spacing={3}>
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
            <div class="flex gap-2">
              <CoimButton size="small" variant="outlined" disabled={activeStep <= 0} onclick={() => (activeStep = Math.max(0, activeStep - 1))}>
                Previous Step
              </CoimButton>
              <CoimButton size="small" variant="contained" disabled={activeStep >= 2} onclick={() => (activeStep = Math.min(2, activeStep + 1))}>
                Next Step
              </CoimButton>
            </div>
          </CoimStack>
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

    {#snippet controls()}
      <div class="grid gap-3 sm:grid-cols-2">
        <CoimSelect
          label="Pagination Variant"
          size="small"
          value={pageVariant}
          onValueChange={(v) => {
            if (v === "text" || v === "outlined" || v === "surface") pageVariant = v;
          }}
          options={[
            { value: "text", label: "text" },
            { value: "outlined", label: "outlined" },
            { value: "surface", label: "surface" },
          ]}
          fullWidth
        />
        <CoimSelect
          label="Pagination Shape"
          size="small"
          value={pageShape}
          onValueChange={(v) => {
            if (v === "circular" || v === "rounded") pageShape = v;
          }}
          options={[
            { value: "rounded", label: "rounded" },
            { value: "circular", label: "circular" },
          ]}
          fullWidth
        />
      </div>
    {/snippet}
  </ComponentDocCard>
</CoimStack>
