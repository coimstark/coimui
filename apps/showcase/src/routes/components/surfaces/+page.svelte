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
    CoimFormControlLabel,
    CoimGrid,
    CoimPaper,
    CoimSelect,
    CoimStack,
    CoimSurface,
    CoimSwitch,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import ComponentDocCard from "#lib/components/ComponentDocCard.svelte";
  import type { ComponentApiGroup } from "#lib/components/doc-types.ts";
  import { COMPONENT_CODE_EXAMPLES } from "#lib/examples/component-docs.ts";

  const END_SCRIPT = "</" + "script>";

  let activePanel = $state("architecture");
  let accordionVariant = $state<"default" | "bordered" | "surface" | "basic">("bordered");

  // Interactive Paper playground
  let paperVariant = $state<"elevation" | "outlined">("elevation");
  let paperElevation = $state<0 | 1 | 2 | 3 | 4>(2);
  let paperSquare = $state(false);
  let paperSurface = $state(false);

  const paperCode = $derived(`<script lang="ts">
  import { CoimPaper, CoimSurface } from "@coimui/svelte";
${END_SCRIPT}

<CoimPaper variant="${paperVariant}" elevation={${paperElevation}}${paperSquare ? " square" : ""}${paperSurface ? " surface" : ""} class="p-5">
  Interactive Paper container
</CoimPaper>
<CoimSurface elevation={1} class="p-5">Soft tonal surface</CoimSurface>`);

  const accordionCode = $derived(`<script lang="ts">
  import {
    CoimAccordionGroup,
    CoimAccordion,
    CoimAccordionSummary,
    CoimAccordionDetails,
  } from "@coimui/svelte";
${END_SCRIPT}

<CoimAccordionGroup type="single" variant="${accordionVariant}" value="architecture">
  <CoimAccordion value="architecture">
    <CoimAccordionSummary>Modular subpath exports</CoimAccordionSummary>
    <CoimAccordionDetails>Uses Bits UI disclosure triggers and smooth transitions.</CoimAccordionDetails>
  </CoimAccordion>
</CoimAccordionGroup>`);

  const cardApiGroups: ComponentApiGroup[] = [
    {
      title: "CoimCard & Composition Slots",
      props: [
        { name: "raised / elevation / variant", type: "boolean / 0..6 / \"elevation\" | \"outlined\"", defaultValue: "false / 1 / \"elevation\"", description: "Surface elevation or hairline border treatment." },
        { name: "CoimCardHeader", type: "title?, subheader?, avatar?, action?", description: "Header region with optional leading avatar and trailing action snippets." },
        { name: "CoimCardMedia", type: "image, alt?, component?: \"div\" | \"img\" | \"video\"", description: "Media strip rendered cleanly inside card bounds." },
        { name: "CoimCardContent / CoimCardActions", type: "children: Snippet", kind: "snippet", description: "Body spacing container and footer button row." },
        { name: "CoimCardActionArea", type: "href?, onclick?", kind: "event", description: "Keyboard-focusable whole-card clickable region." },
      ],
    },
  ];
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
    id="coim-paper"
    title="CoimPaper &amp; CoimSurface"
    description="Configurable elevation shadows (0-6), crisp outlined frames, and tonal surface tinting."
    code={paperCode}
    propsDocs={[
      { name: "elevation", type: "0 | 1 | 2 | 3 | 4 | 5 | 6", defaultValue: "1", description: "Controls multi-layered ambient shadow token depth." },
      { name: "variant", type: "\"elevation\" | \"outlined\"", defaultValue: "\"elevation\"", description: "Switches between elevation shadow and hairline border." },
      { name: "square", type: "boolean", defaultValue: "false", description: "Removes rounded corners for sharp edge containers." },
      { name: "surface", type: "boolean", defaultValue: "false", description: "Applies soft tonal surface fill (default true on CoimSurface)." },
    ]}
  >
    <CoimGrid container spacing={3}>
      <CoimGrid size={{ xs: 12, sm: 4 }}>
        <CoimPaper variant={paperVariant} elevation={paperElevation} square={paperSquare} surface={paperSurface} class="p-5">
          <p class="font-semibold">Live Paper ({paperVariant}, elev {paperElevation})</p>
          <p class="text-text-secondary mt-1 text-sm">Controlled via playground options below.</p>
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

    {#snippet controls()}
      <div class="grid gap-3 sm:grid-cols-4 sm:items-center">
        <CoimSelect
          label="Variant"
          size="small"
          value={paperVariant}
          onValueChange={(v) => {
            if (v === "elevation" || v === "outlined") paperVariant = v;
          }}
          options={[
            { value: "elevation", label: "elevation" },
            { value: "outlined", label: "outlined" },
          ]}
          fullWidth
        />
        <CoimSelect
          label="Elevation"
          size="small"
          value={String(paperElevation)}
          onValueChange={(v) => {
            if (typeof v === "string") paperElevation = Number(v) as 0 | 1 | 2 | 3 | 4;
          }}
          options={[
            { value: "0", label: "0" },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
          ]}
          fullWidth
        />
        <CoimFormControlLabel label="Square"><CoimSwitch bind:checked={paperSquare} /></CoimFormControlLabel>
        <CoimFormControlLabel label="Tonal Surface"><CoimSwitch bind:checked={paperSurface} /></CoimFormControlLabel>
      </div>
    {/snippet}
  </ComponentDocCard>

  <ComponentDocCard
    id="coim-card"
    title="CoimCard Suite"
    description="Composable header, media, clickable action area, body content, and footer actions."
    code={COMPONENT_CODE_EXAMPLES.card}
    apiGroups={cardApiGroups}
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
    id="coim-accordion"
    title="CoimAccordionGroup &amp; CoimAccordion"
    description="Single or multiple-expandable panels powered by Bits UI with smooth CSS transitions."
    code={accordionCode}
    propsDocs={[
      { name: "type", type: "\"single\" | \"multiple\"", defaultValue: "\"single\"", description: "Allows exclusive single disclosure or independent open items." },
      { name: "value", type: "string | string[]", kind: "bindable", description: "Two-way bound expanded panel id(s)." },
      { name: "variant", type: "\"default\" | \"bordered\" | \"surface\" | \"basic\"", defaultValue: "\"default\"", description: "Applies CoimUI surface styling across accordion headers." },
      { name: "level (summary)", type: "1 | 2 | 3 | 4 | 5 | 6", defaultValue: "3", description: "Sets the semantic heading level wrapping the disclosure button." },
    ]}
  >
    <CoimAccordionGroup type="single" bind:value={activePanel} variant={accordionVariant}>
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

    {#snippet controls()}
      <div class="max-w-xs">
        <CoimSelect
          label="Accordion Variant"
          size="small"
          value={accordionVariant}
          onValueChange={(v) => {
            if (v === "default" || v === "bordered" || v === "surface" || v === "basic") accordionVariant = v;
          }}
          options={[
            { value: "default", label: "default" },
            { value: "bordered", label: "bordered" },
            { value: "surface", label: "surface" },
            { value: "basic", label: "basic" },
          ]}
          fullWidth
        />
      </div>
    {/snippet}
  </ComponentDocCard>
</CoimStack>
