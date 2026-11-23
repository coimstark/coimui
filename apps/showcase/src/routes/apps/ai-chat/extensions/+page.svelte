<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimStack,
    toast,
  } from "@coimui/svelte";
  import { aiChatStore } from "#lib/apps/ai-chat.svelte.ts";
  import AiChatShell from "#lib/apps/AiChatShell.svelte";

  let category = $state("All");
  const categories = ["All", "Data", "Accessibility", "Productivity"];

  const visibleExtensions = $derived(
    category === "All"
      ? aiChatStore.extensions
      : aiChatStore.extensions.filter((e) => e.category === category),
  );
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Chat · Extensions</title>
</svelte:head>

<AiChatShell
  title="Workspace Extensions"
  subtitle="Install or remove schema inspectors, audit adapters, and documentation bridges."
>
  <CoimStack spacing={4}>
    <div class="flex flex-wrap gap-2">
      {#each categories as cat (cat)}
        <CoimButton
          size="small"
          variant={category === cat ? "contained" : "outlined"}
          onclick={() => (category = cat)}
        >
          {cat}
        </CoimButton>
      {/each}
    </div>

    <CoimGrid container spacing={4}>
      {#each visibleExtensions as ext (ext.id)}
        <CoimGrid size={{ xs: 12, md: 4 }}>
          <CoimCard class="flex h-full flex-col justify-between">
            <div>
              <CoimCardHeader title={ext.name} subheader={`${ext.category} · v${ext.version}`}>
                {#snippet action()}
                  <CoimChip
                    label={ext.installed ? "Installed" : "Available"}
                    size="small"
                    color={ext.installed ? "success" : "grey"}
                    variant="pastel"
                  />
                {/snippet}
              </CoimCardHeader>
              <CoimCardContent>
                <p class="text-text-secondary text-sm">{ext.summary}</p>
                <div class="mt-3 flex flex-wrap gap-1.5">
                  {#each ext.tags as tag (tag)}
                    <CoimChip label={tag} size="small" variant="outlined" />
                  {/each}
                </div>
              </CoimCardContent>
            </div>
            <CoimCardActions>
              <CoimButton
                size="small"
                variant={ext.installed ? "outlined" : "contained"}
                onclick={() => {
                  aiChatStore.toggleExtension(ext.id);
                  toast.success(ext.installed ? `Disabled ${ext.name}` : `Enabled ${ext.name}`);
                }}
              >
                {ext.installed ? "Uninstall" : "Install"}
              </CoimButton>
              <CoimButton
                size="small"
                variant="text"
                onclick={() => {
                  aiChatStore.selectExtension(ext.id);
                  void goto("/apps/ai-chat/extension-detail");
                }}
              >
                Inspect Details
              </CoimButton>
            </CoimCardActions>
          </CoimCard>
        </CoimGrid>
      {/each}
    </CoimGrid>
  </CoimStack>
</AiChatShell>
