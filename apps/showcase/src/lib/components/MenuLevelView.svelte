<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimList,
    CoimListItemButton,
    CoimListItemText,
    CoimStack,
    CoimTypography,
  } from "@coimui/svelte";
  import { goto } from "$app/navigation";

  interface Props {
    depth: number;
    title: string;
    currentPath: string;
    breadcrumbs: { label: string; href?: string }[];
  }

  let { depth, title, currentPath, breadcrumbs }: Props = $props();

  const treeRoutes = [
    { level: 1, label: "Level 1 — Root Index", href: "/menu-levels" },
    { level: 2, label: "Level 2 — Branch A", href: "/menu-levels/level-two" },
    { level: 2, label: "Level 2 — With Sub-levels", href: "/menu-levels/level-two-subs" },
    { level: 3, label: "Level 3 — Branch A", href: "/menu-levels/level-two-subs/level-three" },
    { level: 3, label: "Level 3 — With Sub-levels", href: "/menu-levels/level-two-subs/level-three-subs" },
    { level: 4, label: "Level 4 — Branch A", href: "/menu-levels/level-two-subs/level-three-subs/level-four" },
    { level: 4, label: "Level 4 — With Sub-levels", href: "/menu-levels/level-two-subs/level-three-subs/level-four-subs" },
    { level: 5, label: "Level 5 — Deepest Leaf", href: "/menu-levels/level-two-subs/level-three-subs/level-four-subs/level-five" },
  ];
</script>

<CoimStack spacing={5}>
  <div>
    <CoimBreadcrumbs items={breadcrumbs} />
    <div class="mt-2 flex flex-wrap items-center gap-3">
      <CoimTypography variant="h1">{title}</CoimTypography>
      <CoimChip label={`Depth ${depth} / 5`} size="small" color="primary" variant="pastel" />
    </div>
    <p class="text-text-secondary mt-1 text-sm">
      Demonstrates `CoimSecondaryItem` recursive nested menu indentation and route resolution up to 5 levels deep.
    </p>
  </div>

  <CoimCard>
    <CoimCardHeader title="Navigation Hierarchy Routes" subheader={`Active route: ${currentPath}`} />
    <CoimCardContent>
      <CoimList>
        {#each treeRoutes as node (node.href)}
          <CoimListItemButton
            selected={currentPath === node.href}
            onclick={() => void goto(node.href)}
            style={`padding-inline-start: ${node.level * 12}px;`}
          >
            <CoimListItemText primary={node.label} secondary={node.href} />
            <CoimChip label={`Level ${node.level}`} size="small" variant="outlined" />
          </CoimListItemButton>
        {/each}
      </CoimList>

      <div class="mt-4 flex flex-wrap gap-2">
        <CoimButton href="/menu-levels" size="small" variant="outlined">Root Index</CoimButton>
        <CoimButton
          href="/menu-levels/level-two-subs/level-three-subs/level-four-subs/level-five"
          size="small"
          variant="contained"
        >
          Jump to Level 5
        </CoimButton>
      </div>
    </CoimCardContent>
  </CoimCard>
</CoimStack>
