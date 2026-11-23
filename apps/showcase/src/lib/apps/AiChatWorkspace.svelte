<script lang="ts">
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimIconButton,
    CoimList,
    CoimListItemButton,
    CoimListItemText,
    CoimPaper,
    CoimStack,
    CoimTextField,
    toast,
  } from "@coimui/svelte";
  import { CiBinEmpty, CiPin, CiPlus, CiSendRight } from "@coimui/svelte/icons";
  import { aiChatStore } from "./ai-chat.svelte.ts";

  let threadSearch = $state("");
  let promptDraft = $state("");
  let editingTitleId = $state<string | null>(null);
  let titleDraft = $state("");

  const filteredThreads = $derived.by(() => {
    const q = threadSearch.trim().toLowerCase();
    const list = !q
      ? aiChatStore.threads
      : aiChatStore.threads.filter((t) => t.title.toLowerCase().includes(q));
    return [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned));
  });

  function handleNewThread() {
    const created = aiChatStore.createThread("New Workspace Thread");
    toast.success(`Created "${created.title}"`);
  }

  function startRename(id: string, currentTitle: string) {
    editingTitleId = id;
    titleDraft = currentTitle;
  }

  function saveRename(id: string) {
    aiChatStore.renameThread(id, titleDraft);
    editingTitleId = null;
    toast.info("Renamed conversation");
  }

  function handleSend(event: SubmitEvent) {
    event.preventDefault();
    const res = aiChatStore.submitPrompt(promptDraft);
    if (!promptDraft.trim()) return;
    promptDraft = "";
    if (!res.sent && res.reason) {
      toast.warning(res.reason);
    } else {
      toast.success("Saved prompt to local demo workspace (no live network call dispatched)");
    }
  }
</script>

<CoimGrid container spacing={4}>
  <CoimGrid size={{ xs: 12, lg: 4 }}>
    <CoimCard class="h-full">
      <CoimCardHeader title="Conversations" subheader={`${aiChatStore.threads.length} workspace threads`}>
        {#snippet action()}
          <CoimButton size="tiny" variant="contained" onclick={handleNewThread}>
            {#snippet startIcon()}
              <CiPlus size={14} />
            {/snippet}
            New Chat
          </CoimButton>
        {/snippet}
      </CoimCardHeader>
      <CoimCardContent>
        <CoimStack spacing={3}>
          <CoimTextField
            label="Filter threads"
            placeholder="Search conversations..."
            bind:value={threadSearch}
            fullWidth
          />

          <CoimList>
            {#each filteredThreads as thread (thread.id)}
              <li class="mb-1.5 list-none">
                <CoimListItemButton
                  disableListItemWrapper
                  selected={aiChatStore.activeThread?.id === thread.id}
                  onclick={() => aiChatStore.selectThread(thread.id)}
                  class="rounded-lg"
                >
                  <CoimListItemText
                    primary={thread.title}
                    secondary={`${thread.messages.length} msg · ${thread.updatedAt}`}
                  />
                  {#if thread.pinned}
                    <CoimChip label="Pinned" size="small" color="primary" variant="pastel" />
                  {/if}
                </CoimListItemButton>

                <div class="mt-1 flex items-center justify-end gap-1 px-2">
                  {#if editingTitleId === thread.id}
                    <input
                      type="text"
                      aria-label={`Rename ${thread.title}`}
                      bind:value={titleDraft}
                      class="border-grey-200 bg-background-paper flex-1 rounded border px-2 py-0.5 text-xs"
                    />
                    <CoimButton size="tiny" variant="text" onclick={() => saveRename(thread.id)}>
                      Save
                    </CoimButton>
                  {:else}
                    <CoimButton
                      size="tiny"
                      variant="text"
                      onclick={() => startRename(thread.id, thread.title)}
                    >
                      Rename
                    </CoimButton>
                  {/if}
                  <CoimIconButton
                    size="tiny"
                    aria-label={thread.pinned ? `Unpin ${thread.title}` : `Pin ${thread.title}`}
                    onclick={() => aiChatStore.togglePin(thread.id)}
                  >
                    <CiPin size={14} />
                  </CoimIconButton>
                  <CoimIconButton
                    size="tiny"
                    aria-label={`Delete ${thread.title}`}
                    onclick={() => {
                      aiChatStore.deleteThread(thread.id);
                      toast.info("Deleted thread");
                    }}
                  >
                    <CiBinEmpty size={14} />
                  </CoimIconButton>
                </div>
              </li>
            {/each}
          </CoimList>
        </CoimStack>
      </CoimCardContent>
    </CoimCard>
  </CoimGrid>

  <CoimGrid size={{ xs: 12, lg: 8 }}>
    <CoimCard class="flex h-full flex-col">
      <CoimCardHeader
        title={aiChatStore.activeThread?.title ?? "Select or create a conversation"}
        subheader={aiChatStore.isProviderConfigured
          ? `Connected model: ${aiChatStore.provider.model}`
          : "Prompt recording active — external AI responses require provider configuration"}
      />
      <CoimCardContent class="flex flex-1 flex-col justify-between gap-4">
        <CoimStack spacing={3} class="min-h-64">
          {#if !aiChatStore.activeThread || aiChatStore.activeThread.messages.length === 0}
            <CoimPaper variant="outlined" class="p-6 text-center">
              <p class="font-medium">Ready for a new workspace thread</p>
              <p class="text-text-secondary mt-1 text-sm">
                Start with a prompt below, install extensions, or connect your preferred inference endpoint.
              </p>
              <div class="mt-3 flex flex-wrap justify-center gap-2">
                <CoimButton
                  size="small"
                  variant="outlined"
                  onclick={() => (promptDraft = "Audit dark-mode card tokens across Showcase")}
                >
                  Token Audit Prompt
                </CoimButton>
                <CoimButton
                  size="small"
                  variant="outlined"
                  onclick={() => (promptDraft = "Draft release notes for v1.0.1 DataGrid capabilities")}
                >
                  Release Summary Prompt
                </CoimButton>
              </div>
            </CoimPaper>
          {:else}
            {#each aiChatStore.activeThread.messages as msg (msg.id)}
              <CoimPaper
                variant="outlined"
                class={msg.role === "user"
                  ? "border-primary/30 bg-primary/5 ms-auto max-w-2xl p-3"
                  : "bg-grey-25 max-w-2xl p-3"}
              >
                <div class="mb-1 flex items-center justify-between gap-3 text-xs">
                  <span class="font-semibold uppercase">
                    {msg.role === "user" ? "You" : "Provider Notice"}
                  </span>
                  <span class="text-text-secondary">{msg.createdAt}</span>
                </div>
                <p class="text-sm leading-relaxed">{msg.content}</p>
              </CoimPaper>
            {/each}
          {/if}
        </CoimStack>

        <form class="flex flex-wrap items-end gap-2 border-t border-grey-50 pt-3" onsubmit={handleSend}>
          <div class="min-w-64 flex-1">
            <CoimTextField
              label="Message Prompt"
              placeholder={aiChatStore.isProviderConfigured
                ? "Send a prompt to your configured provider..."
                : "Enter prompt (provider not configured: saved without fabricated AI reply)"}
              bind:value={promptDraft}
              fullWidth
            />
          </div>
          <CoimButton type="submit" variant="contained" disabled={promptDraft.trim().length === 0}>
            {#snippet startIcon()}
              <CiSendRight size={16} />
            {/snippet}
            Send
          </CoimButton>
        </form>
      </CoimCardContent>
    </CoimCard>
  </CoimGrid>
</CoimGrid>
