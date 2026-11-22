<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import {
    LAYOUT_BREAKPOINTS,
    expandResponsive,
    mergeInlineStyles,
    normalizeResponsive,
    toSpacingCss,
  } from "./responsive.js";
  import type { CoimStackProps, LayoutBreakpoint, StackDirection } from "./types.js";

  let {
    direction = "column",
    spacing = 0,
    divider,
    alignItems,
    justifyContent,
    useFlexGap = true,
    as,
    component,
    class: className = "",
    style,
    children,
    ...rest
  }: CoimStackProps = $props();

  const tag = $derived(as ?? component ?? "div");

  let stackEl = $state<HTMLElement | null>(null);
  let dividerTemplateEl = $state<HTMLDivElement | null>(null);

  const computedStyle = $derived.by(() => {
    const vars: string[] = [];
    const dirMap = normalizeResponsive(direction);
    const expandedDir = expandResponsive<StackDirection>(direction, "column");
    const spacingMap = normalizeResponsive(spacing);
    const expandedSpacing = expandResponsive<number | string>(spacing, 0);

    for (const bp of LAYOUT_BREAKPOINTS) {
      if (bp === "xs" || dirMap[bp] !== undefined) {
        vars.push(`--coim-stack-dir-${bp}: ${expandedDir[bp]}`);
      }
      if (useFlexGap) {
        if (bp === "xs" || spacingMap[bp] !== undefined) {
          vars.push(`--coim-stack-gap-${bp}: ${toSpacingCss(expandedSpacing[bp])}`);
        }
      } else if (bp === "xs" || dirMap[bp] !== undefined || spacingMap[bp] !== undefined) {
        const d = expandedDir[bp];
        const gapVal = toSpacingCss(expandedSpacing[bp]);
        vars.push(`--coim-stack-mt-${bp}: ${d === "column" ? gapVal : "0px"}`);
        vars.push(`--coim-stack-mb-${bp}: ${d === "column-reverse" ? gapVal : "0px"}`);
        vars.push(`--coim-stack-ms-${bp}: ${d === "row" ? gapVal : "0px"}`);
        vars.push(`--coim-stack-me-${bp}: ${d === "row-reverse" ? gapVal : "0px"}`);
      }
    }

    if (alignItems) vars.push(`align-items: ${alignItems}`);
    if (justifyContent) vars.push(`justify-content: ${justifyContent}`);

    return mergeInlineStyles(vars.join("; "), style);
  });

  function syncDividers() {
    if (!stackEl || !dividerTemplateEl || typeof document === "undefined") return;

    const existingClones = stackEl.querySelectorAll(":scope > [data-coim-stack-divider-clone]");
    for (const node of existingClones) {
      node.remove();
    }

    const templateChildren = Array.from(dividerTemplateEl.children);
    if (templateChildren.length === 0) return;

    const realChildren = Array.from(stackEl.children).filter(
      (el) =>
        !el.hasAttribute("data-coim-stack-divider-template") &&
        !el.hasAttribute("data-coim-stack-divider-clone") &&
        el.tagName !== "STYLE",
    );

    for (let i = 1; i < realChildren.length; i++) {
      const target = realChildren[i];
      for (const tmplChild of templateChildren) {
        const clone = tmplChild.cloneNode(true) as HTMLElement;
        clone.setAttribute("data-coim-stack-divider-clone", "");
        stackEl.insertBefore(clone, target);
      }
    }
  }

  $effect(() => {
    if (!divider || !stackEl || !dividerTemplateEl) return;

    let isSyncing = false;
    const runSync = () => {
      if (isSyncing) return;
      isSyncing = true;
      try {
        syncDividers();
      } finally {
        isSyncing = false;
      }
    };

    runSync();

    if (typeof MutationObserver !== "function") return;
    const observer = new MutationObserver(() => {
      runSync();
    });
    observer.observe(stackEl, { childList: true });
    observer.observe(dividerTemplateEl, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  });
</script>

<svelte:element
  this={tag}
  bind:this={stackEl}
  class={cn(
    "coim-stack",
    !useFlexGap && "coim-stack-no-flex-gap",
    className,
  )}
  style={computedStyle}
  {...rest}
>
  {#if divider}
    <div
      bind:this={dividerTemplateEl}
      hidden
      aria-hidden="true"
      data-coim-stack-divider-template=""
      style="display: none;"
    >
      {@render divider()}
    </div>
  {/if}
  {@render children?.()}
</svelte:element>

<style>
  @layer components {
    .coim-stack {
      display: flex;
      min-width: 0;
      --coim-stack-dir-xs: initial;
      --coim-stack-dir-sm: initial;
      --coim-stack-dir-md: initial;
      --coim-stack-dir-lg: initial;
      --coim-stack-dir-xl: initial;
      --coim-stack-dir-2xl: initial;
      --coim-stack-dir-3xl: initial;
      --coim-stack-gap-xs: initial;
      --coim-stack-gap-sm: initial;
      --coim-stack-gap-md: initial;
      --coim-stack-gap-lg: initial;
      --coim-stack-gap-xl: initial;
      --coim-stack-gap-2xl: initial;
      --coim-stack-gap-3xl: initial;
      --coim-stack-mt-xs: initial;
      --coim-stack-mt-sm: initial;
      --coim-stack-mt-md: initial;
      --coim-stack-mt-lg: initial;
      --coim-stack-mt-xl: initial;
      --coim-stack-mt-2xl: initial;
      --coim-stack-mt-3xl: initial;
      --coim-stack-mb-xs: initial;
      --coim-stack-mb-sm: initial;
      --coim-stack-mb-md: initial;
      --coim-stack-mb-lg: initial;
      --coim-stack-mb-xl: initial;
      --coim-stack-mb-2xl: initial;
      --coim-stack-mb-3xl: initial;
      --coim-stack-ms-xs: initial;
      --coim-stack-ms-sm: initial;
      --coim-stack-ms-md: initial;
      --coim-stack-ms-lg: initial;
      --coim-stack-ms-xl: initial;
      --coim-stack-ms-2xl: initial;
      --coim-stack-ms-3xl: initial;
      --coim-stack-me-xs: initial;
      --coim-stack-me-sm: initial;
      --coim-stack-me-md: initial;
      --coim-stack-me-lg: initial;
      --coim-stack-me-xl: initial;
      --coim-stack-me-2xl: initial;
      --coim-stack-me-3xl: initial;
      flex-direction: var(--coim-stack-dir-xs, column);
    }

    .coim-stack:not(.coim-stack-no-flex-gap) {
      gap: var(--coim-stack-gap-xs, 0px);
    }

    .coim-stack-no-flex-gap > :global(:not([hidden]):not(style) ~ :not([hidden]):not(style)) {
      margin-top: var(--coim-stack-mt-xs, 0px);
      margin-bottom: var(--coim-stack-mb-xs, 0px);
      margin-inline-start: var(--coim-stack-ms-xs, 0px);
      margin-inline-end: var(--coim-stack-me-xs, 0px);
    }

    @media (min-width: 480px) {
      .coim-stack {
        flex-direction: var(--coim-stack-dir-sm, var(--coim-stack-dir-xs, column));
      }
      .coim-stack:not(.coim-stack-no-flex-gap) {
        gap: var(--coim-stack-gap-sm, var(--coim-stack-gap-xs, 0px));
      }
      .coim-stack-no-flex-gap > :global(:not([hidden]):not(style) ~ :not([hidden]):not(style)) {
        margin-top: var(--coim-stack-mt-sm, var(--coim-stack-mt-xs, 0px));
        margin-bottom: var(--coim-stack-mb-sm, var(--coim-stack-mb-xs, 0px));
        margin-inline-start: var(--coim-stack-ms-sm, var(--coim-stack-ms-xs, 0px));
        margin-inline-end: var(--coim-stack-me-sm, var(--coim-stack-me-xs, 0px));
      }
    }

    @media (min-width: 960px) {
      .coim-stack {
        flex-direction: var(
          --coim-stack-dir-md,
          var(--coim-stack-dir-sm, var(--coim-stack-dir-xs, column))
        );
      }
      .coim-stack:not(.coim-stack-no-flex-gap) {
        gap: var(
          --coim-stack-gap-md,
          var(--coim-stack-gap-sm, var(--coim-stack-gap-xs, 0px))
        );
      }
      .coim-stack-no-flex-gap > :global(:not([hidden]):not(style) ~ :not([hidden]):not(style)) {
        margin-top: var(--coim-stack-mt-md, var(--coim-stack-mt-sm, var(--coim-stack-mt-xs, 0px)));
        margin-bottom: var(
          --coim-stack-mb-md,
          var(--coim-stack-mb-sm, var(--coim-stack-mb-xs, 0px))
        );
        margin-inline-start: var(
          --coim-stack-ms-md,
          var(--coim-stack-ms-sm, var(--coim-stack-ms-xs, 0px))
        );
        margin-inline-end: var(
          --coim-stack-me-md,
          var(--coim-stack-me-sm, var(--coim-stack-me-xs, 0px))
        );
      }
    }

    @media (min-width: 1280px) {
      .coim-stack {
        flex-direction: var(
          --coim-stack-dir-lg,
          var(--coim-stack-dir-md, var(--coim-stack-dir-sm, var(--coim-stack-dir-xs, column)))
        );
      }
      .coim-stack:not(.coim-stack-no-flex-gap) {
        gap: var(
          --coim-stack-gap-lg,
          var(--coim-stack-gap-md, var(--coim-stack-gap-sm, var(--coim-stack-gap-xs, 0px)))
        );
      }
      .coim-stack-no-flex-gap > :global(:not([hidden]):not(style) ~ :not([hidden]):not(style)) {
        margin-top: var(
          --coim-stack-mt-lg,
          var(--coim-stack-mt-md, var(--coim-stack-mt-sm, var(--coim-stack-mt-xs, 0px)))
        );
        margin-bottom: var(
          --coim-stack-mb-lg,
          var(--coim-stack-mb-md, var(--coim-stack-mb-sm, var(--coim-stack-mb-xs, 0px)))
        );
        margin-inline-start: var(
          --coim-stack-ms-lg,
          var(--coim-stack-ms-md, var(--coim-stack-ms-sm, var(--coim-stack-ms-xs, 0px)))
        );
        margin-inline-end: var(
          --coim-stack-me-lg,
          var(--coim-stack-me-md, var(--coim-stack-me-sm, var(--coim-stack-me-xs, 0px)))
        );
      }
    }

    @media (min-width: 1440px) {
      .coim-stack {
        flex-direction: var(
          --coim-stack-dir-xl,
          var(
            --coim-stack-dir-lg,
            var(--coim-stack-dir-md, var(--coim-stack-dir-sm, var(--coim-stack-dir-xs, column)))
          )
        );
      }
      .coim-stack:not(.coim-stack-no-flex-gap) {
        gap: var(
          --coim-stack-gap-xl,
          var(
            --coim-stack-gap-lg,
            var(--coim-stack-gap-md, var(--coim-stack-gap-sm, var(--coim-stack-gap-xs, 0px)))
          )
        );
      }
      .coim-stack-no-flex-gap > :global(:not([hidden]):not(style) ~ :not([hidden]):not(style)) {
        margin-top: var(
          --coim-stack-mt-xl,
          var(
            --coim-stack-mt-lg,
            var(--coim-stack-mt-md, var(--coim-stack-mt-sm, var(--coim-stack-mt-xs, 0px)))
          )
        );
        margin-bottom: var(
          --coim-stack-mb-xl,
          var(
            --coim-stack-mb-lg,
            var(--coim-stack-mb-md, var(--coim-stack-mb-sm, var(--coim-stack-mb-xs, 0px)))
          )
        );
        margin-inline-start: var(
          --coim-stack-ms-xl,
          var(
            --coim-stack-ms-lg,
            var(--coim-stack-ms-md, var(--coim-stack-ms-sm, var(--coim-stack-ms-xs, 0px)))
          )
        );
        margin-inline-end: var(
          --coim-stack-me-xl,
          var(
            --coim-stack-me-lg,
            var(--coim-stack-me-md, var(--coim-stack-me-sm, var(--coim-stack-me-xs, 0px)))
          )
        );
      }
    }

    @media (min-width: 1640px) {
      .coim-stack {
        flex-direction: var(
          --coim-stack-dir-2xl,
          var(
            --coim-stack-dir-xl,
            var(
              --coim-stack-dir-lg,
              var(--coim-stack-dir-md, var(--coim-stack-dir-sm, var(--coim-stack-dir-xs, column)))
            )
          )
        );
      }
      .coim-stack:not(.coim-stack-no-flex-gap) {
        gap: var(
          --coim-stack-gap-2xl,
          var(
            --coim-stack-gap-xl,
            var(
              --coim-stack-gap-lg,
              var(--coim-stack-gap-md, var(--coim-stack-gap-sm, var(--coim-stack-gap-xs, 0px)))
            )
          )
        );
      }
    }

    @media (min-width: 1900px) {
      .coim-stack {
        flex-direction: var(
          --coim-stack-dir-3xl,
          var(
            --coim-stack-dir-2xl,
            var(
              --coim-stack-dir-xl,
              var(
                --coim-stack-dir-lg,
                var(--coim-stack-dir-md, var(--coim-stack-dir-sm, var(--coim-stack-dir-xs, column)))
              )
            )
          )
        );
      }
      .coim-stack:not(.coim-stack-no-flex-gap) {
        gap: var(
          --coim-stack-gap-3xl,
          var(
            --coim-stack-gap-2xl,
            var(
              --coim-stack-gap-xl,
              var(
                --coim-stack-gap-lg,
                var(--coim-stack-gap-md, var(--coim-stack-gap-sm, var(--coim-stack-gap-xs, 0px)))
              )
            )
          )
        );
      }
    }
  }
</style>
