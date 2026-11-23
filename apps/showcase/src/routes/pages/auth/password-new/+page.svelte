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

  function handleReset(event: SubmitEvent) {
    event.preventDefault();
    if (password.length < 8) {
      toast.warning("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Updated workspace password");
    void goto("/pages/auth/sign-in");
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — Set New Password</title>
</svelte:head>

<CoimAuthLayout currentPath="/pages/auth/password-new">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-md rounded-2xl p-8">
      <form onsubmit={handleReset}>
        <CoimStack spacing={4}>
          <CoimLogo />
          <div>
            <CoimTypography variant="h1" class="text-2xl">Choose New Password</CoimTypography>
            <p class="text-text-secondary mt-1 text-sm">Set a strong passphrase for your workspace account.</p>
          </div>
          <CoimTextField label="New Password" type="password" bind:value={password} required fullWidth />
          <CoimTextField label="Confirm Password" type="password" bind:value={confirm} required fullWidth />
          <CoimButton type="submit" variant="contained" size="large" fullWidth>Update Password</CoimButton>
        </CoimStack>
      </form>
    </CoimPaper>
  </div>
</CoimAuthLayout>
