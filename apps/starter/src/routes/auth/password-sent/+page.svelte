<script lang="ts">
  import { CoimAuthLayout, CoimButton, CoimLogo, CoimPaper, CoimStack, CoimTypography } from "@coimui/svelte";
</script>

<svelte:head><title>CoimUI Starter — Reset Sent</title></svelte:head>

<CoimAuthLayout currentPath="/auth/password-sent">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-md rounded-2xl p-8 text-center">
      <CoimStack spacing={4} class="items-center">
        <CoimLogo />
        <CoimTypography variant="h1" class="text-2xl">Reset Instructions Sent</CoimTypography>
        <p class="text-text-secondary text-sm">Check your email inbox for the password recovery link.</p>
        <CoimButton href="/auth/password-new" variant="contained" fullWidth>Set New Password</CoimButton>
        <CoimButton href="/auth/sign-in" variant="outlined" fullWidth>Back to Sign In</CoimButton>
      </CoimStack>
    </CoimPaper>
  </div>
</CoimAuthLayout>
