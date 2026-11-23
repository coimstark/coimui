<script lang="ts">
  import { CoimButton, CoimCard, CoimCardContent, CoimCardHeader, CoimGrid } from "@coimui/svelte";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";
</script>

<svelte:head><title>CoimUI Docs — Welcome</title></svelte:head>

<DocsSubNav section="Welcome" title="Welcome to CoimUI Docs" subtitle="Orientation guides, architecture FAQs, and release history.">
  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, md: 4 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="Introduction" subheader="First-generation Svelte 5 design system" />
        <CoimCardContent><CoimButton href="/docs/welcome/introduction" size="small" variant="contained">Read Intro</CoimButton></CoimCardContent>
      </CoimCard>
    </CoimGrid>
    <CoimGrid size={{ xs: 12, md: 4 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="Documentation FAQ" subheader="Modular subpaths, SSR & bundler isolation" />
        <CoimCardContent><CoimButton href="/docs/welcome/faq" size="small" variant="outlined">Read FAQ</CoimButton></CoimCardContent>
      </CoimCard>
    </CoimGrid>
    <CoimGrid size={{ xs: 12, md: 4 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="Changelog" subheader="Releases & verified package milestones" />
        <CoimCardContent><CoimButton href="/docs/welcome/changelog" size="small" variant="outlined">View History</CoimButton></CoimCardContent>
      </CoimCard>
    </CoimGrid>
  </CoimGrid>
</DocsSubNav>
