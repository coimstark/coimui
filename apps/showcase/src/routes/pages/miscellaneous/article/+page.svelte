<script lang="ts">
  import {
    CoimAvatar,
    CoimBreadcrumbs,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimStack,
    CoimTypography,
  } from "@coimui/svelte";
  import { CoimMarkdown } from "@coimui/svelte/plugins";

  const markdownBody = `
## Designing Multi-Preset Systems Without CSS Bloat

Keeping base core packages isolated allows teams to ship administrative interfaces with fast cold boots while opting into heavy engines only where needed.

### Key Architectural Takeaways

- Isolate chart engines, Excel exporters, and rich text editors into clean package entrypoints.
- Persist theme mode, accent preset, and RTL direction synchronously before hydration.
- Validate interactive accessibility cleanly with automated keyboard traversal checks.
`;
</script>

<svelte:head>
  <title>CoimUI Showcase — Engineering Article</title>
</svelte:head>

<CoimStack spacing={5} class="max-w-4xl">
  <div>
    <CoimBreadcrumbs items={[{ label: "Miscellaneous", href: "/pages/miscellaneous" }, { label: "Article" }]} />
    <CoimTypography variant="h1" class="mt-2">Modular UI Architecture in Svelte 5</CoimTypography>
    <div class="mt-3 flex flex-wrap items-center gap-3">
      <CoimAvatar src="/images/avatars/avatar-3.jpg" alt="Laura Ellis" size="small" />
      <span class="text-sm font-medium">Laura Ellis</span>
      <CoimChip label="Architecture" size="small" color="primary" variant="pastel" />
      <span class="text-text-secondary text-xs">Nov 22, 2026 · 6 min read</span>
    </div>
  </div>

  <CoimCard class="overflow-hidden">
    <img src="/images/misc/screen-1-large.jpg" alt="Design system architecture preview" class="h-64 w-full object-cover" />
    <CoimCardHeader title="Release Monograph" />
    <CoimCardContent>
      <CoimMarkdown content={markdownBody} />
    </CoimCardContent>
  </CoimCard>
</CoimStack>
