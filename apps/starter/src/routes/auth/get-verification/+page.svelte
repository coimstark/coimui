<script lang="ts">
  import { goto } from "$app/navigation";
  import {
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

  let email = $state("laura.ellis@coimui.dev");

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    toast.success(`Prepared verification code for ${email}`);
    void goto("/auth/set-verification");
  }
</script>

<svelte:head><title>CoimUI Starter — Request Verification</title></svelte:head>

<CoimAuthLayout currentPath="/auth/get-verification">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-md rounded-2xl p-8">
      <form onsubmit={handleSubmit}>
        <CoimStack spacing={4}>
          <CoimLogo />
          <CoimTypography variant="h1" class="text-2xl">Verify Email</CoimTypography>
          <p class="text-text-secondary text-sm">Enter your account email to request a 6-digit verification code.</p>
          <CoimTextField label="Email address" type="email" bind:value={email} required fullWidth />
          <CoimButton type="submit" variant="contained" size="large" fullWidth>Request Code</CoimButton>
          <p class="text-text-secondary text-center text-sm">
            Have a code? <CoimLink href="/auth/set-verification">Enter OTP</CoimLink>
          </p>
        </CoimStack>
      </form>
    </CoimPaper>
  </div>
</CoimAuthLayout>
