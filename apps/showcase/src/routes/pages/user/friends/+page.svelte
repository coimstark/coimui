<script lang="ts">
  import {
    CoimAvatar,
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimGrid,
    CoimTextField,
    toast,
  } from "@coimui/svelte";
  import { userProfileStore } from "#lib/pages/user.svelte.ts";
  import UserProfileShell from "#lib/pages/UserProfileShell.svelte";

  let query = $state("");
  const visibleFriends = $derived(
    userProfileStore.friends.filter((f) =>
      !query.trim() || f.name.toLowerCase().includes(query.trim().toLowerCase()),
    ),
  );
</script>

<svelte:head>
  <title>CoimUI Showcase — User Friends</title>
</svelte:head>

<UserProfileShell title="Connections &amp; Team" subtitle="Search colleagues and manage direct network connections.">
  <CoimTextField label="Filter teammates" placeholder="Search by name..." bind:value={query} fullWidth />

  <CoimGrid container spacing={4}>
    {#each visibleFriends as person (person.id)}
      <CoimGrid size={{ xs: 12, sm: 6, lg: 3 }}>
        <CoimCard class="flex h-full flex-col justify-between">
          <div>
            <CoimCardHeader title={person.name} subheader={person.role}>
              {#snippet avatar()}
                <CoimAvatar src={person.avatar} alt={person.name} size="medium" />
              {/snippet}
            </CoimCardHeader>
            <CoimCardContent>
              <p class="text-text-secondary text-xs">{person.mutuals} mutual teammates</p>
            </CoimCardContent>
          </div>
          <CoimCardActions>
            <CoimButton
              size="small"
              variant={person.connected ? "outlined" : "contained"}
              fullWidth
              onclick={() => {
                userProfileStore.toggleFriend(person.id);
                toast.info(person.connected ? `Removed ${person.name}` : `Connected with ${person.name}`);
              }}
            >
              {person.connected ? "Connected" : "Connect"}
            </CoimButton>
          </CoimCardActions>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>
</UserProfileShell>
