<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimGrid,
    CoimStack,
    CoimTypography,
  } from "@coimui/svelte";

  const items = [
    { title: "Editorial Article", desc: "Long-form release & engineering article typography.", href: "/pages/miscellaneous/article" },
    { title: "Email Templates", desc: "Preview responsive notification emails with copyable HTML.", href: "/pages/miscellaneous/email-templates" },
    { title: "Knowledge Base", desc: "Categorized help center, video walkthrough, tips & tutorials.", href: "/pages/miscellaneous/knowledge-base" },
    { title: "Global Search Results", desc: "Interactive full-page search index filtering docs, SKUs & apps.", href: "/pages/miscellaneous/search" },
    { title: "Empty State", desc: "Clear onboarding illustration and call-to-action empty screen.", href: "/pages/miscellaneous/empty" },
    { title: "Empty State with Tabs", desc: "Tabbed workspace holding active vs empty collections.", href: "/pages/miscellaneous/empty-tabs" },
    { title: "FAQ", desc: "Collapsible accordion answers for architecture and theming.", href: "/pages/faq" },
    { title: "Pricing Plans", desc: "Annual vs monthly licensing calculator cards.", href: "/pages/pricing" },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Miscellaneous Pages</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Pages", href: "/pages" }, { label: "Miscellaneous" }]} />
    <CoimTypography variant="h1" class="mt-2">Miscellaneous Templates</CoimTypography>
    <p class="text-text-secondary mt-1 text-sm">
      Editorial layouts, knowledge base portals, email previews, full-page search, and empty states.
    </p>
  </div>

  <CoimGrid container spacing={4}>
    {#each items as item (item.href)}
      <CoimGrid size={{ xs: 12, sm: 6, lg: 3 }}>
        <CoimCard class="flex h-full flex-col justify-between">
          <div>
            <CoimCardHeader title={item.title} />
            <CoimCardContent>
              <p class="text-text-secondary text-sm">{item.desc}</p>
            </CoimCardContent>
          </div>
          <CoimCardActions>
            <CoimButton href={item.href} size="small" variant="outlined" fullWidth>Open Page</CoimButton>
          </CoimCardActions>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>
</CoimStack>
