<script lang="ts">
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimDivider,
    CoimLogo,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTableRow,
  } from "@coimui/svelte";
  import { printElement } from "@coimui/svelte/plugins";
  import { ecommerceStore } from "#lib/pages/ecommerce.svelte.ts";
  import EcommerceShell from "#lib/pages/EcommerceShell.svelte";

  const order = $derived(ecommerceStore.selectedOrder);
  let invoiceEl = $state<HTMLElement | null>(null);
</script>

<svelte:head>
  <title>CoimUI Showcase — Ecommerce · Invoice</title>
</svelte:head>

<EcommerceShell title={`Invoice ${order.id}`} subtitle="Printable billing invoice document.">
  <CoimCard>
    <CoimCardHeader title={`Invoice #${order.id}`} subheader={`Issued ${order.date}`}>
      {#snippet action()}
        <CoimButton
          size="small"
          variant="contained"
          onclick={() => {
            if (invoiceEl) printElement(invoiceEl, { title: `Invoice ${order.id}` });
          }}
        >
          Print Invoice
        </CoimButton>
      {/snippet}
    </CoimCardHeader>
    <CoimCardContent>
      <div bind:this={invoiceEl} class="space-y-6 p-4">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <CoimLogo />
          <div class="text-end text-sm">
            <p class="font-semibold">Billed To: {order.customer}</p>
            <p class="text-text-secondary">{order.email}</p>
            <p class="text-text-secondary">{order.shippingAddress}</p>
          </div>
        </div>

        <CoimDivider />

        <CoimTableContainer>
          <CoimTable aria-label="Invoice items">
            <CoimTableHead>
              <CoimTableRow>
                <CoimTableCell component="th">Description</CoimTableCell>
                <CoimTableCell component="th">SKU</CoimTableCell>
                <CoimTableCell component="th" align="right">Qty</CoimTableCell>
                <CoimTableCell component="th" align="right">Unit</CoimTableCell>
                <CoimTableCell component="th" align="right">Amount</CoimTableCell>
              </CoimTableRow>
            </CoimTableHead>
            <CoimTableBody>
              {#each order.lineItems as item (item.sku)}
                <CoimTableRow>
                  <CoimTableCell>{item.name}</CoimTableCell>
                  <CoimTableCell>{item.sku}</CoimTableCell>
                  <CoimTableCell align="right">{item.qty}</CoimTableCell>
                  <CoimTableCell align="right">${item.unitPrice}</CoimTableCell>
                  <CoimTableCell align="right">${(item.qty * item.unitPrice).toLocaleString()}</CoimTableCell>
                </CoimTableRow>
              {/each}
            </CoimTableBody>
          </CoimTable>
        </CoimTableContainer>

        <div class="flex justify-end">
          <div class="text-end">
            <span class="text-text-secondary text-sm">Amount Due</span>
            <p class="font-heading text-2xl font-bold">${order.total.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </CoimCardContent>
  </CoimCard>
</EcommerceShell>
