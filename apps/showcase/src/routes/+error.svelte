<script lang="ts">
  import { page } from "$app/state";
  import { CoimButton, CoimCard, CoimCardContent, CoimTypography } from "@coimui/svelte";
</script>

<div class="flex min-h-[60vh] items-center justify-center p-6">
  <CoimCard class="max-w-md text-center">
    <CoimCardContent>
      <CoimTypography variant="h1" class="text-primary">{page.status}</CoimTypography>
      <CoimTypography variant="h4" class="mt-2">Unable to Display Page</CoimTypography>
      <p class="text-text-secondary mt-2 text-sm">
        {page.error?.message ?? "The requested showcase route does not exist."}
      </p>
      <CoimButton variant="contained" href="/" class="mt-5">Return to Showcase</CoimButton>
    </CoimCardContent>
  </CoimCard>
</div>
