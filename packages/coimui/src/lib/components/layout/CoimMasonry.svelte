<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import {
    LAYOUT_BREAKPOINTS,
    expandResponsive,
    mergeInlineStyles,
    toSpacingCss,
  } from "./responsive.js";
  import type { CoimMasonryProps } from "./types.js";

  let {
    columns = 4,
    spacing = 2,
    sequential = false,
    defaultColumns,
    defaultSpacing,
    defaultHeight,
    as,
    component,
    class: className = "",
    style,
    children,
    ...rest
  }: CoimMasonryProps = $props();

  const tag = $derived(as ?? component ?? "div");

  const resolvedCols = $derived(expandResponsive<number>(columns, defaultColumns ?? 4));
  const resolvedSpacing = $derived.by(() => {
    const exp = expandResponsive<number | string>(spacing, defaultSpacing ?? 2);
    const out: Record<string, string> = {};
    for (const bp of LAYOUT_BREAKPOINTS) {
      out[bp] = toSpacingCss(exp[bp]);
    }
    return out;
  });

  const computedStyle = $derived.by(() => {
    const vars = [
      `--coim-msn-cols-xs: ${resolvedCols.xs}`,
      `--coim-msn-cols-sm: ${resolvedCols.sm}`,
      `--coim-msn-cols-md: ${resolvedCols.md}`,
      `--coim-msn-cols-lg: ${resolvedCols.lg}`,
      `--coim-msn-cols-xl: ${resolvedCols.xl}`,
      `--coim-msn-cols-2xl: ${resolvedCols["2xl"]}`,
      `--coim-msn-cols-3xl: ${resolvedCols["3xl"]}`,
      `--coim-msn-gap-xs: ${resolvedSpacing.xs}`,
      `--coim-msn-gap-sm: ${resolvedSpacing.sm}`,
      `--coim-msn-gap-md: ${resolvedSpacing.md}`,
      `--coim-msn-gap-lg: ${resolvedSpacing.lg}`,
      `--coim-msn-gap-xl: ${resolvedSpacing.xl}`,
      `--coim-msn-gap-2xl: ${resolvedSpacing["2xl"]}`,
      `--coim-msn-gap-3xl: ${resolvedSpacing["3xl"]}`,
    ];
    if (defaultHeight !== undefined) {
      vars.push(`min-height: ${defaultHeight}px`);
    }
    return mergeInlineStyles(vars.join("; "), style);
  });
</script>

<svelte:element
  this={tag}
  data-sequential={sequential ? "true" : undefined}
  class={cn("coim-masonry", className)}
  style={computedStyle}
  {...rest}
>
  {@render children?.()}
</svelte:element>

<style>
  @layer components {
    .coim-masonry {
      column-count: var(--coim-msn-cols-xs, 4);
      column-gap: var(--coim-msn-gap-xs, 8px);
      width: 100%;
    }

    .coim-masonry > :global(*) {
      break-inside: avoid;
      -webkit-column-break-inside: avoid;
      margin-bottom: var(--coim-msn-gap-xs, 8px);
    }

    @media (min-width: 480px) {
      .coim-masonry {
        column-count: var(--coim-msn-cols-sm, var(--coim-msn-cols-xs, 4));
        column-gap: var(--coim-msn-gap-sm, var(--coim-msn-gap-xs, 8px));
      }
      .coim-masonry > :global(*) {
        margin-bottom: var(--coim-msn-gap-sm, var(--coim-msn-gap-xs, 8px));
      }
    }

    @media (min-width: 960px) {
      .coim-masonry {
        column-count: var(--coim-msn-cols-md, var(--coim-msn-cols-sm, 4));
        column-gap: var(--coim-msn-gap-md, var(--coim-msn-gap-sm, 8px));
      }
      .coim-masonry > :global(*) {
        margin-bottom: var(--coim-msn-gap-md, var(--coim-msn-gap-sm, 8px));
      }
    }

    @media (min-width: 1280px) {
      .coim-masonry {
        column-count: var(--coim-msn-cols-lg, var(--coim-msn-cols-md, 4));
        column-gap: var(--coim-msn-gap-lg, var(--coim-msn-gap-md, 8px));
      }
      .coim-masonry > :global(*) {
        margin-bottom: var(--coim-msn-gap-lg, var(--coim-msn-gap-md, 8px));
      }
    }

    @media (min-width: 1440px) {
      .coim-masonry {
        column-count: var(--coim-msn-cols-xl, var(--coim-msn-cols-lg, 4));
        column-gap: var(--coim-msn-gap-xl, var(--coim-msn-gap-lg, 8px));
      }
      .coim-masonry > :global(*) {
        margin-bottom: var(--coim-msn-gap-xl, var(--coim-msn-gap-lg, 8px));
      }
    }

    @media (min-width: 1640px) {
      .coim-masonry {
        column-count: var(--coim-msn-cols-2xl, var(--coim-msn-cols-xl, 4));
        column-gap: var(--coim-msn-gap-2xl, var(--coim-msn-gap-xl, 8px));
      }
      .coim-masonry > :global(*) {
        margin-bottom: var(--coim-msn-gap-2xl, var(--coim-msn-gap-xl, 8px));
      }
    }

    @media (min-width: 1900px) {
      .coim-masonry {
        column-count: var(--coim-msn-cols-3xl, var(--coim-msn-cols-2xl, 4));
        column-gap: var(--coim-msn-gap-3xl, var(--coim-msn-gap-2xl, 8px));
      }
      .coim-masonry > :global(*) {
        margin-bottom: var(--coim-msn-gap-3xl, var(--coim-msn-gap-2xl, 8px));
      }
    }
  }
</style>
