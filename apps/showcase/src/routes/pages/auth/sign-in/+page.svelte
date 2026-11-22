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

  let email = $state("laura.ellis@coimui.dev");
  let password = $state("coimui-demo-pass");
  let showPassword = $state(false);
  let remember = $state(true);

  function submitSignIn(event: SubmitEvent) {
    event.preventDefault();
    toast.success("Signed in to CoimUI Showcase");
    void goto("/");
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — Sign In</title>
</svelte:head>

<CoimAuthLayout currentPath="/pages/auth/sign-in">
  <div class="bg-waves flex min-h-screen w-full items-center justify-center p-6">
    <CoimPaper elevation={2} class="bg-background-paper w-full max-w-md rounded-2xl p-8">
      <form onsubmit={submitSignIn}>
        <CoimStack spacing={4}>
          <CoimLogo />
          <div>
            <CoimTypography variant="h1" class="text-2xl">Sign In</CoimTypography>
            <p class="text-text-secondary mt-1 text-sm">Access the CoimUI workspace console.</p>
          </div>
          <CoimTextField
            name="email"
            label="Work Email"
            type="email"
            autocomplete="username"
            bind:value={email}
            required
            fullWidth
          />
          <CoimTextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            autocomplete="current-password"
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
          <div class="flex flex-wrap items-center justify-between gap-2">
            <CoimFormControlLabel label="Remember this device">
              <CoimCheckbox bind:checked={remember} />
            </CoimFormControlLabel>
            <CoimLink href="/pages/auth/forgot-password">Forgot password?</CoimLink>
          </div>
          <CoimButton type="submit" variant="contained" size="large" fullWidth>
            Sign In
          </CoimButton>
          <p class="text-text-secondary text-center text-sm">
            New to CoimUI? <CoimLink href="/pages/auth/sign-up">Create workspace account</CoimLink>
          </p>
        </CoimStack>
      </form>
    </CoimPaper>
  </div>
</CoimAuthLayout>
