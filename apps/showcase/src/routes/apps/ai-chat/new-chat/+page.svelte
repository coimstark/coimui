<script lang="ts">
  import { untrack } from "svelte";
  import { aiChatStore } from "#lib/apps/ai-chat.svelte.ts";
  import AiChatShell from "#lib/apps/AiChatShell.svelte";
  import AiChatWorkspace from "#lib/apps/AiChatWorkspace.svelte";

  let initialized = false;
  $effect(() => {
    if (initialized) return;
    initialized = true;
    untrack(() => {
      aiChatStore.hydrate();
      const emptyExisting = aiChatStore.threads.find((t) => t.messages.length === 0);
      if (emptyExisting) {
        aiChatStore.selectThread(emptyExisting.id);
      } else {
        aiChatStore.createThread("New Workspace Prompt");
      }
    });
  });
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Chat · New Chat</title>
</svelte:head>

<AiChatShell
  title="New Conversation"
  subtitle="Compose a fresh prompt thread or connect an inference endpoint."
>
  <AiChatWorkspace />
</AiChatShell>
