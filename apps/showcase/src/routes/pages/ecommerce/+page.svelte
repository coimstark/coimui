<script lang="ts">
  import {
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimGrid,
  } from "@coimui/svelte";
  import { ecommerceStore } from "#lib/pages/ecommerce.svelte.ts";
  import EcommerceShell from "#lib/pages/EcommerceShell.svelte";

  const links = [
    { title: "Products Table", desc: "Full catalog grid with sorting, pricing edits & CSV export.", href: "/pages/ecommerce/products" },
    { title: "Product Cards", desc: "Visual card merchandising grid with ratings & quick detail navigation.", href: "/pages/ecommerce/products-cards" },
    { title: "Dense Catalog", desc: "High-density compact tabular catalog for SKU buyers.", href: "/pages/ecommerce/products-dense" },
    { title: "Filtered Storefront", desc: "Sidebar category, stock status & price ceiling filters.", href: "/pages/ecommerce/products-filters" },
    { title: "Product Detail", desc: "Media gallery, specs, sales sparkline & interactive customer review composer.", href: "/pages/ecommerce/product-detail" },
    { title: "Orders Directory", desc: "Fulfillment tracking & direct invoice / detail drilldown.", href: "/pages/ecommerce/orders" },
    { title: "Order Detail", desc: "Addresses, timeline activity, line items & live status transition.", href: "/pages/ecommerce/order-detail" },
    { title: "Printable Invoice", desc: "Formatted billing invoice supporting DOM print preview.", href: "/pages/ecommerce/invoice" },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Ecommerce</title>
</svelte:head>

<EcommerceShell
  title="Ecommerce Suite"
  subtitle={`${ecommerceStore.products.length} catalog SKUs · ${ecommerceStore.orders.length} active customer orders.`}
>
  <CoimGrid container spacing={4}>
    {#each links as card (card.href)}
      <CoimGrid size={{ xs: 12, sm: 6, lg: 3 }}>
        <CoimCard class="flex h-full flex-col justify-between">
          <div>
            <CoimCardHeader title={card.title} />
            <CoimCardContent>
              <p class="text-text-secondary text-sm">{card.desc}</p>
            </CoimCardContent>
          </div>
          <CoimCardActions>
            <CoimButton href={card.href} size="small" variant="contained" fullWidth>Open Page</CoimButton>
          </CoimCardActions>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>
</EcommerceShell>
