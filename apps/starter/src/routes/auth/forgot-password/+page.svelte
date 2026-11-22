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
  } from "@coimui/svelte";

  let email = $state("");
  let sent = $state(false);
</script>

<svelte:head>
  <title>CoimUI Starter — Forgot Password</title>
</svelte:head>

<CoimAuthLayout currentPath="/auth/forgot-password">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-md rounded-2xl p-8">
      <form
        onsubmit={(e) => {
          e.preventDefault();
          sent = true;
        }}
      >
        <CoimStack spacing={4}>
          <CoimLogo />
          <CoimTypography variant="h1" class="text-2xl">Reset Password</CoimTypography>
          {#if sent}
            <CoimAlert severity="success" title="Instructions Dispatched">
              If an account matches <strong>{email}</strong>, recovery guidance has been sent.
            </CoimAlert>
          {/if}
          <CoimTextField label="Work Email" type="email" bind:value={email} required fullWidth />
          <CoimButton type="submit" variant="contained" size="large" fullWidth>
            Send Recovery Link
          </CoimButton>
          <p class="text-center text-sm">
            <CoimLink href="/auth/sign-in">Return to Sign In</CoimLink>
          </p>
        </CoimStack>
      </form>
    </CoimPaper>
  </div>
</CoimAuthLayout>
