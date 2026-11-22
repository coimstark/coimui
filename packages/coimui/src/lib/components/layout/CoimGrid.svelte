<script lang="ts">
  import { getContext, setContext, untrack } from "svelte";
  import { cn } from "../../utilities/utils.js";
  import {
    LAYOUT_BREAKPOINTS,
    expandResponsive,
    mergeInlineStyles,
    normalizeResponsive,
    toSpacingCss,
  } from "./responsive.js";
  import type {
    CoimGridProps,
    GridDirection,
    GridOffsetValue,
    GridSizeValue,
    LayoutBreakpoint,
    ResponsiveValue,
  } from "./types.js";

  interface GridContext {
    columns: () => Record<LayoutBreakpoint, number>;
    columnSpacing: () => Record<LayoutBreakpoint, string>;
  }

  const GRID_CONTEXT_KEY = Symbol("coimui-grid-context");

  let {
    container = false,
    spacing = 0,
    rowSpacing,
    columnSpacing,
    columns = 12,
    size,
    offset,
    direction = "row",
    alignItems,
    justifyContent,
    wrap = "wrap",
    as,
    component,
    class: className = "",
    style,
    children,
    ...rest
  }: CoimGridProps = $props();

  const tag = $derived(as ?? component ?? "div");

  const parentContext = getContext<GridContext | undefined>(GRID_CONTEXT_KEY);

  const resolvedColumns = $derived(expandResponsive(columns, 12));

  const resolvedRowSpacing = $derived.by(() => {
    const base = expandResponsive<number | string>(spacing, 0);
    const override = normalizeResponsive(rowSpacing);
    const merged: Partial<Record<LayoutBreakpoint, number | string>> = { ...base };
    for (const bp of LAYOUT_BREAKPOINTS) {
      if (override[bp] !== undefined) merged[bp] = override[bp];
    }
    const expanded = expandResponsive<number | string>(merged, 0);
    const out = {} as Record<LayoutBreakpoint, string>;
    for (const bp of LAYOUT_BREAKPOINTS) {
      out[bp] = toSpacingCss(expanded[bp]);
    }
    return out;
  });

  const resolvedColumnSpacing = $derived.by(() => {
    const base = expandResponsive<number | string>(spacing, 0);
    const override = normalizeResponsive(columnSpacing);
    const merged: Partial<Record<LayoutBreakpoint, number | string>> = { ...base };
    for (const bp of LAYOUT_BREAKPOINTS) {
      if (override[bp] !== undefined) merged[bp] = override[bp];
    }
    const expanded = expandResponsive<number | string>(merged, 0);
    const out = {} as Record<LayoutBreakpoint, string>;
    for (const bp of LAYOUT_BREAKPOINTS) {
      out[bp] = toSpacingCss(expanded[bp]);
    }
    return out;
  });

  if (untrack(() => container)) {
    setContext<GridContext>(GRID_CONTEXT_KEY, {
      columns: () => resolvedColumns,
      columnSpacing: () => resolvedColumnSpacing,
    });
  }

  const sizeClassList = $derived.by(() => {
    if (size === undefined || size === false) return "";
    const map = normalizeResponsive<GridSizeValue>(size);
    const classes: string[] = ["coim-grid-item"];
    for (const bp of LAYOUT_BREAKPOINTS) {
      const val = map[bp];
      if (val !== undefined && val !== false) {
        classes.push(`coim-grid-${bp}-${String(val)}`);
      }
    }
    return classes.join(" ");
  });

  const computedStyle = $derived.by(() => {
    const vars: string[] = [];

    if (container) {
      const dirMap = normalizeResponsive(direction);
      const expandedDir = expandResponsive<GridDirection>(direction, "row");
      const baseSpacingMap = normalizeResponsive(spacing);
      const rowSpacingMap = normalizeResponsive(rowSpacing);
      const colSpacingMap = normalizeResponsive(columnSpacing);

      for (const bp of LAYOUT_BREAKPOINTS) {
        if (bp === "xs" || dirMap[bp] !== undefined) {
          vars.push(`--coim-gc-dir-${bp}: ${expandedDir[bp]}`);
        }
        if (bp === "xs" || baseSpacingMap[bp] !== undefined || rowSpacingMap[bp] !== undefined) {
          vars.push(`--coim-gc-rgap-${bp}: ${resolvedRowSpacing[bp]}`);
        }
        if (bp === "xs" || baseSpacingMap[bp] !== undefined || colSpacingMap[bp] !== undefined) {
          vars.push(`--coim-gc-cgap-${bp}: ${resolvedColumnSpacing[bp]}`);
        }
      }

      if (wrap !== "wrap") vars.push(`flex-wrap: ${wrap}`);
      if (alignItems) vars.push(`align-items: ${alignItems}`);
      if (justifyContent) vars.push(`justify-content: ${justifyContent}`);
    }

    const pCols = parentContext ? parentContext.columns() : expandResponsive(12, 12);
    const pColGaps = parentContext ? parentContext.columnSpacing() : expandResponsive("0px", "0px");

    const sizeMap = normalizeResponsive<GridSizeValue>(size);
    const hasSize = size !== undefined && Object.keys(sizeMap).length > 0;

    if (hasSize) {
      const expandedSize = expandResponsive<GridSizeValue>(size, false);
      let prevSig = "";
      for (const bp of LAYOUT_BREAKPOINTS) {
        const s = expandedSize[bp];
        const cols = pCols[bp];
        const gap = pColGaps[bp];
        const sig = `${String(s)}|${cols}|${gap}`;
        if (bp === "xs" || sig !== prevSig || sizeMap[bp] !== undefined) {
          prevSig = sig;
          if (s === "grow") {
            vars.push(`--coim-gi-gg-${bp}: 1`);
            vars.push(`--coim-gi-gb-${bp}: 0`);
            vars.push(`--coim-gi-gw-${bp}: auto`);
            vars.push(`--coim-gi-gmw-${bp}: 100%`);
          } else if (s === "auto") {
            vars.push(`--coim-gi-gg-${bp}: 0`);
            vars.push(`--coim-gi-gb-${bp}: auto`);
            vars.push(`--coim-gi-gw-${bp}: auto`);
            vars.push(`--coim-gi-gmw-${bp}: none`);
          } else if (typeof s === "number") {
            vars.push(`--coim-gi-gg-${bp}: 0`);
            vars.push(`--coim-gi-gb-${bp}: auto`);
            vars.push(
              `--coim-gi-gw-${bp}: calc(100% * ${s} / ${cols} - (${cols} - ${s}) * (${gap} / ${cols}))`,
            );
            vars.push(`--coim-gi-gmw-${bp}: none`);
          } else if (container) {
            vars.push(`--coim-gi-gg-${bp}: 0`);
            vars.push(`--coim-gi-gb-${bp}: auto`);
            vars.push(`--coim-gi-gw-${bp}: 100%`);
            vars.push(`--coim-gi-gmw-${bp}: 100%`);
          }
        }
      }
    } else if (container) {
      vars.push(`--coim-gi-gg-xs: 0`);
      vars.push(`--coim-gi-gb-xs: auto`);
      vars.push(`--coim-gi-gw-xs: 100%`);
      vars.push(`--coim-gi-gmw-xs: 100%`);
    }

    if (offset !== undefined) {
      const offsetMap = normalizeResponsive<GridOffsetValue>(offset);
      const expandedOffset = expandResponsive<GridOffsetValue | undefined>(offset, undefined);
      let prevSig = "";
      for (const bp of LAYOUT_BREAKPOINTS) {
        const off = expandedOffset[bp];
        const cols = pCols[bp];
        const gap = pColGaps[bp];
        const sig = `${String(off)}|${cols}|${gap}`;
        if ((bp === "xs" && off !== undefined) || (off !== undefined && (sig !== prevSig || offsetMap[bp] !== undefined))) {
          prevSig = sig;
          if (off === "auto") {
            vars.push(`--coim-gi-go-${bp}: auto`);
          } else if (typeof off === "number") {
            vars.push(
              `--coim-gi-go-${bp}: ${off === 0 ? "0px" : `calc(100% * ${off} / ${cols} + ${gap} * ${off} / ${cols})`}`,
            );
          }
        }
      }
    }

    return mergeInlineStyles(vars.join("; "), style);
  });
</script>

<svelte:element
  this={tag}
  class={cn(
    "coim-grid",
    container && "coim-grid-container",
    sizeClassList,
    className,
  )}
  style={computedStyle}
  {...rest}
>
  {@render children?.()}
</svelte:element>

<style>
  @layer components {
    .coim-grid {
      box-sizing: border-box;
      min-width: 0;
      --coim-gc-dir-xs: initial;
      --coim-gc-dir-sm: initial;
      --coim-gc-dir-md: initial;
      --coim-gc-dir-lg: initial;
      --coim-gc-dir-xl: initial;
      --coim-gc-dir-2xl: initial;
      --coim-gc-dir-3xl: initial;
      --coim-gc-rgap-xs: initial;
      --coim-gc-rgap-sm: initial;
      --coim-gc-rgap-md: initial;
      --coim-gc-rgap-lg: initial;
      --coim-gc-rgap-xl: initial;
      --coim-gc-rgap-2xl: initial;
      --coim-gc-rgap-3xl: initial;
      --coim-gc-cgap-xs: initial;
      --coim-gc-cgap-sm: initial;
      --coim-gc-cgap-md: initial;
      --coim-gc-cgap-lg: initial;
      --coim-gc-cgap-xl: initial;
      --coim-gc-cgap-2xl: initial;
      --coim-gc-cgap-3xl: initial;
      --coim-gi-gg-xs: initial;
      --coim-gi-gg-sm: initial;
      --coim-gi-gg-md: initial;
      --coim-gi-gg-lg: initial;
      --coim-gi-gg-xl: initial;
      --coim-gi-gg-2xl: initial;
      --coim-gi-gg-3xl: initial;
      --coim-gi-gb-xs: initial;
      --coim-gi-gb-sm: initial;
      --coim-gi-gb-md: initial;
      --coim-gi-gb-lg: initial;
      --coim-gi-gb-xl: initial;
      --coim-gi-gb-2xl: initial;
      --coim-gi-gb-3xl: initial;
      --coim-gi-gw-xs: initial;
      --coim-gi-gw-sm: initial;
      --coim-gi-gw-md: initial;
      --coim-gi-gw-lg: initial;
      --coim-gi-gw-xl: initial;
      --coim-gi-gw-2xl: initial;
      --coim-gi-gw-3xl: initial;
      --coim-gi-gmw-xs: initial;
      --coim-gi-gmw-sm: initial;
      --coim-gi-gmw-md: initial;
      --coim-gi-gmw-lg: initial;
      --coim-gi-gmw-xl: initial;
      --coim-gi-gmw-2xl: initial;
      --coim-gi-gmw-3xl: initial;
      --coim-gi-go-xs: initial;
      --coim-gi-go-sm: initial;
      --coim-gi-go-md: initial;
      --coim-gi-go-lg: initial;
      --coim-gi-go-xl: initial;
      --coim-gi-go-2xl: initial;
      --coim-gi-go-3xl: initial;

      flex-grow: var(--coim-gi-gg-xs, 0);
      flex-basis: var(--coim-gi-gb-xs, auto);
      width: var(--coim-gi-gw-xs, auto);
      max-width: var(--coim-gi-gmw-xs, none);
      margin-inline-start: var(--coim-gi-go-xs, 0px);
    }

    .coim-grid-container {
      display: flex;
      flex-wrap: wrap;
      flex-direction: var(--coim-gc-dir-xs, row);
      row-gap: var(--coim-gc-rgap-xs, 0px);
      column-gap: var(--coim-gc-cgap-xs, 0px);
    }

    @media (min-width: 480px) {
      .coim-grid {
        flex-grow: var(--coim-gi-gg-sm, var(--coim-gi-gg-xs, 0));
        flex-basis: var(--coim-gi-gb-sm, var(--coim-gi-gb-xs, auto));
        width: var(--coim-gi-gw-sm, var(--coim-gi-gw-xs, auto));
        max-width: var(--coim-gi-gmw-sm, var(--coim-gi-gmw-xs, none));
        margin-inline-start: var(--coim-gi-go-sm, var(--coim-gi-go-xs, 0px));
      }
      .coim-grid-container {
        flex-direction: var(--coim-gc-dir-sm, var(--coim-gc-dir-xs, row));
        row-gap: var(--coim-gc-rgap-sm, var(--coim-gc-rgap-xs, 0px));
        column-gap: var(--coim-gc-cgap-sm, var(--coim-gc-cgap-xs, 0px));
      }
    }

    @media (min-width: 960px) {
      .coim-grid {
        flex-grow: var(--coim-gi-gg-md, var(--coim-gi-gg-sm, var(--coim-gi-gg-xs, 0)));
        flex-basis: var(--coim-gi-gb-md, var(--coim-gi-gb-sm, var(--coim-gi-gb-xs, auto)));
        width: var(--coim-gi-gw-md, var(--coim-gi-gw-sm, var(--coim-gi-gw-xs, auto)));
        max-width: var(--coim-gi-gmw-md, var(--coim-gi-gmw-sm, var(--coim-gi-gmw-xs, none)));
        margin-inline-start: var(--coim-gi-go-md, var(--coim-gi-go-sm, var(--coim-gi-go-xs, 0px)));
      }
      .coim-grid-container {
        flex-direction: var(
          --coim-gc-dir-md,
          var(--coim-gc-dir-sm, var(--coim-gc-dir-xs, row))
        );
        row-gap: var(--coim-gc-rgap-md, var(--coim-gc-rgap-sm, var(--coim-gc-rgap-xs, 0px)));
        column-gap: var(--coim-gc-cgap-md, var(--coim-gc-cgap-sm, var(--coim-gc-cgap-xs, 0px)));
      }
    }

    @media (min-width: 1280px) {
      .coim-grid {
        flex-grow: var(
          --coim-gi-gg-lg,
          var(--coim-gi-gg-md, var(--coim-gi-gg-sm, var(--coim-gi-gg-xs, 0)))
        );
        flex-basis: var(
          --coim-gi-gb-lg,
          var(--coim-gi-gb-md, var(--coim-gi-gb-sm, var(--coim-gi-gb-xs, auto)))
        );
        width: var(
          --coim-gi-gw-lg,
          var(--coim-gi-gw-md, var(--coim-gi-gw-sm, var(--coim-gi-gw-xs, auto)))
        );
        max-width: var(
          --coim-gi-gmw-lg,
          var(--coim-gi-gmw-md, var(--coim-gi-gmw-sm, var(--coim-gi-gmw-xs, none)))
        );
        margin-inline-start: var(
          --coim-gi-go-lg,
          var(--coim-gi-go-md, var(--coim-gi-go-sm, var(--coim-gi-go-xs, 0px)))
        );
      }
      .coim-grid-container {
        flex-direction: var(
          --coim-gc-dir-lg,
          var(--coim-gc-dir-md, var(--coim-gc-dir-sm, var(--coim-gc-dir-xs, row)))
        );
        row-gap: var(
          --coim-gc-rgap-lg,
          var(--coim-gc-rgap-md, var(--coim-gc-rgap-sm, var(--coim-gc-rgap-xs, 0px)))
        );
        column-gap: var(
          --coim-gc-cgap-lg,
          var(--coim-gc-cgap-md, var(--coim-gc-cgap-sm, var(--coim-gc-cgap-xs, 0px)))
        );
      }
    }

    @media (min-width: 1440px) {
      .coim-grid {
        flex-grow: var(
          --coim-gi-gg-xl,
          var(
            --coim-gi-gg-lg,
            var(--coim-gi-gg-md, var(--coim-gi-gg-sm, var(--coim-gi-gg-xs, 0)))
          )
        );
        flex-basis: var(
          --coim-gi-gb-xl,
          var(
            --coim-gi-gb-lg,
            var(--coim-gi-gb-md, var(--coim-gi-gb-sm, var(--coim-gi-gb-xs, auto)))
          )
        );
        width: var(
          --coim-gi-gw-xl,
          var(
            --coim-gi-gw-lg,
            var(--coim-gi-gw-md, var(--coim-gi-gw-sm, var(--coim-gi-gw-xs, auto)))
          )
        );
        max-width: var(
          --coim-gi-gmw-xl,
          var(
            --coim-gi-gmw-lg,
            var(--coim-gi-gmw-md, var(--coim-gi-gmw-sm, var(--coim-gi-gmw-xs, none)))
          )
        );
        margin-inline-start: var(
          --coim-gi-go-xl,
          var(
            --coim-gi-go-lg,
            var(--coim-gi-go-md, var(--coim-gi-go-sm, var(--coim-gi-go-xs, 0px)))
          )
        );
      }
      .coim-grid-container {
        flex-direction: var(
          --coim-gc-dir-xl,
          var(
            --coim-gc-dir-lg,
            var(--coim-gc-dir-md, var(--coim-gc-dir-sm, var(--coim-gc-dir-xs, row)))
          )
        );
        row-gap: var(
          --coim-gc-rgap-xl,
          var(
            --coim-gc-rgap-lg,
            var(--coim-gc-rgap-md, var(--coim-gc-rgap-sm, var(--coim-gc-rgap-xs, 0px)))
          )
        );
        column-gap: var(
          --coim-gc-cgap-xl,
          var(
            --coim-gc-cgap-lg,
            var(--coim-gc-cgap-md, var(--coim-gc-cgap-sm, var(--coim-gc-cgap-xs, 0px)))
          )
        );
      }
    }

    @media (min-width: 1640px) {
      .coim-grid {
        flex-grow: var(
          --coim-gi-gg-2xl,
          var(
            --coim-gi-gg-xl,
            var(
              --coim-gi-gg-lg,
              var(--coim-gi-gg-md, var(--coim-gi-gg-sm, var(--coim-gi-gg-xs, 0)))
            )
          )
        );
        flex-basis: var(
          --coim-gi-gb-2xl,
          var(
            --coim-gi-gb-xl,
            var(
              --coim-gi-gb-lg,
              var(--coim-gi-gb-md, var(--coim-gi-gb-sm, var(--coim-gi-gb-xs, auto)))
            )
          )
        );
        width: var(
          --coim-gi-gw-2xl,
          var(
            --coim-gi-gw-xl,
            var(
              --coim-gi-gw-lg,
              var(--coim-gi-gw-md, var(--coim-gi-gw-sm, var(--coim-gi-gw-xs, auto)))
            )
          )
        );
        max-width: var(
          --coim-gi-gmw-2xl,
          var(
            --coim-gi-gmw-xl,
            var(
              --coim-gi-gmw-lg,
              var(--coim-gi-gmw-md, var(--coim-gi-gmw-sm, var(--coim-gi-gmw-xs, none)))
            )
          )
        );
        margin-inline-start: var(
          --coim-gi-go-2xl,
          var(
            --coim-gi-go-xl,
            var(
              --coim-gi-go-lg,
              var(--coim-gi-go-md, var(--coim-gi-go-sm, var(--coim-gi-go-xs, 0px)))
            )
          )
        );
      }
      .coim-grid-container {
        flex-direction: var(
          --coim-gc-dir-2xl,
          var(
            --coim-gc-dir-xl,
            var(
              --coim-gc-dir-lg,
              var(--coim-gc-dir-md, var(--coim-gc-dir-sm, var(--coim-gc-dir-xs, row)))
            )
          )
        );
        row-gap: var(
          --coim-gc-rgap-2xl,
          var(
            --coim-gc-rgap-xl,
            var(
              --coim-gc-rgap-lg,
              var(--coim-gc-rgap-md, var(--coim-gc-rgap-sm, var(--coim-gc-rgap-xs, 0px)))
            )
          )
        );
        column-gap: var(
          --coim-gc-cgap-2xl,
          var(
            --coim-gc-cgap-xl,
            var(
              --coim-gc-cgap-lg,
              var(--coim-gc-cgap-md, var(--coim-gc-cgap-sm, var(--coim-gc-cgap-xs, 0px)))
            )
          )
        );
      }
    }

    @media (min-width: 1900px) {
      .coim-grid {
        flex-grow: var(
          --coim-gi-gg-3xl,
          var(
            --coim-gi-gg-2xl,
            var(
              --coim-gi-gg-xl,
              var(
                --coim-gi-gg-lg,
                var(--coim-gi-gg-md, var(--coim-gi-gg-sm, var(--coim-gi-gg-xs, 0)))
              )
            )
          )
        );
        flex-basis: var(
          --coim-gi-gb-3xl,
          var(
            --coim-gi-gb-2xl,
            var(
              --coim-gi-gb-xl,
              var(
                --coim-gi-gb-lg,
                var(--coim-gi-gb-md, var(--coim-gi-gb-sm, var(--coim-gi-gb-xs, auto)))
              )
            )
          )
        );
        width: var(
          --coim-gi-gw-3xl,
          var(
            --coim-gi-gw-2xl,
            var(
              --coim-gi-gw-xl,
              var(
                --coim-gi-gw-lg,
                var(--coim-gi-gw-md, var(--coim-gi-gw-sm, var(--coim-gi-gw-xs, auto)))
              )
            )
          )
        );
        max-width: var(
          --coim-gi-gmw-3xl,
          var(
            --coim-gi-gmw-2xl,
            var(
              --coim-gi-gmw-xl,
              var(
                --coim-gi-gmw-lg,
                var(--coim-gi-gmw-md, var(--coim-gi-gmw-sm, var(--coim-gi-gmw-xs, none)))
              )
            )
          )
        );
        margin-inline-start: var(
          --coim-gi-go-3xl,
          var(
            --coim-gi-go-2xl,
            var(
              --coim-gi-go-xl,
              var(
                --coim-gi-go-lg,
                var(--coim-gi-go-md, var(--coim-gi-go-sm, var(--coim-gi-go-xs, 0px)))
              )
            )
          )
        );
      }
      .coim-grid-container {
        flex-direction: var(
          --coim-gc-dir-3xl,
          var(
            --coim-gc-dir-2xl,
            var(
              --coim-gc-dir-xl,
              var(
                --coim-gc-dir-lg,
                var(--coim-gc-dir-md, var(--coim-gc-dir-sm, var(--coim-gc-dir-xs, row)))
              )
            )
          )
        );
        row-gap: var(
          --coim-gc-rgap-3xl,
          var(
            --coim-gc-rgap-2xl,
            var(
              --coim-gc-rgap-xl,
              var(
                --coim-gc-rgap-lg,
                var(--coim-gc-rgap-md, var(--coim-gc-rgap-sm, var(--coim-gc-rgap-xs, 0px)))
              )
            )
          )
        );
        column-gap: var(
          --coim-gc-cgap-3xl,
          var(
            --coim-gc-cgap-2xl,
            var(
              --coim-gc-cgap-xl,
              var(
                --coim-gc-cgap-lg,
                var(--coim-gc-cgap-md, var(--coim-gc-cgap-sm, var(--coim-gc-cgap-xs, 0px)))
              )
            )
          )
        );
      }
    }
  }
</style>
