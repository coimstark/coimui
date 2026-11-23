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
  <title>CoimUI Showcase — Privacy Policy</title>
</svelte:head>

<CoimAuthLayout currentPath="/pages/auth/privacy-policy">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-2xl rounded-2xl p-8">
      <CoimStack spacing={4}>
        <CoimLogo />
        <CoimTypography variant="h1" class="text-2xl">Privacy Policy</CoimTypography>
        <p class="text-text-secondary text-sm leading-relaxed">
          CoimUI demonstration applications persist UI theme, locale, and sample workspace preferences locally in browser storage and do not transmit secrets to external inference providers unless explicitly configured by an operator.
        </p>
        <div>
          <CoimButton href="/pages/auth/sign-in" variant="contained">Back to Sign In</CoimButton>
        </div>
      </CoimStack>
    </CoimPaper>
  </div>
</CoimAuthLayout>
