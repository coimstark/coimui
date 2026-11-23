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
  import { CiSettings, CiSparkle } from "@coimui/svelte/icons";
  import { aiChatStore } from "./ai-chat.svelte.ts";

  interface Props {
    title: string;
    subtitle: string;
    children?: Snippet;
  }

  let { title, subtitle, children }: Props = $props();

  let providerModalOpen = $state(false);
  let draftLabel = $state("");
  let draftEndpoint = $state("");
  let draftModel = $state("");
  let draftApiKey = $state("");

  $effect(() => {
    aiChatStore.hydrate();
  });

  const navItems = [
    { label: "Workspace", href: "/apps/ai-chat" },
    { label: "New Chat", href: "/apps/ai-chat/new-chat" },
    { label: "Recent Chats", href: "/apps/ai-chat/recent-chat" },
    { label: "Extensions", href: "/apps/ai-chat/extensions" },
    { label: "Extension Detail", href: "/apps/ai-chat/extension-detail" },
    { label: "API Access", href: "/apps/ai-chat/api-access" },
    { label: "Plans", href: "/apps/ai-chat/premium-plans" },
    { label: "Settings", href: "/apps/ai-chat/settings" },
  ];

  const currentPath = $derived(page.url.pathname);

  function openProviderDialog() {
    draftLabel = aiChatStore.provider.label;
    draftEndpoint = aiChatStore.provider.endpoint;
    draftModel = aiChatStore.provider.model;
    draftApiKey = aiChatStore.provider.apiKey;
    providerModalOpen = true;
  }

  function saveProvider(event: SubmitEvent) {
    event.preventDefault();
    aiChatStore.saveProviderConfig({
      label: draftLabel,
      endpoint: draftEndpoint,
      model: draftModel,
      apiKey: draftApiKey,
    });
    providerModalOpen = false;
    toast.success("Saved AI Chat provider configuration");
  }
</script>

<CoimStack spacing={5}>
  <div class="flex flex-wrap items-start justify-between gap-4">
    <div>
      <CoimBreadcrumbs
        items={[
          { label: "Applications", href: "/apps" },
          { label: "AI Chat", href: "/apps/ai-chat" },
          { label: title },
        ]}
      />
      <div class="mt-2 flex flex-wrap items-center gap-3">
        <CoimTypography variant="h1">{title}</CoimTypography>
        <CoimChip
          label={aiChatStore.isProviderConfigured
            ? `Provider: ${aiChatStore.provider.label || aiChatStore.provider.model}`
            : "Provider Not Configured"}
          color={aiChatStore.isProviderConfigured ? "success" : "warning"}
          variant="pastel"
          size="small"
        />
      </div>
      <p class="text-text-secondary mt-1 text-sm">{subtitle}</p>
    </div>

    <div class="flex flex-wrap gap-2">
      <CoimButton variant="outlined" size="small" onclick={openProviderDialog}>
        {#snippet startIcon()}
          <CiSettings size={16} />
        {/snippet}
        Configure Provider
      </CoimButton>
    </div>
  </div>

  <nav aria-label="AI Chat sections" class="flex flex-wrap gap-2">
    {#each navItems as item (item.href)}
      <CoimButton
        href={item.href}
        size="small"
        variant={currentPath === item.href ? "contained" : "outlined"}
      >
        {item.label}
      </CoimButton>
    {/each}
  </nav>

  {#if !aiChatStore.isProviderConfigured}
    <CoimAlert severity="warning">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span>
          No AI inference provider is configured. Conversations and keys manage local state cleanly without fabricated AI replies.
        </span>
        <CoimButton size="tiny" variant="outlined" onclick={openProviderDialog}>
          Connect Provider
        </CoimButton>
      </div>
    </CoimAlert>
  {/if}

  {@render children?.()}
</CoimStack>

<CoimDialog bind:open={providerModalOpen} maxWidth="sm" fullWidth>
  <form onsubmit={saveProvider}>
    <CoimDialogTitle>Configure Inference Provider</CoimDialogTitle>
    <CoimDialogContent>
      <CoimStack spacing={3}>
        <p class="text-text-secondary text-sm">
          Supply a provider endpoint and model identifier to mark provider state configured in local browser demo storage (no live remote HTTP calls are dispatched by the static showcase).
        </p>
        <CoimTextField label="Provider Name" placeholder="e.g. Custom Gateway" bind:value={draftLabel} fullWidth />
        <CoimTextField label="API Endpoint URL" placeholder="https://api.example.com/v1/chat" bind:value={draftEndpoint} fullWidth required />
        <CoimTextField label="Model ID" placeholder="e.g. reasoning-v1" bind:value={draftModel} fullWidth required />
        <CoimTextField label="API Key (optional in staging)" type="password" bind:value={draftApiKey} fullWidth />
      </CoimStack>
    </CoimDialogContent>
    <CoimDialogActions>
      {#if aiChatStore.isProviderConfigured}
        <CoimButton
          type="button"
          variant="text"
          color="error"
          onclick={() => {
            aiChatStore.clearProviderConfig();
            providerModalOpen = false;
            toast.info("Cleared provider configuration");
          }}
        >
          Disconnect
        </CoimButton>
      {/if}
      <CoimButton type="button" variant="text" onclick={() => (providerModalOpen = false)}>
        Cancel
      </CoimButton>
      <CoimButton type="submit" variant="contained">
        {#snippet startIcon()}
          <CiSparkle size={16} />
        {/snippet}
        Save Provider
      </CoimButton>
    </CoimDialogActions>
  </form>
</CoimDialog>
