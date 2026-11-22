<script lang="ts">
  import { goto } from "$app/navigation";
  import { CoimListingPageContent, CoimStack, CoimTypography } from "@coimui/svelte";
  import { showcaseI18n } from "#lib/i18n.svelte.ts";
  import { showcaseNavItems } from "#lib/navigation.ts";
</script>

<svelte:head>
  <title>CoimUI Showcase — Component Catalog</title>
</svelte:head>

<CoimStack spacing={5}>
  <CoimTypography variant="h1">UI Component Catalog</CoimTypography>
  <CoimListingPageContent
    items={showcaseNavItems}
    currentPath="/components"
    translate={showcaseI18n.t}
    onNavigate={(href) => {
      void goto(href);
    }}
  />
</CoimStack>
