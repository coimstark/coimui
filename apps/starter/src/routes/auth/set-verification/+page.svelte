<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimAuthLayout,
    CoimButton,
    CoimLink,
    CoimLogo,
    CoimOtpInput,
    CoimPaper,
    CoimStack,
    CoimTypography,
    toast,
  } from "@coimui/svelte";

  let otp = $state("");

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (otp.length < 6) {
      toast.warning("Enter the 6-digit code");
      return;
    }
    toast.success("Starter verification confirmed");
    void goto("/auth/sign-in");
  }
</script>

<svelte:head><title>CoimUI Starter — Verify OTP</title></svelte:head>

<CoimAuthLayout currentPath="/auth/set-verification">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-md rounded-2xl p-8">
      <form onsubmit={handleSubmit}>
        <CoimStack spacing={4}>
          <CoimLogo />
          <CoimTypography variant="h1" class="text-2xl">Enter Verification Code</CoimTypography>
          <p class="text-text-secondary text-sm">Type the 6-digit code to finish account verification.</p>
          <CoimOtpInput bind:value={otp} length={6} numericOnly />
          <CoimButton type="submit" variant="contained" size="large" fullWidth>Verify Account</CoimButton>
          <p class="text-text-secondary text-center text-sm">
            <CoimLink href="/auth/get-verification">Request another code</CoimLink>
          </p>
        </CoimStack>
      </form>
    </CoimPaper>
  </div>
</CoimAuthLayout>
