<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimStack,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTableRow,
    CoimTextField,
  } from "@coimui/svelte";
  import { supportStore } from "#lib/pages/support.svelte.ts";
  import SupportShell from "#lib/pages/SupportShell.svelte";

  let query = $state("");
  let statusFilter = $state<"All" | "Open" | "In Progress" | "Resolved">("All");

  const filtered = $derived.by(() => {
    const q = query.trim().toLowerCase();
    return supportStore.issues.filter((i) => {
      if (statusFilter !== "All" && i.status !== statusFilter) return false;
      if (q && !i.title.toLowerCase().includes(q) && !i.id.toLowerCase().includes(q)) return false;
      return true;
    });
  });
</script>

<svelte:head>
  <title>CoimUI Showcase — Support · Issues</title>
</svelte:head>

<SupportShell title="Issues Queue" subtitle="Search tickets by ID or summary and filter by triage state.">
  <CoimStack spacing={4}>
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div class="min-w-64 flex-1">
        <CoimTextField label="Search issues" placeholder="Ticket ID or title..." bind:value={query} fullWidth />
      </div>
      <div class="flex flex-wrap gap-2">
        {#each (["All", "Open", "In Progress", "Resolved"] as const) as st (st)}
          <CoimButton size="small" variant={statusFilter === st ? "contained" : "outlined"} onclick={() => (statusFilter = st)}>
            {st}
          </CoimButton>
        {/each}
      </div>
    </div>

    <CoimCard>
      <CoimCardHeader title="Tracked Issues" />
      <CoimCardContent>
        <CoimTableContainer>
          <CoimTable aria-label="Support issues">
            <CoimTableHead>
              <CoimTableRow>
                <CoimTableCell component="th">ID</CoimTableCell>
                <CoimTableCell component="th">Title</CoimTableCell>
                <CoimTableCell component="th">Category</CoimTableCell>
                <CoimTableCell component="th">Priority</CoimTableCell>
                <CoimTableCell component="th">Status</CoimTableCell>
                <CoimTableCell component="th" align="right">Open</CoimTableCell>
              </CoimTableRow>
            </CoimTableHead>
            <CoimTableBody>
              {#each filtered as issue (issue.id)}
                <CoimTableRow>
                  <CoimTableCell class="font-medium">{issue.id}</CoimTableCell>
                  <CoimTableCell>{issue.title}</CoimTableCell>
                  <CoimTableCell>{issue.category}</CoimTableCell>
                  <CoimTableCell>
                    <CoimChip
                      label={issue.priority}
                      color={issue.priority === "High" ? "error" : issue.priority === "Medium" ? "warning" : "grey"}
                      size="small"
                      variant="pastel"
                    />
                  </CoimTableCell>
                  <CoimTableCell>
                    <CoimChip
                      label={issue.status}
                      color={issue.status === "Resolved" ? "success" : "primary"}
                      size="small"
                      variant="pastel"
                    />
                  </CoimTableCell>
                  <CoimTableCell align="right">
                    <CoimButton
                      size="tiny"
                      variant="outlined"
                      onclick={() => {
                        supportStore.selectIssue(issue.id);
                        void goto("/pages/support/issue-detail");
                      }}
                    >
                      Inspect
                    </CoimButton>
                  </CoimTableCell>
                </CoimTableRow>
              {/each}
            </CoimTableBody>
          </CoimTable>
        </CoimTableContainer>
      </CoimCardContent>
    </CoimCard>
  </CoimStack>
</SupportShell>
