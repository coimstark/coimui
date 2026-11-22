<script lang="ts">
  import {
    CoimAlert,
    CoimAuthLayout,
    CoimButton,
    CoimLink,
    CoimLogo,
    CoimPaper,
    CoimStack,
    CoimTextField,
    CoimTypography,
    toast,
  } from "@coimui/svelte";

  let email = $state("");
  let sent = $state(false);

  function submitReset(event: SubmitEvent) {
    event.preventDefault();
    sent = true;
    toast.info("Password recovery instructions dispatched");
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — Forgot Password</title>
</svelte:head>

<CoimAuthLayout currentPath="/pages/auth/forgot-password">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-md rounded-2xl p-8">
      <form onsubmit={submitReset}>
        <CoimStack spacing={4}>
          <CoimLogo />
          <div>
            <CoimTypography variant="h1" class="text-2xl">Reset Password</CoimTypography>
            <p class="text-text-secondary mt-1 text-sm">We will send a single-use recovery link to your work email.</p>
          </div>
          {#if sent}
            <CoimAlert severity="success" role="status">
              Check your inbox for recovery instructions.
            </CoimAlert>
          {/if}
          <CoimTextField
            name="email"
            label="Work Email"
            type="email"
            autocomplete="username"
            bind:value={email}
            required
            fullWidth
          />
          <CoimButton type="submit" variant="contained" size="large" fullWidth>
            Send Reset Link
          </CoimButton>
          <p class="text-center text-sm">
            <CoimLink href="/pages/auth/sign-in">Back to Sign In</CoimLink>
          </p>
        </CoimStack>
      </form>
    </CoimPaper>
  </div>
</CoimAuthLayout>
