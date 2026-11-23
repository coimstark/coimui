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
  <title>CoimUI Showcase — Reset Link Dispatched</title>
</svelte:head>

<CoimAuthLayout currentPath="/pages/auth/password-sent">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-md rounded-2xl p-8 text-center">
      <CoimStack spacing={4} class="items-center">
        <CoimLogo />
        <CoimTypography variant="h1" class="text-2xl">Check Your Inbox</CoimTypography>
        <p class="text-text-secondary text-sm">
          If an account exists for that email address, recovery instructions have been queued for delivery.
        </p>
        <CoimButton href="/pages/auth/password-new" variant="contained" fullWidth>Continue to New Password</CoimButton>
        <CoimButton href="/pages/auth/sign-in" variant="outlined" fullWidth>Return to Sign In</CoimButton>
      </CoimStack>
    </CoimPaper>
  </div>
</CoimAuthLayout>
