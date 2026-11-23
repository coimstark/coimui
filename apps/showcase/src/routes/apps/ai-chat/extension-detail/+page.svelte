<script lang="ts">
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimList,
    CoimListItem,
    CoimListItemText,
    CoimStack,
    toast,
  } from "@coimui/svelte";
  import { aiChatStore } from "#lib/apps/ai-chat.svelte.ts";
  import AiChatShell from "#lib/apps/AiChatShell.svelte";

  const ext = $derived(aiChatStore.selectedExtension);
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Chat · Extension Detail</title>
</svelte:head>

<AiChatShell
  title={ext.name}
  subtitle={`${ext.category} Extension · Release v${ext.version}`}
>
  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, lg: 8 }}>
      <CoimStack spacing={4}>
        <CoimCard>
          <CoimCardHeader title="Extension Capabilities" subheader={ext.summary}>
            {#snippet action()}
              <CoimButton
                variant={ext.installed ? "outlined" : "contained"}
                size="small"
                onclick={() => {
                  aiChatStore.toggleExtension(ext.id);
                  toast.info(ext.installed ? "Extension disabled" : "Extension enabled");
                }}
              >
                {ext.installed ? "Uninstall Extension" : "Install Extension"}
              </CoimButton>
            {/snippet}
          </CoimCardHeader>
          <CoimCardContent>
            <div class="flex flex-wrap gap-2">
              {#each ext.tags as tag (tag)}
                <CoimChip label={tag} size="small" variant="pastel" color="primary" />
              {/each}
            </div>
          </CoimCardContent>
        </CoimCard>

        <CoimCard>
          <CoimCardHeader title="Changelog" subheader="Published adapter revisions" />
          <CoimCardContent>
            <CoimList>
              {#each ext.changelog as entry (entry.version)}
                <CoimListItem>
                  <CoimListItemText
                    primary={`v${entry.version} — ${entry.date}`}
                    secondary={entry.notes}
                  />
                </CoimListItem>
              {/each}
            </CoimList>
          </CoimCardContent>
        </CoimCard>
      </CoimStack>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, lg: 4 }}>
      <CoimCard>
        <CoimCardHeader title="Usage Stats &amp; Compatibility" />
        <CoimCardContent>
          <CoimStack spacing={2}>
            <div class="flex justify-between text-sm">
              <span class="text-text-secondary">Installs</span>
              <span class="font-semibold">{ext.installs}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-text-secondary">Workspace Rating</span>
              <span class="font-semibold">{ext.rating} / 5.0</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-text-secondary">Status</span>
              <CoimChip
                label={ext.installed ? "Active" : "Not Installed"}
                size="small"
                color={ext.installed ? "success" : "grey"}
                variant="pastel"
              />
            </div>
          </CoimStack>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>
  </CoimGrid>
</AiChatShell>
