<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimCardMedia,
    CoimCheckbox,
    CoimChip,
    CoimFormControlLabel,
    CoimGrid,
    CoimSlider,
    CoimStack,
    CoimTextField,
  } from "@coimui/svelte";
  import { ecommerceStore } from "#lib/pages/ecommerce.svelte.ts";
  import EcommerceShell from "#lib/pages/EcommerceShell.svelte";

  let query = $state("");
  let category = $state<"All" | "Hardware" | "Lighting" | "Workspace">("All");
  let maxPrice = $state(500);
  let onlyInStock = $state(false);

  const filtered = $derived.by(() => {
    const q = query.trim().toLowerCase();
    return ecommerceStore.products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (p.price > maxPrice) return false;
      if (onlyInStock && p.stock <= 0) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
      return true;
    });
  });
</script>

<svelte:head>
  <title>CoimUI Showcase — Ecommerce · Products With Filters</title>
</svelte:head>

<EcommerceShell title="Filterable Storefront" subtitle="Faceted sidebar filters by category, stock availability, and maximum price.">
  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, lg: 3 }}>
      <CoimCard>
        <CoimCardHeader title="Catalog Filters" />
        <CoimCardContent>
          <CoimStack spacing={3}>
            <CoimTextField label="Search SKUs" placeholder="Monitor, lamp, SKU..." bind:value={query} fullWidth />

            <div>
              <span class="text-text-secondary mb-1.5 block text-xs font-semibold">Category</span>
              <div class="flex flex-wrap gap-1.5">
                {#each (["All", "Hardware", "Lighting", "Workspace"] as const) as cat (cat)}
                  <CoimButton
                    size="tiny"
                    variant={category === cat ? "contained" : "outlined"}
                    onclick={() => (category = cat)}
                  >
                    {cat}
                  </CoimButton>
                {/each}
              </div>
            </div>

            <div>
              <span class="text-text-secondary mb-1.5 block text-xs font-semibold">
                Max Price (${maxPrice})
              </span>
              <CoimSlider aria-label="Maximum price" bind:value={maxPrice} min={50} max={500} step={10} />
            </div>

            <CoimFormControlLabel label="In stock only">
              <CoimCheckbox bind:checked={onlyInStock} />
            </CoimFormControlLabel>
          </CoimStack>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, lg: 9 }}>
      <CoimGrid container spacing={4}>
        {#each filtered as product (product.id)}
          <CoimGrid size={{ xs: 12, sm: 6, md: 4 }}>
            <CoimCard class="flex h-full flex-col justify-between overflow-hidden">
              <div>
                <CoimCardMedia component="img" image={product.image} alt={product.name} class="h-40 w-full object-cover" />
                <CoimCardHeader title={product.name} subheader={product.sku}>
                  {#snippet action()}
                    <CoimChip label={`$${product.price}`} color="primary" size="small" variant="pastel" />
                  {/snippet}
                </CoimCardHeader>
                <CoimCardContent>
                  <p class="text-text-secondary text-xs">Stock: {product.stock} · {product.category}</p>
                </CoimCardContent>
              </div>
              <CoimCardActions>
                <CoimButton
                  size="small"
                  variant="outlined"
                  fullWidth
                  onclick={() => {
                    ecommerceStore.selectProduct(product.id);
                    void goto("/pages/ecommerce/product-detail");
                  }}
                >
                  Open Detail
                </CoimButton>
              </CoimCardActions>
            </CoimCard>
          </CoimGrid>
        {/each}
      </CoimGrid>
    </CoimGrid>
  </CoimGrid>
</EcommerceShell>
