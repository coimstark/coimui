<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimList,
    CoimListItemButton,
    CoimListItemText,
    CoimStack,
    CoimTextField,
    CoimTypography,
  } from "@coimui/svelte";
  import { goto } from "$app/navigation";

  let query = $state("");
  let kind = $state<"All" | "App" | "Component" | "Docs">("All");

  const catalog = [
    { title: "DataGrid Pivot Field Configurator", kind: "Component", summary: "Drag-and-drop & keyboard row/column pivot matrix", href: "/data-grid" },
    { title: "AI Chat Workspace", kind: "App", summary: "Conversations, extensions & provider settings", href: "/apps/ai-chat" },
    { title: "AI Content Studios", kind: "App", summary: "Image, Video, Upscale studios & Media Library", href: "/apps/ai-content/home" },
    { title: "Cloud Drive", kind: "App", summary: "Folders, uploads, shared items, spam & trash", href: "/apps/drive/home" },
    { title: "Ecommerce Storefront & Orders", kind: "Component", summary: "Catalog filters, product details, orders & invoices", href: "/pages/ecommerce/products-filters" },
    { title: "Theme & Styling Guide", kind: "Docs", summary: "Tokens, light/dark modes, 4 presets & RTL", href: "/docs/theme/styling" },
  ];

  const results = $derived.by(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((item) => {
      if (kind !== "All" && item.kind !== kind) return false;
      if (q && !item.title.toLowerCase().includes(q) && !item.summary.toLowerCase().includes(q)) return false;
      return true;
    });
  });
</script>

<svelte:head>
  <title>CoimUI Showcase — Search Results</title>
</svelte:head>

<CoimStack spacing={5}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Miscellaneous", href: "/pages/miscellaneous" }, { label: "Search" }]} />
    <CoimTypography variant="h1" class="mt-2">Workspace Search Index</CoimTypography>
  </div>

  <div class="flex flex-wrap items-end gap-3">
    <div class="min-w-64 flex-1">
      <CoimTextField label="Search workspace routes" placeholder="Try Pivot, Drive, Theme, Ecommerce..." bind:value={query} fullWidth />
    </div>
    <div class="flex gap-1.5">
      {#each (["All", "App", "Component", "Docs"] as const) as k (k)}
        <CoimButton size="small" variant={kind === k ? "contained" : "outlined"} onclick={() => (kind = k)}>
          {k}
        </CoimButton>
      {/each}
    </div>
  </div>

  <CoimCard>
    <CoimCardHeader title={`Results (${results.length})`} />
    <CoimCardContent>
      <CoimList>
        {#each results as item (item.href)}
          <CoimListItemButton onclick={() => void goto(item.href)}>
            <CoimListItemText primary={item.title} secondary={item.summary} />
            <CoimChip label={item.kind} size="small" variant="pastel" color="primary" />
          </CoimListItemButton>
        {/each}
      </CoimList>
    </CoimCardContent>
  </CoimCard>
</CoimStack>
