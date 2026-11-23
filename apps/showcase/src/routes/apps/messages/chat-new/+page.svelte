<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimSelect,
    CoimStack,
    CoimTextField,
    toast,
  } from "@coimui/svelte";
  import { messagesStore } from "#lib/apps/messages.svelte.ts";
  import MessagesShell from "#lib/apps/MessagesShell.svelte";

  let contactId = $state("");
  let greeting = $state("Hey, do you have a minute to review the release checklist?");

  $effect.pre(() => {
    if (!contactId && messagesStore.contacts[0]) {
      contactId = messagesStore.contacts[0].id;
    }
  });

  function handleStart(event: SubmitEvent) {
    event.preventDefault();
    if (!contactId) return;
    messagesStore.startChat(contactId, greeting);
    toast.success("Started direct conversation");
    void goto("/apps/messages/chat");
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — Messages · New Chat</title>
</svelte:head>

<MessagesShell title="Start New Conversation" subtitle="Pick a contact and compose the opening message.">
  <CoimCard class="max-w-xl">
    <CoimCardHeader title="New Direct Message" />
    <CoimCardContent>
      <form onsubmit={handleStart}>
        <CoimStack spacing={3}>
          <CoimSelect
            label="Recipient"
            value={contactId}
            onValueChange={(v) => {
              if (typeof v === "string") contactId = v;
            }}
            options={messagesStore.contacts.map((c) => ({ value: c.id, label: `${c.name} (${c.role})` }))}
            fullWidth
          />
          <CoimTextField label="Initial Message" bind:value={greeting} multiline rows={3} fullWidth required />
          <div class="flex gap-2">
            <CoimButton type="submit" variant="contained">Start Chat</CoimButton>
            <CoimButton href="/apps/messages/chat" variant="outlined">Cancel</CoimButton>
          </div>
        </CoimStack>
      </form>
    </CoimCardContent>
  </CoimCard>
</MessagesShell>
