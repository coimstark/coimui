<script lang="ts">
  import { CoimAuthLayout, CoimButton, CoimLogo, CoimPaper, CoimStack, CoimTypography } from "@coimui/svelte";
</script>

<svelte:head><title>CoimUI Starter — Privacy Policy</title></svelte:head>

<CoimAuthLayout currentPath="/auth/privacy-policy">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-2xl rounded-2xl p-8">
      <CoimStack spacing={4}>
        <CoimLogo />
        <CoimTypography variant="h1" class="text-2xl">Privacy Policy</CoimTypography>
        <p class="text-text-secondary text-sm leading-relaxed">
          CoimUI Starter persists local appearance and locale preferences cleanly in your browser storage without transmitting external telemetry.
        </p>
        <div><CoimButton href="/auth/sign-in" variant="contained">Return to Sign In</CoimButton></div>
      </CoimStack>
    </CoimPaper>
  </div>
</CoimAuthLayout>
