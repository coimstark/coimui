<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTableRow,
  } from "@coimui/svelte";
  import { ecommerceStore } from "#lib/pages/ecommerce.svelte.ts";
  import EcommerceShell from "#lib/pages/EcommerceShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — Ecommerce · Orders</title>
</svelte:head>

<EcommerceShell title="Customer Orders" subtitle="Inspect order status, open fulfillment detail, or print GST/VAT invoices.">
  <CoimCard>
    <CoimCardHeader title="Orders Registry" />
    <CoimCardContent>
      <CoimTableContainer>
        <CoimTable aria-label="Ecommerce Orders">
          <CoimTableHead>
            <CoimTableRow>
              <CoimTableCell component="th">Order ID</CoimTableCell>
              <CoimTableCell component="th">Customer</CoimTableCell>
              <CoimTableCell component="th">Date</CoimTableCell>
              <CoimTableCell component="th">Status</CoimTableCell>
              <CoimTableCell component="th" align="right">Total</CoimTableCell>
              <CoimTableCell component="th" align="right">Actions</CoimTableCell>
            </CoimTableRow>
          </CoimTableHead>
          <CoimTableBody>
            {#each ecommerceStore.orders as ord (ord.id)}
              <CoimTableRow>
                <CoimTableCell class="font-medium">{ord.id}</CoimTableCell>
                <CoimTableCell>{ord.customer}</CoimTableCell>
                <CoimTableCell>{ord.date}</CoimTableCell>
                <CoimTableCell>
                  <CoimChip
                    label={ord.status}
                    color={ord.status === "Fulfilled" ? "success" : ord.status === "Shipped" ? "info" : "warning"}
                    size="small"
                    variant="pastel"
                  />
                </CoimTableCell>
                <CoimTableCell align="right">${ord.total.toLocaleString()}</CoimTableCell>
                <CoimTableCell align="right">
                  <div class="flex justify-end gap-1.5">
                    <CoimButton
                      size="tiny"
                      variant="outlined"
                      onclick={() => {
                        ecommerceStore.selectOrder(ord.id);
                        void goto("/pages/ecommerce/order-detail");
                      }}
                    >
                      Detail
                    </CoimButton>
                    <CoimButton
                      size="tiny"
                      variant="text"
                      onclick={() => {
                        ecommerceStore.selectOrder(ord.id);
                        void goto("/pages/ecommerce/invoice");
                      }}
                    >
                      Invoice
                    </CoimButton>
                  </div>
                </CoimTableCell>
              </CoimTableRow>
            {/each}
          </CoimTableBody>
        </CoimTable>
      </CoimTableContainer>
    </CoimCardContent>
  </CoimCard>
</EcommerceShell>
