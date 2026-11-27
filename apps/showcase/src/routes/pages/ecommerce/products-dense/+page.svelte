<script lang="ts">
  import { goto } from "$app/navigation";
  import { CoimCard, CoimCardContent, CoimCardHeader } from "@coimui/svelte";
  import { CoimDataGrid, type CoimDataGridColumn } from "@coimui/svelte/data-grid";
  import { ecommerceStore, type EcommerceProduct } from "#lib/pages/ecommerce.svelte.ts";
  import { showcaseI18n } from "#lib/i18n.svelte.ts";
  import EcommerceShell from "#lib/pages/EcommerceShell.svelte";

  const columns: CoimDataGridColumn<EcommerceProduct & Record<string, unknown>>[] = [
    { id: "sku", field: "sku", headerName: "SKU", width: 130 },
    { id: "name", field: "name", headerName: "Name", width: 220 },
    { id: "category", field: "category", headerName: "Category", width: 120 },
    { id: "price", field: "price", headerName: "Price", type: "number", align: "right", width: 100, valueFormatter: (v) => `$${v}` },
    { id: "stock", field: "stock", headerName: "On Hand", type: "number", align: "right", width: 100 },
    { id: "status", field: "status", headerName: "Status", width: 120 },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Ecommerce · Dense Catalog</title>
</svelte:head>

<EcommerceShell title="Dense SKU Catalog" subtitle="Compact density DataGrid preset tuned for procurement buyers.">
  <CoimCard>
    <CoimCardHeader title="Compact Inventory Ledger" />
    <CoimCardContent>
      <CoimDataGrid
        rows={ecommerceStore.products as unknown as (EcommerceProduct & Record<string, unknown>)[]}
        {columns}
        translate={showcaseI18n.t}
        density="compact"
        onRowClick={(row) => {
          ecommerceStore.selectProduct(row.id);
          void goto("/pages/ecommerce/product-detail");
        }}
      />
    </CoimCardContent>
  </CoimCard>
</EcommerceShell>
