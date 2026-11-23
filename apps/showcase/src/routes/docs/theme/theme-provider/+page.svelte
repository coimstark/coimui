<script lang="ts">
  import { CoimCard, CoimCardContent, CoimCardHeader } from "@coimui/svelte";
  import { CoimCodeBlock } from "@coimui/svelte/plugins";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";
</script>

<svelte:head><title>CoimUI Docs — Theme Provider</title></svelte:head>

<DocsSubNav section="Theme" title="CoimThemeProvider" subtitle="Root context orchestrating persisted palette, mode, direction, and layout width.">
  <CoimCard>
    <CoimCardHeader title="Provider Wrapping" />
    <CoimCardContent>
      <CoimCodeBlock
        language="svelte"
        filename="+layout.svelte"
        code={`<CoimThemeProvider defaults={{ theme: "theme-purple", elevation: "elevated" }} storagePrefix="coimui-app">\n  <CoimToastProvider>\n    <slot />\n  </CoimToastProvider>\n</CoimThemeProvider>`}
      />
    </CoimCardContent>
  </CoimCard>
</DocsSubNav>
