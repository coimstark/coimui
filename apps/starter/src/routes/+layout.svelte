<script lang="ts">
  import "../app.css";
  import type { Snippet } from "svelte";
  import { CoimThemeProvider, CoimToastProvider, Elevation } from "@coimui/svelte";
  import StarterShell from "#lib/StarterShell.svelte";

  let { children }: { children?: Snippet } = $props();
</script>

<CoimThemeProvider defaults={{ elevation: Elevation.Flat }} storagePrefix="coimui-starter">
  <CoimToastProvider>
    <StarterShell>
      {@render children?.()}
    </StarterShell>
  </CoimToastProvider>
</CoimThemeProvider>
