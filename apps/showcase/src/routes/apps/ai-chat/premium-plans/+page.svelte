<script lang="ts">
  import {
    CoimAccordion,
    CoimAccordionDetails,
    CoimAccordionGroup,
    CoimAccordionSummary,
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimStack,
    CoimSwitch,
    toast,
  } from "@coimui/svelte";
  import AiChatShell from "#lib/apps/AiChatShell.svelte";

  let annual = $state(true);

  const tiers = [
    { name: "Workspace Starter", monthly: 0, annual: 0, quota: "Local prompt history & 1 key", highlight: false },
    { name: "Team Workspace", monthly: 29, annual: 22, quota: "Unlimited threads, shared extensions & SSO", highlight: true },
    { name: "Enterprise Gateway", monthly: 99, annual: 79, quota: "Custom self-hosted provider SLA & audit logs", highlight: false },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Chat · Plans</title>
</svelte:head>

<AiChatShell title="AI Chat Plans &amp; FAQ" subtitle="Workspace subscription tiers and billing preferences.">
  <CoimStack spacing={4}>
    <CoimSwitch label="Annual billing discount" bind:checked={annual} />

    <CoimGrid container spacing={4}>
      {#each tiers as tier (tier.name)}
        <CoimGrid size={{ xs: 12, md: 4 }}>
          <CoimCard class={tier.highlight ? "border-primary border-2 h-full" : "h-full"}>
            <CoimCardHeader title={tier.name} subheader={tier.quota}>
              {#snippet action()}
                {#if tier.highlight}
                  <CoimChip label="Popular" color="primary" size="small" variant="pastel" />
                {/if}
              {/snippet}
            </CoimCardHeader>
            <CoimCardContent>
              <p class="font-heading text-3xl font-bold">
                ${annual ? tier.annual : tier.monthly}<span class="text-text-secondary text-sm font-normal"> / month</span>
              </p>
            </CoimCardContent>
            <CoimCardActions>
              <CoimButton
                fullWidth
                variant={tier.highlight ? "contained" : "outlined"}
                onclick={() => toast.success(`Selected ${tier.name}`)}
              >
                Select Plan
              </CoimButton>
            </CoimCardActions>
          </CoimCard>
        </CoimGrid>
      {/each}
    </CoimGrid>

    <CoimAccordionGroup type="single" value="faq-1" variant="bordered">
      <CoimAccordion value="faq-1">
        <CoimAccordionSummary>How are custom inference providers connected?</CoimAccordionSummary>
        <CoimAccordionDetails>
          Configure your endpoint URL and model ID in the AI Chat header dialog; no completions are fabricated offline without a connected provider.
        </CoimAccordionDetails>
      </CoimAccordion>
      <CoimAccordion value="faq-2">
        <CoimAccordionSummary>Can workspace keys be rotated without downtime?</CoimAccordionSummary>
        <CoimAccordionDetails>
          Issue a new key under API Access before revoking prior prefixes so active automations transition smoothly.
        </CoimAccordionDetails>
      </CoimAccordion>
    </CoimAccordionGroup>
  </CoimStack>
</AiChatShell>
