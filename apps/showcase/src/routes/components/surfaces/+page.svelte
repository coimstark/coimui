<script lang="ts">
  import {
    CoimAccordion,
    CoimAccordionActions,
    CoimAccordionDetails,
    CoimAccordionGroup,
    CoimAccordionSummary,
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardActionArea,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimCardMedia,
    CoimChip,
    CoimGrid,
    CoimPaper,
    CoimStack,
    CoimSurface,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import ComponentDocCard from "#lib/components/ComponentDocCard.svelte";
  import { COMPONENT_CODE_EXAMPLES } from "#lib/examples/component-docs.ts";

  let activePanel = $state("architecture");
</script>

<svelte:head>
  <title>CoimUI Showcase — Surfaces</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Components", href: "/components" }, { label: "Surfaces" }]} />
    <CoimTypography variant="h1" class="mt-2">Surfaces &amp; Containers</CoimTypography>
    <p class="text-text-secondary mt-1">
      Elevated papers, soft tonal surfaces, media cards with action areas, and collapsible disclosure accordions.
    </p>
  </div>

  <CoimTypography variant="h2">Paper, Cards &amp; Accordions</CoimTypography>

  <ComponentDocCard
    title="CoimPaper & CoimSurface"
    description="Configurable elevation shadows (0–6), crisp outlined frames, and tonal surface tinting."
    code={COMPONENT_CODE_EXAMPLES.paperAndSurface}
    propsDocs={[
      { name: "elevation", type: "0 | 1 | 2 | 3 | 4 | 5 | 6", defaultValue: "1", description: "Controls multi-layered ambient shadow token depth." },
      { name: "variant", type: '"elevation" | "outlined"', defaultValue: '"elevation"', description: "Switches between elevation shadow and hairline border." },
      { name: "surface", type: "boolean", defaultValue: "false", description: "Applies soft tonal surface fill (default true on CoimSurface)." },
    ]}
  >
    <CoimGrid container spacing={3}>
      <CoimGrid size={{ xs: 12, sm: 4 }}>
        <CoimPaper elevation={2} class="p-5">
          <p class="font-semibold">Paper Elevation 2</p>
          <p class="text-text-secondary mt-1 text-sm">Balanced default card shadow.</p>
        </CoimPaper>
      </CoimGrid>
      <CoimGrid size={{ xs: 12, sm: 4 }}>
        <CoimPaper variant="outlined" class="p-5">
          <p class="font-semibold">Outlined Paper</p>
          <p class="text-text-secondary mt-1 text-sm">Crisp 1px structural border.</p>
        </CoimPaper>
      </CoimGrid>
      <CoimGrid size={{ xs: 12, sm: 4 }}>
        <CoimSurface elevation={1} class="p-5">
          <p class="font-semibold">Tonal Surface</p>
          <p class="text-text-secondary mt-1 text-sm">Subtle container hierarchy fill.</p>
        </CoimSurface>
      </CoimGrid>
    </CoimGrid>
  </ComponentDocCard>

  <ComponentDocCard
    title="CoimCard Suite"
    description="Composable header, media, clickable action area, body content, and footer actions."
    code={COMPONENT_CODE_EXAMPLES.card}
    propsDocs={[
      { name: "CoimCardHeader", type: "title, subheader, avatar, action", description: "Displays structured card header with snippet slots." },
      { name: "CoimCardMedia", type: 'component?: "div" | "img" | "video"', description: "Renders responsive hero photography or visual banners." },
      { name: "CoimCardActionArea", type: "href?, onclick?", description: "Provides keyboard-accessible whole-card interaction." },
    ]}
  >
    <CoimGrid container spacing={4}>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimCard>
          <CoimCardHeader title="Anodized Desk Lamp" subheader="Limited Series 2026">
            {#snippet action()}
              <CoimChip label="In Stock" size="small" color="success" variant="pastel" />
            {/snippet}
          </CoimCardHeader>
          <CoimCardMedia
            component="img"
            image="/images/products/product-2.jpg"
            alt="Anodized aluminum desk lamp"
            class="h-44 w-full object-cover"
          />
          <CoimCardContent>
            <p class="text-text-secondary text-sm">
              Stepless warm-to-neutral dimming engineered for low-glare studio monitors.
            </p>
          </CoimCardContent>
          <CoimCardActions>
            <CoimButton variant="text" onclick={() => toast.info("Saved to shortlist")}>Save</CoimButton>
            <CoimButton variant="contained" onclick={() => toast.success("Added item specs")}>Inspect</CoimButton>
          </CoimCardActions>
        </CoimCard>
      </CoimGrid>

      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimCard>
          <CoimCardActionArea onclick={() => toast.info("Action area activated")}>
            <CoimCardMedia
              component="img"
              image="/images/products/product-5.jpg"
              alt="Acoustic workspace ceramic kit"
              class="h-44 w-full object-cover"
            />
            <CoimCardContent>
              <p class="font-heading font-semibold">Interactive Card Action Area</p>
              <p class="text-text-secondary mt-1 text-sm">
                Entire header and media wrap cleanly inside a native button target when href is omitted.
              </p>
            </CoimCardContent>
          </CoimCardActionArea>
        </CoimCard>
      </CoimGrid>
    </CoimGrid>
  </ComponentDocCard>

  <ComponentDocCard
    title="CoimAccordionGroup & CoimAccordion"
    description="Single or multiple-expandable panels powered by Bits UI with smooth CSS transitions."
    code={COMPONENT_CODE_EXAMPLES.accordion}
    propsDocs={[
      { name: "type", type: '"single" | "multiple"', defaultValue: '"single"', description: "Allows exclusive single disclosure or independent open items." },
      { name: "variant", type: '"default" | "bordered" | "surface" | "basic"', defaultValue: '"default"', description: "Applies CoimUI surface styling across accordion headers." },
      { name: "level (summary)", type: "1 | 2 | 3 | 4 | 5 | 6", defaultValue: "3", description: "Sets the semantic heading level wrapping the disclosure button." },
    ]}
  >
    <CoimAccordionGroup type="single" bind:value={activePanel} variant="bordered">
      <CoimAccordion value="architecture">
        <CoimAccordionSummary>Modular subpath exports</CoimAccordionSummary>
        <CoimAccordionDetails>
          Keep core bundles lean while importing data-grid, charts, date-pickers, and plugins only on pages that use them.
        </CoimAccordionDetails>
      </CoimAccordion>
      <CoimAccordion value="accessibility">
        <CoimAccordionSummary>Keyboard &amp; screen reader conformance</CoimAccordionSummary>
        <CoimAccordionDetails>
          Each header separates the semantic heading wrapper from the native trigger button, preserving document landmarks and outline order.
        </CoimAccordionDetails>
        <CoimAccordionActions>
          <CoimButton size="small" onclick={() => toast.info("Opened conformance notes")}>View Audit Notes</CoimButton>
        </CoimAccordionActions>
      </CoimAccordion>
    </CoimAccordionGroup>
  </ComponentDocCard>
</CoimStack>
