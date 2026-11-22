<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimAuthLayout,
    CoimButton,
    CoimCheckbox,
    CoimFormControlLabel,
    CoimIconButton,
    CoimLink,
    CoimLogo,
    CoimPaper,
    CoimStack,
    CoimTextField,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import { CiEyeClose, CiEyeOpen } from "@coimui/svelte/icons";

  let fullName = $state("");
  let email = $state("");
  let password = $state("");
  let showPassword = $state(false);
  let accept = $state(true);

  function submitSignUp(event: SubmitEvent) {
    event.preventDefault();
    toast.success("Workspace account created");
    void goto("/");
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — Sign Up</title>
</svelte:head>

<CoimAuthLayout currentPath="/pages/auth/sign-up">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-md rounded-2xl p-8">
      <form onsubmit={submitSignUp}>
        <CoimStack spacing={4}>
          <CoimLogo />
          <div>
            <CoimTypography variant="h1" class="text-2xl">Create Account</CoimTypography>
            <p class="text-text-secondary mt-1 text-sm">Provision a new CoimUI workspace identity.</p>
          </div>
          <CoimTextField name="name" label="Full Name" autocomplete="name" bind:value={fullName} required fullWidth />
          <CoimTextField name="email" label="Work Email" type="email" autocomplete="username" bind:value={email} required fullWidth />
          <CoimTextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            autocomplete="new-password"
            helperText="Use 8 or more characters"
            bind:value={password}
            required
            fullWidth
          >
            {#snippet endAdornment()}
              <CoimIconButton
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                size="small"
                onclick={() => (showPassword = !showPassword)}
              >
                {#if showPassword}
                  <CiEyeClose size={18} />
                {:else}
                  <CiEyeOpen size={18} />
                {/if}
              </CoimIconButton>
            {/snippet}
          </CoimTextField>
          <CoimFormControlLabel label="I accept workspace security terms">
            <CoimCheckbox bind:checked={accept} />
          </CoimFormControlLabel>
          <CoimButton type="submit" variant="contained" size="large" fullWidth>
            Create Account
          </CoimButton>
          <p class="text-text-secondary text-center text-sm">
            Already registered? <CoimLink href="/pages/auth/sign-in">Sign in</CoimLink>
          </p>
        </CoimStack>
      </form>
    </CoimPaper>
  </div>
</CoimAuthLayout>
