<script lang="ts">
  import { CoimCard, CoimCardContent, CoimCardHeader, CoimStack } from "@coimui/svelte";
  import { CoimCodeBlock } from "@coimui/svelte/plugins";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";
</script>

<svelte:head><title>CoimUI Docs — Installation</title></svelte:head>

<DocsSubNav section="Getting Started" title="Installation &amp; Subpath Setup" subtitle="Bun workspace dependencies and Tailwind v4 stylesheet imports.">
  <CoimStack spacing={4}>
    <CoimCard>
      <CoimCardHeader title="Install Core Package" />
      <CoimCardContent>
        <CoimCodeBlock
          language="bash"
          filename="terminal"
          code={`bun add @coimui/svelte bits-ui @internationalized/date dayjs clsx tailwind-merge`}
        />
      </CoimCardContent>
    </CoimCard>
    <CoimCard>
      <CoimCardHeader title="Import Stylesheets" />
      <CoimCardContent>
        <CoimCodeBlock
          language="css"
          filename="src/app.css"
          code={`@import "tailwindcss";\n@import "@coimui/svelte/styles";`}
        />
      </CoimCardContent>
    </CoimCard>
  </CoimStack>
</DocsSubNav>
