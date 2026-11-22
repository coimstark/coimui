<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import type { CoimColor } from "../../theme/types.js";
  import { cn } from "../../utilities/utils.js";
  import type { BadgeAnchorOrigin } from "./types.js";

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, "class" | "children"> {
    badgeContent?: number | string | Snippet;
    variant?: "standard" | "dot";
    color?: CoimColor;
    max?: number;
    showZero?: boolean;
    invisible?: boolean;
    overlap?: "rectangular" | "circular";
    anchorOrigin?: BadgeAnchorOrigin;
    class?: string;
    badgeClass?: string;
    ariaLabel?: string;
    children?: Snippet;
  }

  let {
    badgeContent,
    variant = "standard",
    color = "primary",
    max = 99,
    showZero = false,
    invisible = false,
    overlap = "rectangular",
    anchorOrigin = { vertical: "top", horizontal: "right" },
    class: className = "",
    badgeClass = "",
    ariaLabel,
    children,
    ...rest
  }: Props = $props();

  const vertical = $derived(anchorOrigin?.vertical ?? "top");
  const horizontal = $derived(anchorOrigin?.horizontal ?? "right");

  const isZero = $derived(variant !== "dot" && badgeContent === 0 && !showZero);
  const isEmpty = $derived(
    variant !== "dot" &&
      (badgeContent === undefined || badgeContent === null || badgeContent === ""),
  );
  const isHidden = $derived(Boolean(invisible || isZero || isEmpty));

  const displayValue = $derived.by(() => {
    if (variant === "dot") return "";
    if (typeof badgeContent === "number") {
      return badgeContent > max ? `${max}+` : String(badgeContent);
    }
    if (typeof badgeContent === "string") {
      return badgeContent;
    }
    return "";
  });

  const isSnippetContent = $derived(typeof badgeContent === "function");
</script>

<span {...rest} class={cn("coim-badge-root relative inline-flex shrink-0 align-middle", className)}>
  {@render children?.()}
  <span
    aria-hidden={isHidden ? "true" : undefined}
    aria-label={!isHidden ? ariaLabel : undefined}
    class={cn(
      "coim-badge font-body text-sm font-semibold",
      `coim-badge-${variant}`,
      `coim-badge-color-${color}`,
      `coim-badge-${vertical}-${horizontal}`,
      overlap === "circular" && "coim-badge-overlap-circular",
      isHidden && "coim-badge-invisible pointer-events-none",
      badgeClass,
    )}
  >
    {#if variant !== "dot"}
      {#if isSnippetContent}
        {@render (badgeContent as Snippet)()}
      {:else}
        {displayValue}
      {/if}
    {/if}
  </span>
</span>
