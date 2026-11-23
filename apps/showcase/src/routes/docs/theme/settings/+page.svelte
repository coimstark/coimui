<script lang="ts">
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimSelect,
    CoimStack,
    THEME_OPTIONS,
    getThemeContext,
    type ThemeVariant,
  } from "@coimui/svelte";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";

  const theme = getThemeContext();
</script>

<svelte:head><title>CoimUI Docs — Theme Settings</title></svelte:head>

<DocsSubNav section="Theme" title="Live Theme Settings" subtitle="Test presets, color modes, and navigation layouts interactively.">
  <CoimCard class="max-w-lg">
    <CoimCardHeader title="Interactive Controls" />
    <CoimCardContent>
      <CoimStack spacing={3}>
        <CoimSelect
          label="Color Preset"
          value={theme.theme}
          onValueChange={(v) => {
            if (typeof v === "string") theme.setTheme(v as ThemeVariant);
          }}
          options={[
            { value: THEME_OPTIONS.PURPLE, label: "Purple" },
            { value: THEME_OPTIONS.BLUE, label: "Blue" },
            { value: THEME_OPTIONS.GREEN, label: "Green" },
            { value: THEME_OPTIONS.ORANGE, label: "Orange" },
          ]}
          fullWidth
        />
        <div class="flex flex-wrap gap-2">
          <CoimButton size="small" variant="outlined" onclick={() => theme.setMode("light")}>Light</CoimButton>
          <CoimButton size="small" variant="outlined" onclick={() => theme.setMode("dark")}>Dark</CoimButton>
          <CoimButton size="small" variant="text" onclick={() => theme.reset()}>Reset Defaults</CoimButton>
        </div>
      </CoimStack>
    </CoimCardContent>
  </CoimCard>
</DocsSubNav>
