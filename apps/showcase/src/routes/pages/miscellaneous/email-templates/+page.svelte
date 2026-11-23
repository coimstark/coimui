<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimGrid,
    CoimPaper,
    CoimStack,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import { CoimCodeBlock } from "@coimui/svelte/plugins";

  let selectedTemplate = $state<"welcome" | "receipt">("welcome");

  const htmlPreview = $derived(
    selectedTemplate === "welcome"
      ? `<tr><td><h1>Welcome to CoimUI</h1><p>Your workspace account is ready.</p></td></tr>`
      : `<tr><td><h1>Order #ORD-8821 Confirmed</h1><p>Amount settled: $1,165.00</p></td></tr>`,
  );
</script>

<svelte:head>
  <title>CoimUI Showcase — Email Templates</title>
</svelte:head>

<CoimStack spacing={5}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Miscellaneous", href: "/pages/miscellaneous" }, { label: "Email Templates" }]} />
    <CoimTypography variant="h1" class="mt-2">Transactional Email Templates</CoimTypography>
    <p class="text-text-secondary mt-1 text-sm">Preview responsive transactional emails and copy table-safe markup.</p>
  </div>

  <div class="flex flex-wrap gap-2">
    <CoimButton size="small" variant={selectedTemplate === "welcome" ? "contained" : "outlined"} onclick={() => (selectedTemplate = "welcome")}>
      Onboarding Welcome
    </CoimButton>
    <CoimButton size="small" variant={selectedTemplate === "receipt" ? "contained" : "outlined"} onclick={() => (selectedTemplate = "receipt")}>
      Order Receipt
    </CoimButton>
  </div>

  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, lg: 6 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="Rendered Preview" />
        <CoimCardContent>
          <CoimPaper variant="outlined" class="rounded-xl p-6">
            <img src="/images/email/product-1.png" alt="Featured product preview" class="mb-4 h-36 w-full rounded-lg object-cover" />
            <h2 class="font-heading text-xl font-bold">
              {selectedTemplate === "welcome" ? "Welcome to CoimUI Workspace" : "Receipt for Order #ORD-8821"}
            </h2>
            <p class="text-text-secondary mt-2 text-sm">
              {selectedTemplate === "welcome"
                ? "Complete verification or launch your first DataGrid and Dashboard template right away."
                : "Thank you for your order. Two Reference Studio Monitors and one Desk Lamp are in transit."}
            </p>
            <div class="mt-4">
              <CoimButton size="small" variant="contained" onclick={() => toast.info("Primary email CTA clicked")}>
                {selectedTemplate === "welcome" ? "Open Workspace" : "View Order"}
              </CoimButton>
            </div>
          </CoimPaper>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, lg: 6 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="HTML Source Snippet" />
        <CoimCardContent>
          <CoimCodeBlock language="html" filename={`${selectedTemplate}.html`} code={htmlPreview} />
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>
  </CoimGrid>
</CoimStack>
