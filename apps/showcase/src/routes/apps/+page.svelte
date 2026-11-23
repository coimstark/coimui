<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimGrid,
    CoimStack,
    CoimTypography,
  } from "@coimui/svelte";

  const apps = [
    { title: "AI Chat Workspace", desc: "Conversations, extensions, API keys & explicit provider settings.", href: "/apps/ai-chat" },
    { title: "AI Content Studio", desc: "Image, video, upscale pipelines, model catalog, library & uploads.", href: "/apps/ai-content/home" },
    { title: "Cloud Drive", desc: "Folders, uploads, favorites, labels, shared workspaces, spam & trash.", href: "/apps/drive/home" },
    { title: "Messages & Calls", desc: "Contacts, interactive conversation threads & demo call controls.", href: "/apps/messages/chat" },
    { title: "Team Calendar", desc: "Full interactive schedule views & event composer.", href: "/apps/calendar/home" },
    { title: "Kanban Board", desc: "Reorderable multi-column agile task workspace.", href: "/apps/kanban" },
    { title: "Billing & Invoices", desc: "Interactive enterprise invoice grid & print view.", href: "/apps/invoices" },
    { title: "Unified Inbox", desc: "Sortable team mail and triage drawer.", href: "/apps/mail" },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Applications Hub</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Applications" }]} />
    <CoimTypography variant="h1" class="mt-2">Workspace Applications</CoimTypography>
    <p class="text-text-secondary mt-1">
      Interactive client-side application demonstrations powered by <code>@coimui/svelte</code> using local workspace state without live backend services.
    </p>
  </div>

  <CoimGrid container spacing={4}>
    {#each apps as app (app.href)}
      <CoimGrid size={{ xs: 12, sm: 6, lg: 3 }}>
        <CoimCard class="flex h-full flex-col justify-between">
          <div>
            <CoimCardHeader title={app.title} />
            <CoimCardContent>
              <p class="text-text-secondary text-sm">{app.desc}</p>
            </CoimCardContent>
          </div>
          <CoimCardActions>
            <CoimButton href={app.href} size="small" variant="contained" fullWidth>Launch App</CoimButton>
          </CoimCardActions>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>
</CoimStack>
