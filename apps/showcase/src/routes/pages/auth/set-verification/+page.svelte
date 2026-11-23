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

  function handleVerify(event: SubmitEvent) {
    event.preventDefault();
    if (otp.length < 6) {
      toast.warning("Enter all 6 verification digits");
      return;
    }
    toast.success("Account verification confirmed");
    void goto("/pages/auth/sign-in");
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — Verify OTP</title>
</svelte:head>

<CoimAuthLayout currentPath="/pages/auth/set-verification">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-md rounded-2xl p-8">
      <form onsubmit={handleVerify}>
        <CoimStack spacing={4}>
          <CoimLogo />
          <div>
            <CoimTypography variant="h1" class="text-2xl">Enter Verification Code</CoimTypography>
            <p class="text-text-secondary mt-1 text-sm">
              Input the 6-digit security code sent to your email.
            </p>
          </div>
          <CoimOtpInput bind:value={otp} length={6} numericOnly />
          <CoimButton type="submit" variant="contained" size="large" fullWidth>Confirm Code</CoimButton>
          <p class="text-text-secondary text-center text-sm">
            Need a new code? <CoimLink href="/pages/auth/get-verification">Request again</CoimLink>
          </p>
        </CoimStack>
      </form>
    </CoimPaper>
  </div>
</CoimAuthLayout>
