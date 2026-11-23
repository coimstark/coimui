<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import { CoimBreadcrumbs, CoimButton, CoimStack, CoimTypography } from "@coimui/svelte";

  interface Props {
    title: string;
    subtitle: string;
    children?: Snippet;
  }

  let { title, subtitle, children }: Props = $props();

  const links = [
    { label: "Overview", href: "/pages/ecommerce" },
    { label: "Products Table", href: "/pages/ecommerce/products" },
    { label: "Product Cards", href: "/pages/ecommerce/products-cards" },
    { label: "Dense Catalog", href: "/pages/ecommerce/products-dense" },
    { label: "Filter Catalog", href: "/pages/ecommerce/products-filters" },
    { label: "Product Detail", href: "/pages/ecommerce/product-detail" },
    { label: "Orders", href: "/pages/ecommerce/orders" },
    { label: "Order Detail", href: "/pages/ecommerce/order-detail" },
    { label: "Invoice", href: "/pages/ecommerce/invoice" },
  ];

  const currentPath = $derived(page.url.pathname);
</script>

<CoimStack spacing={5}>
  <div>
    <CoimBreadcrumbs
      items={[
        { label: "Pages", href: "/pages" },
        { label: "Ecommerce", href: "/pages/ecommerce" },
        { label: title },
      ]}
    />
    <CoimTypography variant="h1" class="mt-2">{title}</CoimTypography>
    <p class="text-text-secondary mt-1 text-sm">{subtitle}</p>
  </div>

  <nav aria-label="Ecommerce pages" class="flex flex-wrap gap-2">
    {#each links as item (item.href)}
      <CoimButton
        href={item.href}
        size="small"
        variant={currentPath === item.href ? "contained" : "outlined"}
      >
        {item.label}
      </CoimButton>
    {/each}
  </nav>

  {@render children?.()}
</CoimStack>
