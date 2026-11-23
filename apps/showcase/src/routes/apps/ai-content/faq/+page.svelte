<script lang="ts">
  import {
    CoimAccordion,
    CoimAccordionDetails,
    CoimAccordionGroup,
    CoimAccordionSummary,
  } from "@coimui/svelte";
  import AiContentShell from "#lib/apps/AiContentShell.svelte";

  const faqs = [
    {
      id: "ac-faq-1",
      q: "Why are Generate buttons disabled until a media provider is configured?",
      a: "CoimUI avoids fabricating fake generated imagery or video outputs. Supply a real media endpoint in Configure Media Provider to enable remote dispatch.",
    },
    {
      id: "ac-faq-2",
      q: "Are uploaded reference plates persisted across page reloads?",
      a: "Library favorites and removals persist locally, while large binary File objects staged in Uploads remain safely scoped in browser memory.",
    },
    {
      id: "ac-faq-3",
      q: "Can I preview gallery renders at full resolution?",
      a: "Yes. Open the Media Library tab and click any frame inside the Interactive Lightbox Preview.",
    },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Content · FAQ</title>
</svelte:head>

<AiContentShell title="AI Content FAQ" subtitle="Frequently asked questions for studio workflows and provider integration.">
  <CoimAccordionGroup type="single" value="ac-faq-1" variant="bordered">
    {#each faqs as item (item.id)}
      <CoimAccordion value={item.id}>
        <CoimAccordionSummary>{item.q}</CoimAccordionSummary>
        <CoimAccordionDetails>{item.a}</CoimAccordionDetails>
      </CoimAccordion>
    {/each}
  </CoimAccordionGroup>
</AiContentShell>
