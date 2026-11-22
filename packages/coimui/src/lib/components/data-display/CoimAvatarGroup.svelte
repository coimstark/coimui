<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { SvelteSet } from "svelte/reactivity";
  import type { CoimColor } from "../../theme/types.js";
  import { cn } from "../../utilities/utils.js";
  import CoimAvatar from "./CoimAvatar.svelte";
  import type { CoimAvatarItem } from "./types.js";
  import {
    setAvatarGroupContext,
    type AvatarSize,
    type AvatarVariant,
  } from "./avatar-context.js";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "class" | "children"> {
    max?: number;
    total?: number;
    size?: AvatarSize;
    variant?: AvatarVariant;
    spacing?: "medium" | "small" | number;
    avatars?: CoimAvatarItem[];
    renderSurplus?: Snippet<[number]>;
    class?: string;
    surplusClass?: string;
    children?: Snippet;
  }

  let {
    max = 5,
    total,
    size = "medium",
    variant = "circular",
    spacing = "medium",
    avatars,
    renderSurplus,
    class: className = "",
    surplusClass = "",
    children,
    ...rest
  }: Props = $props();

  let nextIdx = 0;
  const mountedIndices = new SvelteSet<number>();

  const effectiveTotalFromChildren = $derived(total ?? mountedIndices.size);
  const childVisibleLimit = $derived.by(() => {
    const count = mountedIndices.size;
    if (count === 0) return max;
    if (total !== undefined && total > count) {
      return Math.min(count, max);
    }
    if (count > max) {
      return Math.max(0, max - 1);
    }
    return count;
  });

  setAvatarGroupContext({
    get size() {
      return size;
    },
    get variant() {
      return variant;
    },
    registerIndex: () => nextIdx++,
    registerMounted: (index: number) => {
      mountedIndices.add(index);
      return () => {
        mountedIndices.delete(index);
      };
    },
    isIndexVisible: (index: number) => {
      if (mountedIndices.size === 0) return index < max;
      return index < childVisibleLimit;
    },
  });

  const resolvedSpacingPx = $derived.by(() => {
    if (typeof spacing === "number") return `${-Math.abs(spacing)}px`;
    return spacing === "small" ? "-16px" : "-8px";
  });

  const dataVisibleItems = $derived.by(() => {
    if (!avatars) return [];
    const totalCount = total ?? avatars.length;
    if (total !== undefined && total > avatars.length) {
      return avatars.slice(0, max);
    }
    if (avatars.length > max) {
      return avatars.slice(0, Math.max(0, max - 1));
    }
    return avatars;
  });

  const surplusCount = $derived.by(() => {
    if (avatars) {
      const totalCount = total ?? avatars.length;
      return Math.max(0, totalCount - dataVisibleItems.length);
    }
    if (total !== undefined) {
      const shown = mountedIndices.size > 0 ? childVisibleLimit : max;
      return Math.max(0, total - shown);
    }
    if (mountedIndices.size > max) {
      return mountedIndices.size - childVisibleLimit;
    }
    return Math.max(0, effectiveTotalFromChildren - childVisibleLimit);
  });
</script>

<div
  role="group"
  style={`--coim-avatar-group-spacing: ${resolvedSpacingPx};`}
  {...rest}
  class={cn("coim-avatar-group inline-flex items-center", size, className)}
>
  {#if avatars}
    {#each dataVisibleItems as item, index (item.id ?? `${item.src ?? ""}-${item.alt ?? ""}-${index}`)}
      <CoimAvatar
        src={item.src}
        alt={item.alt ?? ""}
        initials={item.initials}
        color={item.color}
        variant={item.variant ?? variant}
        {size}
      />
    {/each}
  {:else}
    {@render children?.()}
  {/if}

  {#if surplusCount > 0}
    <CoimAvatar
      {size}
      {variant}
      class={cn("coim-avatar-group-surplus bg-grey-200 text-text-primary", surplusClass)}
      aria-label={`${surplusCount} more`}
    >
      {#if renderSurplus}
        {@render renderSurplus(surplusCount)}
      {:else}
        +{surplusCount}
      {/if}
    </CoimAvatar>
  {/if}
</div>
