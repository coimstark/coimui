<script lang="ts">
  import {
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimGrid,
  } from "@coimui/svelte";
  import { supportStore } from "#lib/pages/support.svelte.ts";
  import SupportShell from "#lib/pages/SupportShell.svelte";

  const cards = [
    { title: "Support Overview", desc: "Ticket volume trends, category breakdown & top responders.", href: "/pages/support/overview" },
    { title: "Issues Queue", desc: "Search and filter open, active, and resolved support requests.", href: "/pages/support/issues" },
    { title: "Issue Detail", desc: "Update status transitions, inspect metadata & post replies.", href: "/pages/support/issue-detail" },
    { title: "Submit New Issue", desc: "File a prioritized support ticket directly into the queue.", href: "/pages/support/add-issue" },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Support Desk</title>
</svelte:head>

<SupportShell
  title="Support Center"
  subtitle={`${supportStore.issues.length} tracked support issues across workspace operations.`}
>
  <CoimGrid container spacing={4}>
    {#each cards as c (c.href)}
      <CoimGrid size={{ xs: 12, sm: 6, lg: 3 }}>
        <CoimCard class="flex h-full flex-col justify-between">
          <div>
            <CoimCardHeader title={c.title} />
            <CoimCardContent>
              <p class="text-text-secondary text-sm">{c.desc}</p>
            </CoimCardContent>
          </div>
          <CoimCardActions>
            <CoimButton href={c.href} size="small" variant="contained" fullWidth>Open</CoimButton>
          </CoimCardActions>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>
</SupportShell>
