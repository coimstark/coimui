<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimCardMedia,
    CoimChip,
    CoimGrid,
    CoimRating,
  } from "@coimui/svelte";
  import { ecommerceStore } from "#lib/pages/ecommerce.svelte.ts";
  import EcommerceShell from "#lib/pages/EcommerceShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — Ecommerce · Product Cards</title>
</svelte:head>

<EcommerceShell title="Catalog Cards" subtitle="Merchandising card gallery with pricing badges and ratings.">
  <CoimGrid container spacing={4}>
    {#each ecommerceStore.products as item (item.id)}
      <CoimGrid size={{ xs: 12, sm: 6, lg: 3 }}>
        <CoimCard class="flex h-full flex-col justify-between overflow-hidden">
          <div>
            <CoimCardMedia component="img" image={item.image} alt={item.name} class="h-44 w-full object-cover" />
            <CoimCardHeader title={item.name} subheader={item.category}>
              {#snippet action()}
                <CoimChip label={`$${item.price}`} color="primary" size="small" variant="pastel" />
              {/snippet}
            </CoimCardHeader>
            <CoimCardContent>
              <CoimRating value={item.rating} readOnly precision={0.5} size="small" />
              <p class="text-text-secondary mt-2 text-xs">{item.summary}</p>
            </CoimCardContent>
          </div>
          <CoimCardActions>
            <CoimButton
              size="small"
              variant="contained"
              fullWidth
              onclick={() => {
                ecommerceStore.selectProduct(item.id);
                void goto("/pages/ecommerce/product-detail");
              }}
            >
              View Product
            </CoimButton>
          </CoimCardActions>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>
</EcommerceShell>
