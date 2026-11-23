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
  import { supportStore, type SupportIssue } from "#lib/pages/support.svelte.ts";
  import SupportShell from "#lib/pages/SupportShell.svelte";

  let title = $state("");
  let category = $state<SupportIssue["category"]>("UI Bug");
  let priority = $state<SupportIssue["priority"]>("Medium");
  let description = $state("");

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!title.trim() || !description.trim()) return;
    const created = supportStore.createIssue({ title, category, priority, description });
    toast.success(`Filed ticket ${created.id}`);
    void goto("/pages/support/issue-detail");
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — Support · Add Issue</title>
</svelte:head>

<SupportShell title="Submit New Support Issue" subtitle="Log a bug report, billing request, or access provisioning ticket.">
  <CoimCard class="max-w-2xl">
    <CoimCardHeader title="Issue Details" />
    <CoimCardContent>
      <form onsubmit={handleSubmit}>
        <CoimStack spacing={3}>
          <CoimTextField label="Issue Title" placeholder="Short summary of the problem..." bind:value={title} required fullWidth />
          <CoimSelect
            label="Category"
            value={category}
            onValueChange={(v) => {
              if (v === "Billing" || v === "UI Bug" || v === "Performance" || v === "Access") category = v;
            }}
            options={[
              { value: "UI Bug", label: "UI Bug" },
              { value: "Billing", label: "Billing" },
              { value: "Performance", label: "Performance" },
              { value: "Access", label: "Access" },
            ]}
            fullWidth
          />
          <CoimSelect
            label="Priority"
            value={priority}
            onValueChange={(v) => {
              if (v === "High" || v === "Medium" || v === "Low") priority = v;
            }}
            options={[
              { value: "High", label: "High" },
              { value: "Medium", label: "Medium" },
              { value: "Low", label: "Low" },
            ]}
            fullWidth
          />
          <CoimTextField label="Reproduction / Context" bind:value={description} multiline rows={4} required fullWidth />
          <div class="flex gap-2">
            <CoimButton type="submit" variant="contained">Submit Issue</CoimButton>
            <CoimButton href="/pages/support/issues" variant="outlined">Cancel</CoimButton>
          </div>
        </CoimStack>
      </form>
    </CoimCardContent>
  </CoimCard>
</SupportShell>
