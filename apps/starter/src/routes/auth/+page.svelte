<script lang="ts">
  import { CoimAuthLayout, CoimButton, CoimLogo, CoimPaper, CoimStack, CoimTypography } from "@coimui/svelte";
</script>

<svelte:head><title>CoimUI Starter — Authentication</title></svelte:head>

<CoimAuthLayout currentPath="/auth">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-md rounded-2xl p-8">
      <CoimStack spacing={3}>
        <CoimLogo />
        <CoimTypography variant="h1" class="text-2xl">Account Access</CoimTypography>
        <p class="text-text-secondary text-sm">Select an authentication step for CoimUI Starter.</p>
        <CoimButton href="/auth/sign-in" variant="contained" fullWidth>Sign In</CoimButton>
        <CoimButton href="/auth/sign-up" variant="outlined" fullWidth>Sign Up</CoimButton>
        <CoimButton href="/auth/forgot-password" variant="outlined" fullWidth>Forgot Password</CoimButton>
        <CoimButton href="/auth/get-verification" variant="outlined" fullWidth>Get Verification Code</CoimButton>
        <CoimButton href="/auth/set-verification" variant="outlined" fullWidth>Verify OTP</CoimButton>
        <CoimButton href="/auth/password-new" variant="outlined" fullWidth>Set New Password</CoimButton>
        <CoimButton href="/auth/password-sent" variant="outlined" fullWidth>Reset Email Sent</CoimButton>
        <CoimButton href="/auth/privacy-policy" variant="text" fullWidth>Privacy Policy</CoimButton>
        <CoimButton href="/auth/terms-and-conditions" variant="text" fullWidth>Terms &amp; Conditions</CoimButton>
      </CoimStack>
    </CoimPaper>
  </div>
</CoimAuthLayout>
