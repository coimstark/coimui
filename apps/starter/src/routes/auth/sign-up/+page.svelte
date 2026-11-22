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

  let name = $state("");
  let email = $state("");
  let password = $state("");

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    toast.success("Account registered");
    void goto("/");
  }
</script>

<svelte:head>
  <title>CoimUI Starter — Sign Up</title>
</svelte:head>

<CoimAuthLayout currentPath="/auth/sign-up">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-md rounded-2xl p-8">
      <form onsubmit={handleSubmit}>
        <CoimStack spacing={4}>
          <CoimLogo />
          <CoimTypography variant="h1" class="text-2xl">Create Account</CoimTypography>
          <CoimTextField label="Full Name" autocomplete="name" bind:value={name} required fullWidth />
          <CoimTextField label="Work Email" type="email" autocomplete="username" bind:value={email} required fullWidth />
          <CoimTextField label="Password" type="password" autocomplete="new-password" bind:value={password} required fullWidth />
          <CoimButton type="submit" variant="contained" size="large" fullWidth>Register</CoimButton>
          <p class="text-text-secondary text-center text-sm">
            Already registered? <CoimLink href="/auth/sign-in">Sign in</CoimLink>
          </p>
        </CoimStack>
      </form>
    </CoimPaper>
  </div>
</CoimAuthLayout>
