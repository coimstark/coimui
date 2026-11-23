<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimStack,
    CoimTextField,
    toast,
  } from "@coimui/svelte";
  import { aiChatStore } from "#lib/apps/ai-chat.svelte.ts";
  import AiChatShell from "#lib/apps/AiChatShell.svelte";

  let query = $state("");

  const matchingThreads = $derived.by(() => {
    const q = query.trim().toLowerCase();
    return aiChatStore.threads.filter((t) => !q || t.title.toLowerCase().includes(q));
  });
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Chat · Recent Chats</title>
</svelte:head>

<AiChatShell
  title="Recent Conversations"
  subtitle="Browse saved conversation history, filter by title, toggle pins, or open any thread."
>
  <CoimStack spacing={4}>
    <CoimTextField label="Search recent threads" placeholder="Filter by title..." bind:value={query} fullWidth />

    <CoimGrid container spacing={3}>
      {#each matchingThreads as thread (thread.id)}
        <CoimGrid size={{ xs: 12, md: 6, lg: 4 }}>
          <CoimCard class="h-full">
            <CoimCardHeader title={thread.title} subheader={`Updated: ${thread.updatedAt}`}>
              {#snippet action()}
                {#if thread.pinned}
                  <CoimChip label="Pinned" size="small" color="primary" variant="pastel" />
                {/if}
              {/snippet}
            </CoimCardHeader>
            <CoimCardContent>
              <CoimStack spacing={3}>
                <p class="text-text-secondary text-sm">
                  {thread.messages[0]?.content ?? "No prompts recorded yet in this conversation."}
                </p>
                <div class="flex flex-wrap gap-2">
                  <CoimButton
                    size="small"
                    variant="contained"
                    onclick={() => {
                      aiChatStore.selectThread(thread.id);
                      void goto("/apps/ai-chat");
                    }}
                  >
                    Open Thread
                  </CoimButton>
                  <CoimButton size="small" variant="outlined" onclick={() => aiChatStore.togglePin(thread.id)}>
                    {thread.pinned ? "Unpin" : "Pin"}
                  </CoimButton>
                  <CoimButton
                    size="small"
                    variant="text"
                    color="error"
                    onclick={() => {
                      aiChatStore.deleteThread(thread.id);
                      toast.info("Deleted conversation");
                    }}
                  >
                    Delete
                  </CoimButton>
                </div>
              </CoimStack>
            </CoimCardContent>
          </CoimCard>
        </CoimGrid>
      {/each}
    </CoimGrid>
  </CoimStack>
</AiChatShell>
