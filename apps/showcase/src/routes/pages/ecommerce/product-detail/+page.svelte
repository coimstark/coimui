<script lang="ts">
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimPaper,
    CoimRating,
    CoimStack,
    CoimTextField,
    toast,
  } from "@coimui/svelte";
  import { CoimLineChart } from "@coimui/svelte/charts";
  import { ecommerceStore } from "#lib/pages/ecommerce.svelte.ts";
  import EcommerceShell from "#lib/pages/EcommerceShell.svelte";

  const product = $derived(ecommerceStore.selectedProduct);
  let commentAuthor = $state("Mateo Khan");
  let commentRating = $state(5);
  let commentBody = $state("");

  const salesSeries = [
    { week: "W1", visits: 410, orders: 24 },
    { week: "W2", visits: 490, orders: 31 },
    { week: "W3", visits: 530, orders: 38 },
    { week: "W4", visits: 615, orders: 47 },
  ];

  function handleAddComment(event: SubmitEvent) {
    event.preventDefault();
    if (!commentBody.trim()) return;
    ecommerceStore.addReview(product.id, commentAuthor, commentRating, commentBody);
    commentBody = "";
    toast.success("Published product review");
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — Ecommerce · {product.name}</title>
</svelte:head>

<EcommerceShell title={product.name} subtitle={`${product.sku} · ${product.category}`}>
  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, lg: 5 }}>
      <CoimCard>
        <img src={product.image} alt={product.name} class="h-64 w-full rounded-t-xl object-cover" />
        <CoimCardContent>
          <CoimStack spacing={2.5}>
            <div class="flex items-center justify-between gap-2">
              <span class="font-heading text-2xl font-bold">${product.price}</span>
              <CoimChip label={`${product.stock} in stock`} color="success" size="small" variant="pastel" />
            </div>
            <p class="text-text-secondary text-sm">{product.summary}</p>
            <div class="space-y-1.5 border-t border-grey-50 pt-3">
              {#each product.specs as spec (spec.label)}
                <div class="flex justify-between text-xs">
                  <span class="text-text-secondary">{spec.label}</span>
                  <span class="font-medium">{spec.value}</span>
                </div>
              {/each}
            </div>
          </CoimStack>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, lg: 7 }}>
      <CoimStack spacing={4}>
        <CoimCard>
          <CoimCardHeader title="Product Demand &amp; Visits" />
          <CoimCardContent>
            <CoimLineChart
              data={salesSeries}
              xKey="week"
              showPoints
              series={[
                { key: "visits", label: "Product Visits" },
                { key: "orders", label: "Completed Orders" },
              ]}
              height={220}
            />
          </CoimCardContent>
        </CoimCard>

        <CoimCard>
          <CoimCardHeader title="Customer Reviews" subheader={`${product.reviews.length} recorded review(s)`} />
          <CoimCardContent>
            <CoimStack spacing={3}>
              <form class="space-y-3" onsubmit={handleAddComment}>
                <div class="flex flex-wrap items-center gap-3">
                  <div class="min-w-44 flex-1">
                    <CoimTextField label="Reviewer Name" bind:value={commentAuthor} fullWidth />
                  </div>
                  <CoimRating bind:value={commentRating} />
                </div>
                <CoimTextField label="Add Review Comment" bind:value={commentBody} multiline rows={2} required fullWidth />
                <CoimButton type="submit" variant="contained" size="small">Post Review</CoimButton>
              </form>

              {#each product.reviews as rev (rev.id)}
                <CoimPaper variant="outlined" class="p-3">
                  <div class="flex items-center justify-between gap-2">
                    <span class="font-semibold text-sm">{rev.author}</span>
                    <CoimRating value={rev.rating} readOnly size="small" />
                  </div>
                  <p class="text-text-secondary mt-1 text-sm">{rev.comment}</p>
                </CoimPaper>
              {/each}
            </CoimStack>
          </CoimCardContent>
        </CoimCard>
      </CoimStack>
    </CoimGrid>
  </CoimGrid>
</EcommerceShell>
