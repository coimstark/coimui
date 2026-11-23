<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimAuthLayout,
    CoimButton,
    CoimLogo,
    CoimPaper,
    CoimStack,
    CoimTextField,
    CoimTypography,
    toast,
  } from "@coimui/svelte";

  let password = $state("");
  let confirm = $state("");

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (password.length < 8) {
      toast.warning("Use at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password updated cleanly");
    void goto("/auth/sign-in");
  }
</script>

<svelte:head><title>CoimUI Starter — New Password</title></svelte:head>

<CoimAuthLayout currentPath="/auth/password-new">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-md rounded-2xl p-8">
      <form onsubmit={handleSubmit}>
        <CoimStack spacing={4}>
          <CoimLogo />
          <CoimTypography variant="h1" class="text-2xl">Set New Password</CoimTypography>
          <CoimTextField label="New Password" type="password" bind:value={password} required fullWidth />
          <CoimTextField label="Confirm Password" type="password" bind:value={confirm} required fullWidth />
          <CoimButton type="submit" variant="contained" size="large" fullWidth>Save Password</CoimButton>
        </CoimStack>
      </form>
    </CoimPaper>
  </div>
</CoimAuthLayout>
