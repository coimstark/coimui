<script lang="ts">
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimStack,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTableRow,
    CoimTextField,
    toast,
  } from "@coimui/svelte";
  import { aiContentStore } from "#lib/apps/ai-content.svelte.ts";
  import AiContentShell from "#lib/apps/AiContentShell.svelte";

  let keyLabel = $state("");

  function submitKey(event: SubmitEvent) {
    event.preventDefault();
    const created = aiContentStore.createApiKey(keyLabel);
    keyLabel = "";
    toast.success(`Issued media API token ${created.prefix}...`);
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Content · API Access</title>
</svelte:head>

<AiContentShell title="Media Pipeline API Access" subtitle="Manage tokens for batch image, video, and upscale jobs.">
  <CoimStack spacing={4}>
    <CoimCard>
      <CoimCardHeader title="Create Media API Key" />
      <CoimCardContent>
        <form class="flex flex-wrap items-end gap-3" onsubmit={submitKey}>
          <div class="min-w-64 flex-1">
            <CoimTextField label="Key Name" placeholder="e.g. Render Worker Pool" bind:value={keyLabel} required fullWidth />
          </div>
          <CoimButton type="submit" variant="contained">Generate Token</CoimButton>
        </form>
      </CoimCardContent>
    </CoimCard>

    <CoimCard>
      <CoimCardHeader title="Media Keys" />
      <CoimCardContent>
        <CoimTableContainer>
          <CoimTable aria-label="AI Content API Keys">
            <CoimTableHead>
              <CoimTableRow>
                <CoimTableCell component="th">Name</CoimTableCell>
                <CoimTableCell component="th">Prefix</CoimTableCell>
                <CoimTableCell component="th">Created</CoimTableCell>
                <CoimTableCell component="th">Status</CoimTableCell>
                <CoimTableCell component="th" align="right">Actions</CoimTableCell>
              </CoimTableRow>
            </CoimTableHead>
            <CoimTableBody>
              {#each aiContentStore.apiKeys as key (key.id)}
                <CoimTableRow>
                  <CoimTableCell>{key.label}</CoimTableCell>
                  <CoimTableCell><code class="font-mono text-xs">{key.prefix}...</code></CoimTableCell>
                  <CoimTableCell>{key.createdAt}</CoimTableCell>
                  <CoimTableCell>
                    <CoimChip
                      label={key.active ? "Active" : "Revoked"}
                      color={key.active ? "success" : "grey"}
                      size="small"
                      variant="pastel"
                    />
                  </CoimTableCell>
                  <CoimTableCell align="right">
                    {#if key.active}
                      <CoimButton size="tiny" variant="outlined" onclick={() => aiContentStore.revokeApiKey(key.id)}>
                        Revoke
                      </CoimButton>
                    {/if}
                  </CoimTableCell>
                </CoimTableRow>
              {/each}
            </CoimTableBody>
          </CoimTable>
        </CoimTableContainer>
      </CoimCardContent>
    </CoimCard>
  </CoimStack>
</AiContentShell>
