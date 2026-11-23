<script lang="ts">
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimSelect,
    CoimStack,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTableRow,
    toast,
  } from "@coimui/svelte";
  import { ecommerceStore, type EcommerceOrder } from "#lib/pages/ecommerce.svelte.ts";
  import EcommerceShell from "#lib/pages/EcommerceShell.svelte";

  const order = $derived(ecommerceStore.selectedOrder);
</script>

<svelte:head>
  <title>CoimUI Showcase — Ecommerce · {order.id}</title>
</svelte:head>

<EcommerceShell title={`Order ${order.id}`} subtitle={`${order.customer} · Placed ${order.date}`}>
  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, lg: 8 }}>
      <CoimCard>
        <CoimCardHeader title="Line Items">
          {#snippet action()}
            <CoimButton href="/pages/ecommerce/invoice" size="small" variant="outlined">
              Open Printable Invoice
            </CoimButton>
          {/snippet}
        </CoimCardHeader>
        <CoimCardContent>
          <CoimTableContainer>
            <CoimTable aria-label="Order line items">
              <CoimTableHead>
                <CoimTableRow>
                  <CoimTableCell component="th">Item</CoimTableCell>
                  <CoimTableCell component="th">SKU</CoimTableCell>
                  <CoimTableCell component="th" align="right">Qty</CoimTableCell>
                  <CoimTableCell component="th" align="right">Subtotal</CoimTableCell>
                </CoimTableRow>
              </CoimTableHead>
              <CoimTableBody>
                {#each order.lineItems as item (item.sku)}
                  <CoimTableRow>
                    <CoimTableCell>{item.name}</CoimTableCell>
                    <CoimTableCell>{item.sku}</CoimTableCell>
                    <CoimTableCell align="right">{item.qty}</CoimTableCell>
                    <CoimTableCell align="right">${(item.qty * item.unitPrice).toLocaleString()}</CoimTableCell>
                  </CoimTableRow>
                {/each}
              </CoimTableBody>
            </CoimTable>
          </CoimTableContainer>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, lg: 4 }}>
      <CoimStack spacing={4}>
        <CoimCard>
          <CoimCardHeader title="Fulfillment State" />
          <CoimCardContent>
            <CoimStack spacing={3}>
              <div class="flex items-center justify-between">
                <span class="text-sm text-text-secondary">Current Status</span>
                <CoimChip label={order.status} color="primary" size="small" variant="pastel" />
              </div>
              <CoimSelect
                label="Update Status"
                value={order.status}
                onValueChange={(v) => {
                  if (v === "Processing" || v === "Shipped" || v === "Fulfilled") {
                    ecommerceStore.updateOrderStatus(order.id, v as EcommerceOrder["status"]);
                    toast.success(`Order ${order.id} marked ${v}`);
                  }
                }}
                options={[
                  { value: "Processing", label: "Processing" },
                  { value: "Shipped", label: "Shipped" },
                  { value: "Fulfilled", label: "Fulfilled" },
                ]}
                fullWidth
              />
            </CoimStack>
          </CoimCardContent>
        </CoimCard>

        <CoimCard>
          <CoimCardHeader title="Customer &amp; Shipping" />
          <CoimCardContent>
            <p class="font-medium text-sm">{order.customer}</p>
            <p class="text-text-secondary text-xs">{order.email}</p>
            <p class="text-text-secondary mt-2 text-xs">{order.shippingAddress}</p>
          </CoimCardContent>
        </CoimCard>
      </CoimStack>
    </CoimGrid>
  </CoimGrid>
</EcommerceShell>
