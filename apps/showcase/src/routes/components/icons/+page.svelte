<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimChip,
    CoimGrid,
    CoimStack,
    CoimTextField,
    CoimToggleButton,
    CoimToggleButtonGroup,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import {
    IconMap,
    IllustrationAccess,
    IllustrationAccount,
    IllustrationAnalytics,
    IllustrationConfigure,
    IllustrationDatabase,
    IllustrationDocumentation,
    IllustrationEmail,
    IllustrationExperiment,
    IllustrationIntegrate,
    IllustrationLaunch,
    IllustrationPerformance,
    IllustrationPhone,
    IllustrationPlatforms,
    IllustrationServers,
    IllustrationStorage,
    IllustrationSupport,
    type IconName,
  } from "@coimui/svelte/icons";
  import { CoimIcon } from "@coimui/svelte";

  const ALL_ICON_NAMES = Object.keys(IconMap) as IconName[];

  let searchQuery = $state("");
  let variant = $state<"outlined" | "contained">("outlined");
  let visibleCount = $state(72);

  const filteredIcons = $derived.by(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ALL_ICON_NAMES;
    return ALL_ICON_NAMES.filter((name) => name.toLowerCase().includes(q));
  });

  const shownIcons = $derived(filteredIcons.slice(0, visibleCount));

  function copyIconImport(name: IconName) {
    const snippet = `import { ${name} } from "@coimui/svelte/icons";`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(snippet);
    }
    toast.info(`Copied ${name} import statement`);
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — Icon Library & Illustrations</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Components", href: "/components" }, { label: "Icon Library" }]} />
    <CoimTypography variant="h1" class="mt-2">Icon Library &amp; Illustrations</CoimTypography>
    <p class="text-text-secondary mt-1">
      {ALL_ICON_NAMES.length} native Svelte SVG UI icons with outlined/contained variants plus 16 scalable product illustrations.
    </p>
  </div>

  <div class="flex flex-wrap items-center justify-between gap-4">
    <div class="w-full max-w-sm">
      <CoimTextField
        label="Search Icons"
        placeholder="Filter e.g. chart, user, arrow, coim..."
        bind:value={searchQuery}
        fullWidth
      />
    </div>

    <div class="flex items-center gap-3">
      <CoimChip label={`${filteredIcons.length} matches`} color="primary" variant="pastel" />
      <CoimToggleButtonGroup type="single" bind:value={variant} color="primary">
        <CoimToggleButton value="outlined">Outlined</CoimToggleButton>
        <CoimToggleButton value="contained">Contained</CoimToggleButton>
      </CoimToggleButtonGroup>
    </div>
  </div>

  <section aria-labelledby="ui-icons-heading">
    <CoimTypography id="ui-icons-heading" variant="h2" class="mb-4">UI Icon Grid</CoimTypography>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      {#each shownIcons as name (name)}
        <button
          type="button"
          onclick={() => copyIconImport(name)}
          class="border-grey-100 bg-background-paper hover:border-primary focus-visible:outline-primary flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-colors focus-visible:outline-2"
        >
          <CoimIcon icon={name} {variant} size={22} class="text-primary" />
          <span class="text-text-secondary w-full truncate font-mono text-[11px]">{name}</span>
        </button>
      {/each}
    </div>

    {#if shownIcons.length < filteredIcons.length}
      <div class="mt-5 flex justify-center">
        <CoimButton variant="outlined" onclick={() => (visibleCount += 96)}>
          Show More ({filteredIcons.length - shownIcons.length} remaining)
        </CoimButton>
      </div>
    {/if}
  </section>

  <section aria-labelledby="illustrations-heading">
    <CoimTypography id="illustrations-heading" variant="h2" class="mb-4">Vector Illustrations (16)</CoimTypography>
    <CoimGrid container spacing={4}>
      {#each [
        { name: "Access", comp: IllustrationAccess },
        { name: "Account", comp: IllustrationAccount },
        { name: "Analytics", comp: IllustrationAnalytics },
        { name: "Configure", comp: IllustrationConfigure },
        { name: "Database", comp: IllustrationDatabase },
        { name: "Documentation", comp: IllustrationDocumentation },
        { name: "Email", comp: IllustrationEmail },
        { name: "Experiment", comp: IllustrationExperiment },
        { name: "Integrate", comp: IllustrationIntegrate },
        { name: "Launch", comp: IllustrationLaunch },
        { name: "Performance", comp: IllustrationPerformance },
        { name: "Phone", comp: IllustrationPhone },
        { name: "Platforms", comp: IllustrationPlatforms },
        { name: "Servers", comp: IllustrationServers },
        { name: "Storage", comp: IllustrationStorage },
        { name: "Support", comp: IllustrationSupport },
      ] as item (item.name)}
        {@const Graphic = item.comp}
        <CoimGrid size={{ xs: 6, sm: 4, md: 3 }}>
          <CoimCard>
            <CoimCardContent class="flex flex-col items-center gap-2 p-4 text-center">
              <div class="h-24 w-24">
                <Graphic />
              </div>
              <span class="font-mono text-xs">{`Illustration${item.name}`}</span>
            </CoimCardContent>
          </CoimCard>
        </CoimGrid>
      {/each}
    </CoimGrid>
  </section>
</CoimStack>
