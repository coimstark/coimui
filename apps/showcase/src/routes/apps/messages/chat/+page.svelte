<script lang="ts">
  import {
    CoimAvatar,
    CoimBadge,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimGrid,
    CoimList,
    CoimListItemButton,
    CoimListItemText,
    CoimPaper,
    CoimStack,
    CoimTextField,
    toast,
  } from "@coimui/svelte";
  import { CiPhoneHandsetOn, CiSendRight } from "@coimui/svelte/icons";
  import { messagesStore } from "#lib/apps/messages.svelte.ts";
  import MessagesShell from "#lib/apps/MessagesShell.svelte";

  let search = $state("");
  let draft = $state("");

  const filteredThreads = $derived.by(() => {
    const q = search.trim().toLowerCase();
    return messagesStore.threads.filter((thr) => {
      if (!q) return true;
      const contact = messagesStore.contactFor(thr.contactId);
      return Boolean(contact?.name.toLowerCase().includes(q));
    });
  });

  const activeContact = $derived(
    messagesStore.activeThread ? messagesStore.contactFor(messagesStore.activeThread.contactId) : undefined,
  );

  function handleSend(event: SubmitEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    messagesStore.sendMessage(draft);
    draft = "";
    toast.success("Message delivered");
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — Messages · Chat</title>
</svelte:head>

<MessagesShell
  title="Conversation Threads"
  subtitle="Select a thread to reply, inspect unread state, or jump to a call."
>
  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, lg: 4 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="Direct Threads" subheader={`${messagesStore.threads.length} conversations`} />
        <CoimCardContent>
          <CoimStack spacing={3}>
            <CoimTextField label="Search teammates" placeholder="Filter by name..." bind:value={search} fullWidth />
            <CoimList>
              {#each filteredThreads as thr (thr.id)}
                {@const contact = messagesStore.contactFor(thr.contactId)}
                <CoimListItemButton
                  selected={messagesStore.activeThread?.id === thr.id}
                  onclick={() => messagesStore.selectThread(thr.id)}
                  class="rounded-lg"
                >
                  {#if contact}
                    <CoimAvatar src={contact.avatar} alt={contact.name} size="small" class="me-3" />
                  {/if}
                  <CoimListItemText
                    primary={contact?.name ?? thr.contactId}
                    secondary={thr.messages.at(-1)?.text ?? "Start messaging"}
                  />
                  {#if thr.unread > 0}
                    <CoimBadge badgeContent={thr.unread} color="primary" />
                  {/if}
                </CoimListItemButton>
              {/each}
            </CoimList>
          </CoimStack>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, lg: 8 }}>
      <CoimCard class="flex h-full flex-col">
        <CoimCardHeader
          title={activeContact?.name ?? "Direct Chat"}
          subheader={activeContact?.role ?? ""}
        >
          {#snippet action()}
            <CoimButton href="/apps/messages/call" size="small" variant="outlined">
              {#snippet startIcon()}
                <CiPhoneHandsetOn size={16} />
              {/snippet}
              Call
            </CoimButton>
          {/snippet}
        </CoimCardHeader>
        <CoimCardContent class="flex flex-1 flex-col justify-between gap-4">
          <CoimStack spacing={2.5} class="min-h-60">
            {#if messagesStore.activeThread}
              {#each messagesStore.activeThread.messages as msg (msg.id)}
                <CoimPaper
                  variant="outlined"
                  class={msg.sender === "me"
                    ? "border-primary/30 bg-primary/10 ms-auto max-w-md rounded-xl p-3"
                    : "bg-grey-25 max-w-md rounded-xl p-3"}
                >
                  <p class="text-sm">{msg.text}</p>
                  <span class="text-text-secondary mt-1 block text-xs">{msg.time}</span>
                </CoimPaper>
              {/each}
            {/if}
          </CoimStack>

          <form class="flex flex-wrap items-end gap-2 border-t border-grey-50 pt-3" onsubmit={handleSend}>
            <div class="min-w-64 flex-1">
              <CoimTextField label="Reply" placeholder="Write a message..." bind:value={draft} fullWidth />
            </div>
            <CoimButton type="submit" variant="contained" disabled={draft.trim().length === 0}>
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
</MessagesShell>
