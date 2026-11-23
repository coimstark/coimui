<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimDialog,
    CoimDialogActions,
    CoimDialogContent,
    CoimDialogTitle,
    CoimStack,
    CoimTextField,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import { CiUserPlus } from "@coimui/svelte/icons";
  import { messagesStore } from "./messages.svelte.ts";

  interface Props {
    title: string;
    subtitle: string;
    children?: Snippet;
  }

  let { title, subtitle, children }: Props = $props();

  let addContactOpen = $state(false);
  let contactName = $state("");
  let contactEmail = $state("");
  let contactRole = $state("");

  $effect(() => {
    messagesStore.hydrate();
  });

  const navLinks = [
    { label: "Home", href: "/apps/messages/home" },
    { label: "Chat", href: "/apps/messages/chat" },
    { label: "New Chat", href: "/apps/messages/chat-new" },
    { label: "Voice & Video Call", href: "/apps/messages/call" },
  ];

  const currentPath = $derived(page.url.pathname);

  function submitContact(event: SubmitEvent) {
    event.preventDefault();
    if (!contactName.trim() || !contactEmail.trim()) return;
    const added = messagesStore.addContact(contactName, contactEmail, contactRole);
    contactName = "";
    contactEmail = "";
    contactRole = "";
    addContactOpen = false;
    toast.success(`Added contact ${added.name}`);
  }
</script>

<CoimStack spacing={5}>
  <div class="flex flex-wrap items-start justify-between gap-4">
    <div>
      <CoimBreadcrumbs
        items={[
          { label: "Applications", href: "/apps" },
          { label: "Messages", href: "/apps/messages/chat" },
          { label: title },
        ]}
      />
      <CoimTypography variant="h1" class="mt-2">{title}</CoimTypography>
      <p class="text-text-secondary mt-1 text-sm">{subtitle}</p>
    </div>

    <CoimButton variant="contained" size="small" onclick={() => (addContactOpen = true)}>
      {#snippet startIcon()}
        <CiUserPlus size={16} />
      {/snippet}
      Add Contact
    </CoimButton>
  </div>

  <nav aria-label="Messages sections" class="flex flex-wrap gap-2">
    {#each navLinks as link (link.href)}
      <CoimButton
        href={link.href}
        size="small"
        variant={currentPath === link.href || (currentPath === "/apps/messages" && link.href === "/apps/messages/chat")
          ? "contained"
          : "outlined"}
      >
        {link.label}
      </CoimButton>
    {/each}
  </nav>

  {@render children?.()}
</CoimStack>

<CoimDialog bind:open={addContactOpen} maxWidth="xs" fullWidth>
  <form onsubmit={submitContact}>
    <CoimDialogTitle>Add Workspace Contact</CoimDialogTitle>
    <CoimDialogContent>
      <CoimStack spacing={3}>
        <CoimTextField label="Full Name" bind:value={contactName} required fullWidth />
        <CoimTextField label="Email" type="email" bind:value={contactEmail} required fullWidth />
        <CoimTextField label="Role" placeholder="e.g. Product Manager" bind:value={contactRole} fullWidth />
      </CoimStack>
    </CoimDialogContent>
    <CoimDialogActions>
      <CoimButton type="button" variant="text" onclick={() => (addContactOpen = false)}>Cancel</CoimButton>
      <CoimButton type="submit" variant="contained">Save Contact</CoimButton>
    </CoimDialogActions>
  </form>
</CoimDialog>
