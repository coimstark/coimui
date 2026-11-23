<script lang="ts">
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimPaper,
    CoimSelect,
    CoimStack,
    CoimTextField,
    toast,
  } from "@coimui/svelte";
  import { supportStore, type SupportIssue } from "#lib/pages/support.svelte.ts";
  import SupportShell from "#lib/pages/SupportShell.svelte";

  const issue = $derived(supportStore.selectedIssue);
  let replyBody = $state("");

  function handleReply(event: SubmitEvent) {
    event.preventDefault();
    if (!replyBody.trim()) return;
    supportStore.addComment(issue.id, "Laura Ellis", replyBody);
    replyBody = "";
    toast.success(`Added reply to ${issue.id}`);
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — Support · {issue.id}</title>
</svelte:head>

<SupportShell title={`${issue.id}: ${issue.title}`} subtitle={`${issue.category} · Reported by ${issue.reporter}`}>
  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, lg: 8 }}>
      <CoimStack spacing={4}>
        <CoimCard>
          <CoimCardHeader title="Issue Description" subheader={`Opened ${issue.createdAt}`} />
          <CoimCardContent>
            <p class="text-sm leading-relaxed">{issue.description}</p>
          </CoimCardContent>
        </CoimCard>

        <CoimCard>
          <CoimCardHeader title="Discussion Thread" subheader={`${issue.comments.length} comment(s)`} />
          <CoimCardContent>
            <CoimStack spacing={3}>
              {#each issue.comments as cmt (cmt.id)}
                <CoimPaper variant="outlined" class="p-3">
                  <div class="flex justify-between text-xs">
                    <strong>{cmt.author}</strong>
                    <span class="text-text-secondary">{cmt.time}</span>
                  </div>
                  <p class="mt-1 text-sm">{cmt.body}</p>
                </CoimPaper>
              {/each}

              <form class="space-y-3" onsubmit={handleReply}>
                <CoimTextField label="Add Update Comment" bind:value={replyBody} multiline rows={3} required fullWidth />
                <CoimButton type="submit" variant="contained" size="small">Post Comment</CoimButton>
              </form>
            </CoimStack>
          </CoimCardContent>
        </CoimCard>
      </CoimStack>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, lg: 4 }}>
      <CoimCard>
        <CoimCardHeader title="Ticket Summary" />
        <CoimCardContent>
          <CoimStack spacing={3}>
            <div class="flex justify-between text-sm">
              <span class="text-text-secondary">Assignee</span>
              <span class="font-medium">{issue.assignee}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-text-secondary">Priority</span>
              <CoimChip label={issue.priority} size="small" variant="pastel" color="warning" />
            </div>
            <CoimSelect
              label="Workflow Status"
              value={issue.status}
              onValueChange={(v) => {
                if (v === "Open" || v === "In Progress" || v === "Resolved") {
                  supportStore.updateStatus(issue.id, v as SupportIssue["status"]);
                  toast.success(`Updated ${issue.id} status to ${v}`);
                }
              }}
              options={[
                { value: "Open", label: "Open" },
                { value: "In Progress", label: "In Progress" },
                { value: "Resolved", label: "Resolved" },
              ]}
              fullWidth
            />
          </CoimStack>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>
  </CoimGrid>
</SupportShell>
