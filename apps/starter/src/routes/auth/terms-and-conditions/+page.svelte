<script lang="ts">
  import { CoimAuthLayout, CoimButton, CoimLogo, CoimPaper, CoimStack, CoimTypography } from "@coimui/svelte";
</script>

<svelte:head><title>CoimUI Starter — Terms &amp; Conditions</title></svelte:head>

<CoimAuthLayout currentPath="/auth/terms-and-conditions">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-2xl rounded-2xl p-8">
      <CoimStack spacing={4}>
        <CoimLogo />
        <CoimTypography variant="h1" class="text-2xl">Terms &amp; Conditions</CoimTypography>
        <p class="text-text-secondary text-sm leading-relaxed">
          Review applicable workspace access policies before wiring production authentication providers in your Starter workspace.
        </p>
        <div><CoimButton href="/auth/sign-up" variant="contained">Return to Sign Up</CoimButton></div>
      </CoimStack>
    </CoimPaper>
  </div>
</CoimAuthLayout>
