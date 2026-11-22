<script lang="ts">
  import {
    CoimBox,
    CoimBreadcrumbs,
    CoimContainer,
    CoimDivider,
    CoimGrid,
    CoimImageList,
    CoimImageListItem,
    CoimImageListItemBar,
    CoimMasonry,
    CoimPaper,
    CoimStack,
    CoimTypography,
  } from "@coimui/svelte";
  import ComponentDocCard from "#lib/components/ComponentDocCard.svelte";
  import { COMPONENT_CODE_EXAMPLES } from "#lib/examples/component-docs.ts";

  const gallery = [
    { src: "/images/products/product-1.jpg", title: "Studio Monitor Kit", sub: "Audio Hardware" },
    { src: "/images/products/product-2.jpg", title: "Anodized Desk Lamp", sub: "Industrial Lighting" },
    { src: "/images/products/product-3.jpg", title: "Ceramic Pour-Over", sub: "Studio Pantry" },
    { src: "/images/products/product-4.jpg", title: "Modular Acoustic Panel", sub: "Workspace" },
  ];

  const masonryCards = [
    { label: "Tokens & Contrast", heightClass: "min-h-24", detail: "WCAG AA verified surface steps" },
    { label: "Responsive 12-Col Grid", heightClass: "min-h-36", detail: "Breakpoint objects for xs..2xl spacing and spans" },
    { label: "Logical Spacing", heightClass: "min-h-28", detail: "Supports both LTR and Arabic RTL effortlessly" },
    { label: "Stack Dividers", heightClass: "min-h-40", detail: "Flex gap primitives with responsive direction props" },
    { label: "Editorial Scales", heightClass: "min-h-28", detail: "Urbanist headings paired with Mulish body copy" },
    { label: "Container Gutters", heightClass: "min-h-32", detail: "Centered fixed and fluid maxWidth wrappers" },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Foundation & Layout</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Components", href: "/components" }, { label: "Foundation & Layout" }]} />
    <CoimTypography variant="h1" class="mt-2">Foundation &amp; Layout</CoimTypography>
    <p class="text-text-secondary mt-1">
      Typography scales, semantic dividers, containers, responsive 12-column grid, stacks, image lists, and masonry columns.
    </p>
  </div>

  <CoimTypography variant="h2">Core Typography &amp; Structural Layout</CoimTypography>

  <ComponentDocCard
    title="CoimTypography & CoimDivider"
    description="Semantic heading hierarchy, body variants, truncation, and horizontal/vertical dividers."
    code={COMPONENT_CODE_EXAMPLES.typography}
    propsDocs={[
      { name: "variant", type: '"h1" | ... | "body1" | "caption"', defaultValue: '"body1"', description: "Maps semantic element tag and Urbanist/Mulish typographic scale." },
      { name: "component", type: "string", defaultValue: "mapped tag", description: "Overrides rendered HTML element without altering visual variant." },
      { name: "ellipsisLines", type: "1 | 2 | 3 | 4 | 5 | 6", description: "Clamps overflowing prose cleanly with ellipsis." },
      { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', description: "Controls CoimDivider axis and aria-orientation." },
    ]}
    accessibilityNotes={[
      "Pass component='p' if using subtitle1 visuals as a non-heading subheader so h1->h2->h3 outline stays sequential.",
      "CoimDivider assigns role='separator' and aria-orientation='vertical' automatically when vertical.",
    ]}
  >
    <CoimStack spacing={3}>
      <CoimTypography variant="h3" component="p">Display H3 Visual Scale</CoimTypography>
      <CoimTypography variant="body1">Primary body copy rendered in Mulish with comfortable reading rhythm.</CoimTypography>
      <CoimTypography variant="body2" color="text-secondary" noWrap>
        Secondary metadata with single-line noWrap truncation handling when bounded horizontally.
      </CoimTypography>
      <CoimDivider>Section Break</CoimDivider>
      <div class="flex flex-wrap items-center gap-4">
        <CoimTypography variant="overline">Tokens</CoimTypography>
        <CoimDivider orientation="vertical" flexItem />
        <CoimTypography variant="caption">4-Theme Palette</CoimTypography>
        <CoimDivider orientation="vertical" flexItem />
        <CoimTypography variant="caption">LTR &amp; RTL Ready</CoimTypography>
      </div>
    </CoimStack>
  </ComponentDocCard>

  <ComponentDocCard
    title="CoimContainer, CoimBox, CoimGrid & CoimStack"
    description="Responsive layout primitives accepting object or scalar breakpoint configurations."
    code={COMPONENT_CODE_EXAMPLES.gridAndStack}
    propsDocs={[
      { name: "container / spacing", type: "boolean / ResponsiveValue", defaultValue: "false / 0", description: "Turns CoimGrid into a multi-column flex grid container." },
      { name: "size", type: "ResponsiveValue<number | 'grow' | 'auto'>", description: "Controls column span out of 12 per breakpoint." },
      { name: "direction", type: "ResponsiveValue<'row' | 'column'>", defaultValue: '"column"', description: "Sets CoimStack flex direction responsively." },
    ]}
  >
    <CoimContainer maxWidth="lg" disableGutters>
      <CoimBox class="bg-grey-50 dark:bg-grey-800/40 rounded-xl p-4">
        <CoimGrid container spacing={3}>
          <CoimGrid size={{ xs: 12, md: 6 }}>
            <CoimPaper elevation={1} class="p-4">
              <p class="font-semibold">Grid 12 / md:6</p>
              <p class="text-text-secondary text-sm">Full-width on mobile viewports, two-up on desktop.</p>
            </CoimPaper>
          </CoimGrid>
          <CoimGrid size={{ xs: 12, md: 6 }}>
            <CoimPaper elevation={1} class="p-4">
              <CoimStack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <CoimPaper variant="outlined" class="flex-1 p-2 text-center text-sm">Stack Item 1</CoimPaper>
                <CoimPaper variant="outlined" class="flex-1 p-2 text-center text-sm">Stack Item 2</CoimPaper>
              </CoimStack>
            </CoimPaper>
          </CoimGrid>
        </CoimGrid>
      </CoimBox>
    </CoimContainer>
  </ComponentDocCard>

  <ComponentDocCard
    title="CoimImageList & CoimMasonry"
    description="Multi-column media galleries with caption bars plus responsive masonry columns."
    code={COMPONENT_CODE_EXAMPLES.imageListAndMasonry}
    propsDocs={[
      { name: "cols / gap", type: "number / number | string", defaultValue: "2 / 4", description: "Controls column count and gap spacing on CoimImageList." },
      { name: "columns", type: "ResponsiveValue<number>", defaultValue: "4", description: "Responsive CSS column count for CoimMasonry." },
    ]}
  >
    <CoimStack spacing={6}>
      <CoimImageList cols={2} gap={12}>
        {#each gallery as item (item.title)}
          <CoimImageListItem>
            <img src={item.src} alt={item.title} class="h-44 w-full rounded-lg object-cover" />
            <CoimImageListItemBar title={item.title} subtitle={item.sub} position="below" />
          </CoimImageListItem>
        {/each}
      </CoimImageList>

      <CoimMasonry columns={{ xs: 1, sm: 2, lg: 3 }} spacing={2}>
        {#each masonryCards as card (card.label)}
          <CoimPaper variant="outlined" class={`${card.heightClass} mb-4 p-4`}>
            <p class="font-heading font-semibold">{card.label}</p>
            <p class="text-text-secondary mt-1 text-sm">{card.detail}</p>
          </CoimPaper>
        {/each}
      </CoimMasonry>
    </CoimStack>
  </ComponentDocCard>
</CoimStack>
