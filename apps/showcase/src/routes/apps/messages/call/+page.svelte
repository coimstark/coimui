<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimAvatar,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimStack,
    toast,
  } from "@coimui/svelte";
  import {
    CiMicrophone,
    CiMicrophoneInactive,
    CiPhoneHandsetOff,
    CiShare,
  } from "@coimui/svelte/icons";
  import { messagesStore } from "#lib/apps/messages.svelte.ts";
  import MessagesShell from "#lib/apps/MessagesShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — Messages · Call</title>
</svelte:head>

<MessagesShell title="Active Voice &amp; Video Session" subtitle="Interactive local call-control demonstration (no live audio/video transport is connected).">
  <CoimStack spacing={4}>
    <CoimGrid container spacing={4}>
      {#each messagesStore.contacts.slice(0, 3) as participant (participant.id)}
        <CoimGrid size={{ xs: 12, md: 4 }}>
          <CoimCard class="h-full text-center">
            <CoimCardHeader title={participant.name} subheader={participant.role} />
            <CoimCardContent>
              <CoimStack spacing={2} class="items-center">
                <CoimAvatar src={participant.avatar} alt={participant.name} size="large" />
                <CoimChip
                  label={messagesStore.videoEnabled ? "Camera Active" : "Audio Only"}
                  color={messagesStore.videoEnabled ? "success" : "grey"}
                  size="small"
                  variant="pastel"
                />
              </CoimStack>
            </CoimCardContent>
          </CoimCard>
        </CoimGrid>
      {/each}
    </CoimGrid>

    <CoimCard>
      <CoimCardContent>
        <div class="flex flex-wrap items-center justify-center gap-3 py-2">
          <CoimButton
            variant={messagesStore.micMuted ? "contained" : "outlined"}
            color={messagesStore.micMuted ? "warning" : "primary"}
            onclick={() => {
              messagesStore.micMuted = !messagesStore.micMuted;
              toast.info(messagesStore.micMuted ? "Microphone muted" : "Microphone unmuted");
            }}
          >
            {#snippet startIcon()}
              {#if messagesStore.micMuted}
                <CiMicrophoneInactive size={16} />
              {:else}
                <CiMicrophone size={16} />
              {/if}
            {/snippet}
            {messagesStore.micMuted ? "Unmute Mic" : "Mute Mic"}
          </CoimButton>

          <CoimButton
            variant="outlined"
            onclick={() => {
              messagesStore.videoEnabled = !messagesStore.videoEnabled;
              toast.info(messagesStore.videoEnabled ? "Camera enabled" : "Camera paused");
            }}
          >
            {messagesStore.videoEnabled ? "Turn Off Camera" : "Turn On Camera"}
          </CoimButton>

          <CoimButton
            variant={messagesStore.screenSharing ? "contained" : "outlined"}
            onclick={() => {
              messagesStore.screenSharing = !messagesStore.screenSharing;
              toast.info(messagesStore.screenSharing ? "Screen sharing active" : "Stopped screen share");
            }}
          >
            {#snippet startIcon()}
              <CiShare size={16} />
            {/snippet}
            {messagesStore.screenSharing ? "Stop Share" : "Share Screen"}
          </CoimButton>

          <CoimButton
            variant="contained"
            color="error"
            onclick={() => {
              toast.info("Call ended");
              void goto("/apps/messages/chat");
            }}
          >
            {#snippet startIcon()}
              <CiPhoneHandsetOff size={16} />
            {/snippet}
            End Call
          </CoimButton>
        </div>
      </CoimCardContent>
    </CoimCard>
  </CoimStack>
</MessagesShell>
