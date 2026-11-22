<script lang="ts">
  import CoimPaper from "./CoimPaper.svelte";
  import type { CoimPaperProps } from "./types.js";

  let { elevation = 2, surface = true, ...rest }: CoimPaperProps = $props();
</script>

<CoimPaper {elevation} {surface} {...rest} />
