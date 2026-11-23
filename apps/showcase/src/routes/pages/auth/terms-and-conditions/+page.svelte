<script lang="ts">
  import {
    CoimAuthLayout,
    CoimButton,
    CoimLogo,
    CoimPaper,
    CoimStack,
    CoimTypography,
  } from "@coimui/svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — Terms &amp; Conditions</title>
</svelte:head>

<CoimAuthLayout currentPath="/pages/auth/terms-and-conditions">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-2xl rounded-2xl p-8">
      <CoimStack spacing={4}>
        <CoimLogo />
        <CoimTypography variant="h1" class="text-2xl">Terms &amp; Conditions</CoimTypography>
        <p class="text-text-secondary text-sm leading-relaxed">
          Workspace examples and UI building blocks under `@coimui/svelte` are provided as modular application foundations. Review external authentication and provider agreements before deploying connected endpoints.
        </p>
        <div>
          <CoimButton href="/pages/auth/sign-up" variant="contained">Back to Sign Up</CoimButton>
        </div>
      </CoimStack>
    </CoimPaper>
  </div>
</CoimAuthLayout>
