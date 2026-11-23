<script lang="ts">
  import AiContentShell from "#lib/apps/AiContentShell.svelte";
  import AiContentStudio from "#lib/apps/AiContentStudio.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Content · Video Studio</title>
</svelte:head>

<AiContentShell
  title="AI Video Studio"
  subtitle="Configure frame rate pacing, motion curves, and video rendering endpoints."
>
  <AiContentStudio mode="video" />
</AiContentShell>
