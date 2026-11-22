<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimAuthLayout,
    CoimButton,
    CoimCheckbox,
    CoimFormControlLabel,
    CoimLink,
    CoimLogo,
    CoimPaper,
    CoimStack,
    CoimTextField,
    CoimTypography,
    toast,
  } from "@coimui/svelte";

  let email = $state("laura.ellis@coimui.dev");
  let password = $state("••••••••••••");
  let remember = $state(true);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    toast.success("Signed in cleanly");
    void goto("/");
  }
</script>

<svelte:head>
  <title>CoimUI Starter — Sign In</title>
</svelte:head>

<CoimAuthLayout currentPath="/auth/sign-in">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-md rounded-2xl p-8">
      <form onsubmit={handleSubmit}>
        <CoimStack spacing={4}>
          <CoimLogo />
          <div>
            <CoimTypography variant="h1" class="text-2xl">Sign In</CoimTypography>
            <p class="text-text-secondary mt-1 text-sm">
              Enter your credentials to access CoimUI Starter.
            </p>
          </div>
          <CoimTextField label="Email address" type="email" autocomplete="username" bind:value={email} required fullWidth />
          <CoimTextField label="Password" type="password" autocomplete="current-password" bind:value={password} required fullWidth />
          <div class="flex items-center justify-between">
            <CoimFormControlLabel label="Remember me">
              <CoimCheckbox bind:checked={remember} />
            </CoimFormControlLabel>
            <CoimLink href="/auth/forgot-password">Forgot password?</CoimLink>
          </div>
          <CoimButton type="submit" variant="contained" size="large" fullWidth>
            Continue to Workspace
          </CoimButton>
          <p class="text-text-secondary text-center text-sm">
            Need an account? <CoimLink href="/auth/sign-up">Sign up</CoimLink>
          </p>
        </CoimStack>
      </form>
    </CoimPaper>
  </div>
</CoimAuthLayout>
