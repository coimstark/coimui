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

  function handleRequestCode(event: SubmitEvent) {
    event.preventDefault();
    toast.success(`Verification challenge prepared for ${email}`);
    void goto("/pages/auth/set-verification");
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — Request Verification</title>
</svelte:head>

<CoimAuthLayout currentPath="/pages/auth/get-verification">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-md rounded-2xl p-8">
      <form onsubmit={handleRequestCode}>
        <CoimStack spacing={4}>
          <CoimLogo />
          <div>
            <CoimTypography variant="h1" class="text-2xl">Verify Identity</CoimTypography>
            <p class="text-text-secondary mt-1 text-sm">
              Enter your registered email to issue a six-digit verification code.
            </p>
          </div>
          <CoimTextField label="Email Address" type="email" bind:value={email} required fullWidth />
          <CoimButton type="submit" variant="contained" size="large" fullWidth>Send Code</CoimButton>
          <p class="text-text-secondary text-center text-sm">
            Already have a code? <CoimLink href="/pages/auth/set-verification">Verify OTP</CoimLink>
          </p>
        </CoimStack>
      </form>
    </CoimPaper>
  </div>
</CoimAuthLayout>
