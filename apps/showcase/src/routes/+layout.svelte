<script lang="ts">
  import "../app.css";
  import type { Snippet } from "svelte";
  import { CoimThemeProvider, CoimToastProvider, Elevation } from "@coimui/svelte";
  import ShowcaseShell from "#lib/ShowcaseShell.svelte";

  let { children }: { children?: Snippet } = $props();
</script>

<CoimThemeProvider defaults={{ elevation: Elevation.Elevated }} storagePrefix="coimui-showcase">
  <CoimToastProvider>
    <ShowcaseShell>
      {@render children?.()}
    </ShowcaseShell>
  </CoimToastProvider>
</CoimThemeProvider>
