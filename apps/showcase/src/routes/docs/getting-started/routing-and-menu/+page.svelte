<script lang="ts">
  import {
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimStack,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTableRow,
  } from "@coimui/svelte";
  import { CoimCodeBlock } from "@coimui/svelte/plugins";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";

  const END_SCRIPT = "</" + "script>";

  const navConfigCode = `import type { CoimNavItem } from "@coimui/svelte";

export const navItems: CoimNavItem[] = [
  {
    id: "dashboards",
    label: "menu-dashboards",
    icon: "CiDashboard",
    href: "/",
    children: [
      { id: "analytics", label: "Analytics", description: "KPIs & cohorts", href: "/analytics", icon: "CiChartBar" },
    ],
  },
  {
    id: "components",
    label: "Components",
    icon: "CiController",
    href: "/components",
  },
];`;

  const shellWiringCode = `<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { CoimAppShell } from "@coimui/svelte";
  import { navItems } from "$lib/navigation";

  let { children } = $props();
${END_SCRIPT}

<CoimAppShell
  items={navItems}
  currentPath={page.url.pathname}
  onNavigate={(href) => void goto(href)}
>
  {@render children?.()}
</CoimAppShell>`;

  const navFields = [
    { name: "id", type: "string", description: "Unique stable item identifier used for active matching and accordion state." },
    { name: "label", type: "string", description: "Display text or i18n key resolved through the translate prop." },
    { name: "href", type: "string?", description: "Target route path matched against currentPath with isPathMatch." },
    { name: "icon / listIcon", type: "IconName?", description: "Icon for top-level sidebar rail or nested secondary list item." },
    { name: "children", type: "CoimNavItem[]?", description: "Nested secondary sidebar items or collapsible accordions." },
    { name: "isExternalLink", type: "boolean?", description: "Opens external URLs in a new tab with rel=\"noopener noreferrer\"." },
  ];
</script>

<svelte:head><title>CoimUI Docs — Routing &amp; Menu</title></svelte:head>

<DocsSubNav
  section="Getting Started"
  title="Routing &amp; Navigation Tree"
  subtitle="Configure multi-level CoimNavItem hierarchies and wire SvelteKit 3 goto() navigation into CoimAppShell."
>
  <CoimStack spacing={4}>
    <CoimCard>
      <CoimCardHeader title="1. Define CoimNavItem Hierarchy" />
      <CoimCardContent>
        <CoimCodeBlock language="typescript" filename="src/lib/navigation.ts" code={navConfigCode} />
      </CoimCardContent>
    </CoimCard>

    <CoimCard>
      <CoimCardHeader title="2. Connect CoimAppShell to SvelteKit Navigation" />
      <CoimCardContent>
        <CoimCodeBlock language="svelte" filename="src/lib/AppShell.svelte" code={shellWiringCode} />
      </CoimCardContent>
    </CoimCard>

    <CoimCard>
      <CoimCardHeader title="CoimNavItem Interface" />
      <CoimCardContent>
        <CoimTableContainer class="overflow-x-auto">
          <CoimTable size="small" aria-label="CoimNavItem properties">
            <CoimTableHead>
              <CoimTableRow>
                <CoimTableCell>Property</CoimTableCell>
                <CoimTableCell>Type</CoimTableCell>
                <CoimTableCell>Description</CoimTableCell>
              </CoimTableRow>
            </CoimTableHead>
            <CoimTableBody>
              {#each navFields as field (field.name)}
                <CoimTableRow>
                  <CoimTableCell class="whitespace-nowrap font-mono text-xs font-semibold">{field.name}</CoimTableCell>
                  <CoimTableCell class="font-mono text-xs">{field.type}</CoimTableCell>
                  <CoimTableCell class="text-sm">{field.description}</CoimTableCell>
                </CoimTableRow>
              {/each}
            </CoimTableBody>
          </CoimTable>
        </CoimTableContainer>
      </CoimCardContent>
    </CoimCard>
  </CoimStack>
</DocsSubNav>
