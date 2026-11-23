<script lang="ts">
  import AiContentShell from "#lib/apps/AiContentShell.svelte";
  import AiContentStudio from "#lib/apps/AiContentStudio.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Content · Image Studio</title>
</svelte:head>

<AiContentShell
  title="AI Image Studio"
  subtitle="Configure prompt parameters, aspect ratios, seeds, and image synthesis presets."
>
  <AiContentStudio mode="image" />
</AiContentShell>
