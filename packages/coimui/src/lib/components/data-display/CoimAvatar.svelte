<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import CiUser from "../../icons/ui/CiUser.svelte";
  import type { CoimColor } from "../../theme/types.js";
  import { cn } from "../../utilities/utils.js";
  import {
    tryGetAvatarGroupContext,
    type AvatarSize,
    type AvatarVariant,
  } from "./avatar-context.js";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "class" | "children"> {
    src?: string;
    alt?: string;
    size?: AvatarSize;
    variant?: AvatarVariant;
    color?: CoimColor;
    initials?: string;
    class?: string;
    imgClass?: string;
    children?: Snippet;
  }

  let {
    src,
    alt = "",
    size,
    variant,
    color,
    initials,
    class: className = "",
    imgClass = "",
    children,
    ...rest
  }: Props = $props();

  const group = tryGetAvatarGroupContext();
  const groupIndex = group ? group.registerIndex() : -1;

  onMount(() => {
    if (!group || groupIndex < 0) return;
    return group.registerMounted(groupIndex);
  });

  const resolvedSize = $derived<AvatarSize>(size ?? group?.size ?? "medium");
  const resolvedVariant = $derived<AvatarVariant>(variant ?? group?.variant ?? "circular");
  const isVisible = $derived(group ? group.isIndexVisible(groupIndex) : true);

  let imgFailed = $state(false);

  $effect(() => {
    void src;
    imgFailed = false;
  });

  const showImage = $derived(Boolean(src) && !imgFailed);

  const fallbackText = $derived.by(() => {
    if (initials) return initials;
    const trimmed = alt.trim();
    if (!trimmed) return "";
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  });

  const sizeClassMap: Record<AvatarSize, string> = {
    nano: "coim-avatar-nano h-4 w-4 text-xs",
    tiny: "coim-avatar-tiny h-7 w-7 text-xs",
    small: "coim-avatar-small h-8 w-8 text-xs",
    medium: "coim-avatar-medium h-9 w-9 text-base",
    large: "coim-avatar-large h-10 w-10 text-base",
  };

  const variantRadiusMap: Record<AvatarVariant, Record<AvatarSize, string>> = {
    circular: {
      nano: "rounded-4xs",
      tiny: "rounded-xs",
      small: "rounded-sm",
      medium: "rounded-md",
      large: "rounded-lg",
    },
    rounded: {
      nano: "rounded-sm",
      tiny: "rounded-sm",
      small: "rounded-sm",
      medium: "rounded-sm",
      large: "rounded-sm",
    },
    square: {
      nano: "rounded-none",
      tiny: "rounded-none",
      small: "rounded-none",
      medium: "rounded-none",
      large: "rounded-none",
    },
  };

  const iconSizeMap: Record<AvatarSize, number | "tiny" | "small" | "medium" | "large"> = {
    nano: 10,
    tiny: "tiny",
    small: "small",
    medium: "medium",
    large: "large",
  };
</script>

{#if isVisible}
  <div
    role={!showImage && alt ? "img" : undefined}
    aria-label={!showImage && alt ? alt : undefined}
    {...rest}
    class={cn(
      "coim-avatar font-body relative inline-flex shrink-0 items-center justify-center overflow-hidden font-semibold select-none",
      `coim-avatar-${resolvedVariant}`,
      sizeClassMap[resolvedSize],
      variantRadiusMap[resolvedVariant][resolvedSize],
      color && `coim-avatar-color-${color}`,
      className,
    )}
  >
    {#if showImage}
      <img
        {src}
        {alt}
        class={cn("block h-full w-full object-cover", imgClass)}
        onload={() => {
          imgFailed = false;
        }}
        onerror={() => {
          imgFailed = true;
        }}
      />
    {:else if children}
      {@render children()}
    {:else if fallbackText}
      <span>{fallbackText}</span>
    {:else}
      <CiUser size={iconSizeMap[resolvedSize]} aria-hidden="true" />
    {/if}
  </div>
{/if}
