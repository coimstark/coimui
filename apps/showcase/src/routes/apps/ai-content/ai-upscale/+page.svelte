<script lang="ts">
  import AiContentShell from "#lib/apps/AiContentShell.svelte";
  import AiContentStudio from "#lib/apps/AiContentStudio.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Content · Upscale</title>
</svelte:head>

<AiContentShell
  title="AI Upscale Studio"
  subtitle="2x and 4x super-resolution enhancement controls with clarity preservation."
>
  <AiContentStudio mode="upscale" />
</AiContentShell>
