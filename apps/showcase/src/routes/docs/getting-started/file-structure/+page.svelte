<script lang="ts">
  import { CoimCard, CoimCardContent, CoimCardHeader } from "@coimui/svelte";
  import { CoimCodeBlock } from "@coimui/svelte/plugins";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";
</script>

<svelte:head><title>CoimUI Docs — File Structure</title></svelte:head>

<DocsSubNav section="Getting Started" title="Monorepo File Structure" subtitle="Workspace layout across @coimui/svelte, Starter, and Showcase.">
  <CoimCard>
    <CoimCardHeader title="Repository Map" />
    <CoimCardContent>
      <CoimCodeBlock
        language="plaintext"
        filename="tree"
        code={`packages/coimui/src/lib/\n  components/   # Inputs, data-display, feedback, surfaces, navigation, layout\n  data-grid/    # CoimDataGrid, Pivot Configurator, AI Assistant, CSV/XLSX\n  charts/       # LayerChart & D3 visualization components\n  date-pickers/ # Calendar, Range, Time & Clocks\n  layouts/      # CoimAppShell, CoimLeftMenu, CoimHeader, Topbar\n  plugins/      # Quill, Swiper, PhotoSwipe, Calendar, Markdown\napps/starter/   # Focused SaaS starter foundation\napps/showcase/  # Full component gallery & enterprise templates`}
      />
    </CoimCardContent>
  </CoimCard>
</DocsSubNav>
