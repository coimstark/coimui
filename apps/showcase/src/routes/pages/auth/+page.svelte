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
  <title>CoimUI Showcase — Authentication Flows</title>
</svelte:head>

<CoimAuthLayout currentPath="/pages/auth">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-md rounded-2xl p-8">
      <CoimStack spacing={4}>
        <CoimLogo />
        <div>
          <CoimTypography variant="h1" class="text-2xl">Authentication Flows</CoimTypography>
          <p class="text-text-secondary mt-1 text-sm">Select an account access step or security policy page.</p>
        </div>
        <CoimButton href="/pages/auth/sign-in" variant="contained" fullWidth>Sign In</CoimButton>
        <CoimButton href="/pages/auth/sign-up" variant="outlined" fullWidth>Create Account</CoimButton>
        <CoimButton href="/pages/auth/forgot-password" variant="outlined" fullWidth>Reset Password</CoimButton>
        <CoimButton href="/pages/auth/get-verification" variant="outlined" fullWidth>Request Verification Code</CoimButton>
        <CoimButton href="/pages/auth/set-verification" variant="outlined" fullWidth>Enter OTP Code</CoimButton>
        <CoimButton href="/pages/auth/password-new" variant="outlined" fullWidth>Set New Password</CoimButton>
        <CoimButton href="/pages/auth/password-sent" variant="outlined" fullWidth>Reset Email Sent</CoimButton>
        <CoimButton href="/pages/auth/privacy-policy" variant="text" fullWidth>Privacy Policy</CoimButton>
        <CoimButton href="/pages/auth/terms-and-conditions" variant="text" fullWidth>Terms &amp; Conditions</CoimButton>
      </CoimStack>
    </CoimPaper>
  </div>
</CoimAuthLayout>
