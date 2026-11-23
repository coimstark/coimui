<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimList,
    CoimListItemButton,
    CoimListItemText,
    CoimStack,
  } from "@coimui/svelte";
  import { CoimBarChart } from "@coimui/svelte/charts";
  import { supportStore } from "#lib/pages/support.svelte.ts";
  import SupportShell from "#lib/pages/SupportShell.svelte";

  const weeklyVolume = [
    { day: "Mon", opened: 14, closed: 11 },
    { day: "Tue", opened: 18, closed: 16 },
    { day: "Wed", opened: 12, closed: 15 },
    { day: "Thu", opened: 9, closed: 13 },
    { day: "Fri", opened: 11, closed: 14 },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Support · Overview</title>
</svelte:head>

<SupportShell title="Support Overview" subtitle="Queue metrics, weekly ticket throughput, and top assignees.">
  <CoimStack spacing={4}>
    <CoimGrid container spacing={4}>
      <CoimGrid size={{ xs: 12, sm: 4 }}>
        <CoimCard>
          <CoimCardHeader title="Open &amp; Active" />
          <CoimCardContent>
            <p class="font-heading text-3xl font-bold">
              {supportStore.issues.filter((i) => i.status !== "Resolved").length}
            </p>
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
      <CoimGrid size={{ xs: 12, sm: 4 }}>
        <CoimCard>
          <CoimCardHeader title="Resolved" />
          <CoimCardContent>
            <p class="font-heading text-3xl font-bold">
              {supportStore.issues.filter((i) => i.status === "Resolved").length}
            </p>
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
      <CoimGrid size={{ xs: 12, sm: 4 }}>
        <CoimCard>
          <CoimCardHeader title="High Priority" />
          <CoimCardContent>
            <p class="font-heading text-3xl font-bold">
              {supportStore.issues.filter((i) => i.priority === "High").length}
            </p>
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
    </CoimGrid>

    <CoimGrid container spacing={4}>
      <CoimGrid size={{ xs: 12, lg: 6 }}>
        <CoimCard class="h-full">
          <CoimCardHeader title="Weekly Opened vs Closed Tickets" />
          <CoimCardContent>
            <CoimBarChart
              data={weeklyVolume}
              xKey="day"
              series={[
                { key: "opened", label: "Opened" },
                { key: "closed", label: "Closed" },
              ]}
              height={220}
            />
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>

      <CoimGrid size={{ xs: 12, lg: 6 }}>
        <CoimCard class="h-full">
          <CoimCardHeader title="Recent Issues">
            {#snippet action()}
              <CoimButton href="/pages/support/add-issue" size="tiny" variant="contained">New Issue</CoimButton>
            {/snippet}
          </CoimCardHeader>
          <CoimCardContent>
            <CoimList>
              {#each supportStore.issues as issue (issue.id)}
                <CoimListItemButton
                  onclick={() => {
                    supportStore.selectIssue(issue.id);
                    void goto("/pages/support/issue-detail");
                  }}
                >
                  <CoimListItemText
                    primary={`${issue.id}: ${issue.title}`}
                    secondary={`${issue.category} · Assignee: ${issue.assignee}`}
                  />
                  <CoimChip label={issue.status} size="small" variant="pastel" color={issue.status === "Resolved" ? "success" : "primary"} />
                </CoimListItemButton>
              {/each}
            </CoimList>
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
    </CoimGrid>
  </CoimStack>
</SupportShell>
