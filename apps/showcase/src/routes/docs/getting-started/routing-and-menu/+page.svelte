<script lang="ts">
  import { CoimCard, CoimCardContent, CoimCardHeader } from "@coimui/svelte";
  import { CoimCodeBlock } from "@coimui/svelte/plugins";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";
</script>

<svelte:head><title>CoimUI Docs — Routing &amp; Menu</title></svelte:head>

<DocsSubNav section="Getting Started" title="Routing &amp; Navigation Tree" subtitle="Defining multi-level CoimNavItem hierarchies with i18next label keys.">
  <CoimCard>
    <CoimCardHeader title="CoimNavItem Configuration" />
    <CoimCardContent>
      <CoimCodeBlock
        language="typescript"
        filename="navigation.ts"
        code={`const navItems: CoimNavItem[] = [\n  {\n    id: "dashboards",\n    label: "menu-dashboards",\n    icon: "CiDashboard",\n    href: "/",\n    children: [{ id: "analytics", label: "menu-dashboard-analytics", href: "/dashboards/analytics" }],\n  },\n];`}
      />
    </CoimCardContent>
  </CoimCard>
</DocsSubNav>
