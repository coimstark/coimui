<script lang="ts">
  import {
    CoimAvatar,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimStack,
    CoimTextField,
    toast,
  } from "@coimui/svelte";
  import { CiHeart } from "@coimui/svelte/icons";
  import { userProfileStore } from "#lib/pages/user.svelte.ts";
  import UserProfileShell from "#lib/pages/UserProfileShell.svelte";

  let postDraft = $state("");

  function submitPost(event: SubmitEvent) {
    event.preventDefault();
    if (!postDraft.trim()) return;
    userProfileStore.addPost(postDraft);
    postDraft = "";
    toast.success("Published workspace update");
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — User Social</title>
</svelte:head>

<UserProfileShell title="Team Social Stream" subtitle="Share release milestones and endorse updates from collaborators.">
  <CoimStack spacing={4}>
    <CoimCard>
      <CoimCardHeader title="Post Update" />
      <CoimCardContent>
        <form class="space-y-3" onsubmit={submitPost}>
          <CoimTextField label="Share an engineering note" bind:value={postDraft} multiline rows={2} required fullWidth />
          <CoimButton type="submit" variant="contained" size="small">Publish Update</CoimButton>
        </form>
      </CoimCardContent>
    </CoimCard>

    {#each userProfileStore.posts as post (post.id)}
      <CoimCard>
        <CoimCardHeader title={post.author} subheader={post.time}>
          {#snippet avatar()}
            <CoimAvatar src={post.avatar} alt={post.author} size="medium" />
          {/snippet}
        </CoimCardHeader>
        <CoimCardContent>
          <p class="text-sm leading-relaxed">{post.content}</p>
          <div class="mt-3">
            <CoimButton
              size="tiny"
              variant={post.liked ? "contained" : "outlined"}
              onclick={() => userProfileStore.toggleLike(post.id)}
            >
              {#snippet startIcon()}
                <CiHeart size={14} />
              {/snippet}
              {post.likes} {post.liked ? "Liked" : "Like"}
            </CoimButton>
          </div>
        </CoimCardContent>
      </CoimCard>
    {/each}
  </CoimStack>
</UserProfileShell>
