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
  import { aiChatStore } from "#lib/apps/ai-chat.svelte.ts";
  import AiChatShell from "#lib/apps/AiChatShell.svelte";

  let keyLabel = $state("");

  function handleCreateKey(event: SubmitEvent) {
    event.preventDefault();
    const created = aiChatStore.createApiKey(keyLabel);
    keyLabel = "";
    toast.success(`Issued token prefix ${created.prefix}...`);
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Chat · API Access</title>
</svelte:head>

<AiChatShell
  title="API Access &amp; Tokens"
  subtitle="Create and revoke client-scoped bearer prefixes for workspace gateway integration."
>
  <CoimStack spacing={4}>
    <CoimCard>
      <CoimCardHeader title="Create Workspace Key" />
      <CoimCardContent>
        <form class="flex flex-wrap items-end gap-3" onsubmit={handleCreateKey}>
          <div class="min-w-64 flex-1">
            <CoimTextField
              label="Token Label"
              placeholder="e.g. CI Staging Runner"
              bind:value={keyLabel}
              required
              fullWidth
            />
          </div>
          <CoimButton type="submit" variant="contained">Issue Token</CoimButton>
        </form>
      </CoimCardContent>
    </CoimCard>

    <CoimCard>
      <CoimCardHeader title="Active &amp; Revoked Credentials" />
      <CoimCardContent>
        <CoimTableContainer>
          <CoimTable aria-label="AI Chat API Keys">
            <CoimTableHead>
              <CoimTableRow>
                <CoimTableCell component="th">Label</CoimTableCell>
                <CoimTableCell component="th">Prefix</CoimTableCell>
                <CoimTableCell component="th">Created</CoimTableCell>
                <CoimTableCell component="th">Status</CoimTableCell>
                <CoimTableCell component="th" align="right">Actions</CoimTableCell>
              </CoimTableRow>
            </CoimTableHead>
            <CoimTableBody>
              {#each aiChatStore.apiKeys as key (key.id)}
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
                    <div class="flex justify-end gap-2">
                      {#if key.active}
                        <CoimButton size="tiny" variant="outlined" onclick={() => aiChatStore.revokeApiKey(key.id)}>
                          Revoke
                        </CoimButton>
                      {/if}
                      <CoimButton size="tiny" variant="text" color="error" onclick={() => aiChatStore.deleteApiKey(key.id)}>
                        Delete
                      </CoimButton>
                    </div>
                  </CoimTableCell>
                </CoimTableRow>
              {/each}
            </CoimTableBody>
          </CoimTable>
        </CoimTableContainer>
      </CoimCardContent>
    </CoimCard>
  </CoimStack>
</AiChatShell>
