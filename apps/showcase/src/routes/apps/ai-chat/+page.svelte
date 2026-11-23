<script lang="ts">
  import AiChatShell from "#lib/apps/AiChatShell.svelte";
  import AiChatWorkspace from "#lib/apps/AiChatWorkspace.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Chat</title>
</svelte:head>

<AiChatShell
  title="AI Chat Workspace"
  subtitle="Multi-thread prompt workspace, extension catalog, API keys, and explicit provider configuration."
>
  <AiChatWorkspace />
</AiChatShell>
