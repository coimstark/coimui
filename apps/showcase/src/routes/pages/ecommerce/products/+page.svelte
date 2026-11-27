<script lang="ts">
  import { goto } from "$app/navigation";
  import { CoimCard, CoimCardContent, CoimCardHeader, toast } from "@coimui/svelte";
  import { CoimDataGrid, type CoimDataGridColumn } from "@coimui/svelte/data-grid";
  import { ecommerceStore, type EcommerceProduct } from "#lib/pages/ecommerce.svelte.ts";
  import { showcaseI18n } from "#lib/i18n.svelte.ts";
  import EcommerceShell from "#lib/pages/EcommerceShell.svelte";

  const columns: CoimDataGridColumn<EcommerceProduct & Record<string, unknown>>[] = [
    { id: "sku", field: "sku", headerName: "SKU", width: 130 },
    { id: "name", field: "name", headerName: "Product", width: 220, filterable: true },
    { id: "category", field: "category", headerName: "Category", width: 130, groupable: true },
    {
      id: "price",
      field: "price",
      headerName: "Price",
      type: "number",
      align: "right",
      editable: true,
      width: 110,
      valueFormatter: (v) => `$${Number(v ?? 0)}`,
    },
    { id: "stock", field: "stock", headerName: "Stock", type: "number", align: "right", width: 100 },
    { id: "status", field: "status", headerName: "Status", width: 120 },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Ecommerce · Products</title>
</svelte:head>

<EcommerceShell title="Catalog Products" subtitle="Standard interactive catalog table with inline price editing and CSV/Excel exports.">
  <CoimCard>
    <CoimCardHeader title="All SKUs" subheader="Click any row to open Product Detail" />
    <CoimCardContent>
      <CoimDataGrid
        rows={ecommerceStore.products as unknown as (EcommerceProduct & Record<string, unknown>)[]}
        {columns}
        translate={showcaseI18n.t}
        checkboxSelection
        showColumnFilters
        groupable
        onRowClick={(row) => {
          ecommerceStore.selectProduct(row.id);
          void goto("/pages/ecommerce/product-detail");
        }}
        onCellEditCommit={(ev) => {
          if (ev.columnId === "price") {
            ecommerceStore.updatePrice(ev.rowId, Number(ev.value));
            toast.success(`Updated price for ${ev.row.name}`);
          }
        }}
      />
    </CoimCardContent>
  </CoimCard>
</EcommerceShell>
