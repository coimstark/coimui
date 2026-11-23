<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimAvatar,
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
  } from "@coimui/svelte";
  import { messagesStore } from "#lib/apps/messages.svelte.ts";
  import MessagesShell from "#lib/apps/MessagesShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — Messages</title>
</svelte:head>

<MessagesShell
  title="Messages &amp; Calls Hub"
  subtitle="Direct team messaging, contact directory, new thread launcher, and voice/video controls."
>
  <CoimGrid container spacing={4}>
    {#each messagesStore.contacts as contact (contact.id)}
      <CoimGrid size={{ xs: 12, md: 4 }}>
        <CoimCard class="flex h-full flex-col justify-between">
          <div>
            <CoimCardHeader title={contact.name} subheader={contact.role}>
              {#snippet avatar()}
                <CoimAvatar src={contact.avatar} alt={contact.name} size="medium" />
              {/snippet}
              {#snippet action()}
                <CoimChip
                  label={contact.online ? "Online" : "Offline"}
                  color={contact.online ? "success" : "grey"}
                  size="small"
                  variant="pastel"
                />
              {/snippet}
            </CoimCardHeader>
            <CoimCardContent>
              <p class="text-text-secondary text-xs">{contact.email}</p>
            </CoimCardContent>
          </div>
          <CoimCardActions>
            <CoimButton
              size="small"
              variant="contained"
              onclick={() => {
                messagesStore.startChat(contact.id);
                void goto("/apps/messages/chat");
              }}
            >
              Message
            </CoimButton>
            <CoimButton href="/apps/messages/call" size="small" variant="outlined">
              Call
            </CoimButton>
          </CoimCardActions>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>
</MessagesShell>
