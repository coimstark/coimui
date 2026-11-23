<script lang="ts">
  import { CoimButton, CoimCard, CoimCardContent, CoimCardHeader, getThemeContext, toast } from "@coimui/svelte";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";
  import { showcaseI18n, SHOWCASE_LOCALES } from "#lib/i18n.svelte.ts";

  const theme = getThemeContext();
</script>

<svelte:head><title>CoimUI Docs — Multi-Language &amp; RTL</title></svelte:head>

<DocsSubNav section="Getting Started" title="Localization &amp; RTL Sync" subtitle="Switch between EN, DE, FR, ES, and Arabic RTL direction.">
  <CoimCard>
    <CoimCardHeader title="Live Locale &amp; Direction Switcher" subheader={`Active locale: ${showcaseI18n.locale.toUpperCase()} (${theme.direction.toUpperCase()})`} />
    <CoimCardContent>
      <div class="flex flex-wrap gap-2">
        {#each SHOWCASE_LOCALES as loc (loc.code)}
          <CoimButton
            size="small"
            variant={showcaseI18n.locale === loc.code ? "contained" : "outlined"}
            onclick={() => {
              const dir = showcaseI18n.setLocale(loc.code);
              theme.setDirection(dir);
              toast.success(`Switched to ${loc.label} (${dir.toUpperCase()})`);
            }}
          >
            {loc.label}
          </CoimButton>
        {/each}
      </div>
    </CoimCardContent>
  </CoimCard>
</DocsSubNav>
