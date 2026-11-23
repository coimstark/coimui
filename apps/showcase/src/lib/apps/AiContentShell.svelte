<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import {
    CoimAlert,
    CoimBreadcrumbs,
    CoimButton,
    CoimChip,
    CoimDialog,
    CoimDialogActions,
    CoimDialogContent,
    CoimDialogTitle,
    CoimStack,
    CoimTextField,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import { CiSettings } from "@coimui/svelte/icons";
  import { aiContentStore } from "./ai-content.svelte.ts";

  interface Props {
    title: string;
    subtitle: string;
    children?: Snippet;
  }

  let { title, subtitle, children }: Props = $props();

  let dialogOpen = $state(false);
  let draftEndpoint = $state("");
  let draftModel = $state("");

  $effect(() => {
    aiContentStore.hydrate();
  });

  const navLinks = [
    { label: "Home", href: "/apps/ai-content/home" },
    { label: "Image Studio", href: "/apps/ai-content/ai-image" },
    { label: "Video Studio", href: "/apps/ai-content/ai-video" },
    { label: "Upscale", href: "/apps/ai-content/ai-upscale" },
    { label: "Models", href: "/apps/ai-content/ai-models" },
    { label: "Library", href: "/apps/ai-content/library" },
    { label: "Uploads", href: "/apps/ai-content/uploads" },
    { label: "Learn", href: "/apps/ai-content/learn" },
    { label: "FAQ", href: "/apps/ai-content/faq" },
    { label: "API Access", href: "/apps/ai-content/api-access" },
    { label: "Plans", href: "/apps/ai-content/premium-plans" },
    { label: "Settings", href: "/apps/ai-content/settings" },
  ];

  const currentPath = $derived(page.url.pathname);

  function openDialog() {
    draftEndpoint = aiContentStore.providerEndpoint;
    draftModel = aiContentStore.providerModel;
    dialogOpen = true;
  }

  function handleSave(event: SubmitEvent) {
    event.preventDefault();
    aiContentStore.configureProvider(draftEndpoint, draftModel);
    dialogOpen = false;
    toast.success("Updated media provider endpoint");
  }
</script>

<CoimStack spacing={5}>
  <div class="flex flex-wrap items-start justify-between gap-4">
    <div>
      <CoimBreadcrumbs
        items={[
          { label: "Applications", href: "/apps" },
          { label: "AI Content", href: "/apps/ai-content/home" },
          { label: title },
        ]}
      />
      <div class="mt-2 flex flex-wrap items-center gap-3">
        <CoimTypography variant="h1">{title}</CoimTypography>
        <CoimChip
          label={aiContentStore.isProviderConfigured
            ? `Connected: ${aiContentStore.providerModel}`
            : "Media Provider Not Configured"}
          color={aiContentStore.isProviderConfigured ? "success" : "warning"}
          variant="pastel"
          size="small"
        />
      </div>
      <p class="text-text-secondary mt-1 text-sm">{subtitle}</p>
    </div>

    <CoimButton variant="outlined" size="small" onclick={openDialog}>
      {#snippet startIcon()}
        <CiSettings size={16} />
      {/snippet}
      Configure Media Provider
    </CoimButton>
  </div>

  <nav aria-label="AI Content sections" class="flex flex-wrap gap-2">
    {#each navLinks as item (item.href)}
      <CoimButton
        href={item.href}
        size="small"
        variant={currentPath === item.href ? "contained" : "outlined"}
      >
        {item.label}
      </CoimButton>
    {/each}
  </nav>

  {#if !aiContentStore.isProviderConfigured}
    <CoimAlert severity="warning">
      Media generation requires an external provider endpoint. Parameter controls and library browsing work locally without fabricating media outputs.
    </CoimAlert>
  {/if}

  {@render children?.()}
</CoimStack>

<CoimDialog bind:open={dialogOpen} maxWidth="sm" fullWidth>
  <form onsubmit={handleSave}>
    <CoimDialogTitle>Configure Media Generation Provider</CoimDialogTitle>
    <CoimDialogContent>
      <CoimStack spacing={3}>
        <p class="text-text-secondary text-sm">
          Stored only in browser demonstration state; the static showcase does not dispatch external media generation requests.
        </p>
        <CoimTextField
          label="Provider Endpoint"
          placeholder="https://media-api.example.com/v1/generate"
          bind:value={draftEndpoint}
          fullWidth
          required
        />
        <CoimTextField
          label="Model Identifier"
          placeholder="e.g. vision-studio-v2"
          bind:value={draftModel}
          fullWidth
          required
        />
      </CoimStack>
    </CoimDialogContent>
    <CoimDialogActions>
      {#if aiContentStore.isProviderConfigured}
        <CoimButton
          type="button"
          variant="text"
          color="error"
          onclick={() => {
            aiContentStore.configureProvider("", "");
            dialogOpen = false;
            toast.info("Cleared media provider");
          }}
        >
          Disconnect
        </CoimButton>
      {/if}
      <CoimButton type="button" variant="text" onclick={() => (dialogOpen = false)}>
        Cancel
      </CoimButton>
      <CoimButton type="submit" variant="contained">Save Provider</CoimButton>
    </CoimDialogActions>
  </form>
</CoimDialog>
