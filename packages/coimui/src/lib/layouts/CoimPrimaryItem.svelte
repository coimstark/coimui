<script lang="ts">
  import { Tooltip } from "bits-ui";
  import CoimIcon from "../icons/CoimIcon.svelte";
  import { MenuType } from "../theme/types.js";
  import { cn, isPathMatch } from "../utilities/utils.js";
  import { navItemMatchesPath, resolveLabel } from "./nav-utils.js";
  import type { CoimNavItem, TranslateFn } from "./types.js";

  interface Props {
    item: CoimNavItem;
    currentPath: string;
    onSelect: (item: CoimNavItem) => void;
    isActive: boolean;
    menuType: MenuType;
    translate?: TranslateFn;
    class?: string;
  }

  let {
    item,
    currentPath,
    onSelect,
    isActive,
    menuType,
    translate = (k) => k,
    class: className = "",
  }: Props = $props();

  let tooltipOpen = $state(false);

  const selected = $derived.by(() => {
    if (!item) return false;
    if (item.children && item.children.some((child) => navItemMatchesPath(child, currentPath))) {
      return true;
    }
    if (item.href && isPathMatch(currentPath, item.href)) return true;
    return false;
  });

  const activeColorClass = $derived(
    item.color ? `text-${item.color.replace("text-", "")}!` : "text-primary!",
  );

  function handleSelect() {
    onSelect(item);
    tooltipOpen = false;
  }
</script>

{#if menuType === MenuType.Comfort}
  {#if item.isExternalLink}
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      class={cn(
        "group hover:bg-grey-25 flex h-18 w-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg no-underline transition-all",
        selected && "bg-grey-25",
        className,
      )}
    >
      {#if item.icon}
        <CoimIcon
          variant={selected ? "contained" : "outlined"}
          icon={item.icon}
          size="large"
          strokeWidth={0.75}
          class={cn(
            "transition-transform group-hover:scale-[0.85]",
            (selected || isActive) && "text-primary scale-[0.85]",
          )}
        />
      {/if}
      <span
        class={cn(
          "font-body text-text-primary line-clamp-2 w-full text-center text-sm font-semibold transition-all",
          (selected || isActive) && "text-primary mt-0 mb-0",
        )}
      >
        {resolveLabel(translate, item.label)}
      </span>
    </a>
  {:else}
    <button
      type="button"
      onclick={handleSelect}
      aria-current={selected ? "page" : undefined}
      class={cn(
        "group hover:bg-grey-25 flex h-18 w-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-0 bg-transparent p-0 text-inherit no-underline transition-all",
        selected && "bg-grey-25",
        className,
      )}
    >
      {#if item.icon}
        <CoimIcon
          variant={selected ? "contained" : "outlined"}
          icon={item.icon}
          size="large"
          strokeWidth={0.75}
          class={cn(
            "transition-transform group-hover:scale-[0.85]",
            (selected || isActive) && "text-primary scale-[0.85]",
          )}
        />
      {/if}
      <span
        class={cn(
          "font-body text-text-primary line-clamp-2 w-full text-center text-sm font-semibold transition-all",
          (selected || isActive) && "text-primary mt-0 mb-0",
        )}
      >
        {resolveLabel(translate, item.label)}
      </span>
    </button>
  {/if}
{:else if menuType === MenuType.Minimal}
  <div class={cn("group flex w-11 flex-col items-center gap-2", className)}>
    <Tooltip.Root bind:open={tooltipOpen}>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          {#if item.isExternalLink}
            <a
              {...props}
              id={item.id}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={resolveLabel(translate, item.label)}
              class={cn(
                "icon-only hover:bg-grey-25 text-text-primary inline-flex h-11 w-11 items-center justify-center rounded-lg no-underline transition-all",
                selected && `bg-grey-25 active ${activeColorClass}`,
                isActive && "active",
              )}
            >
              {#if item.icon}
                <CoimIcon
                  variant={selected ? "contained" : "outlined"}
                  icon={item.icon}
                  size={24}
                  class={cn(
                    "transition-transform group-hover:scale-[0.85]",
                    (selected || isActive) && "scale-[0.85]",
                  )}
                />
              {/if}
            </a>
          {:else}
            <button
              {...props}
              id={item.id}
              type="button"
              onclick={handleSelect}
              aria-label={resolveLabel(translate, item.label)}
              aria-current={selected ? "page" : undefined}
              class={cn(
                "icon-only hover:bg-grey-25 text-text-primary inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent transition-all",
                selected && `bg-grey-25 active ${activeColorClass}`,
                isActive && "active",
              )}
            >
              {#if item.icon}
                <CoimIcon
                  variant={selected ? "contained" : "outlined"}
                  icon={item.icon}
                  size={24}
                  class={cn(
                    "transition-transform group-hover:scale-[0.85]",
                    (selected || isActive) && "scale-[0.85]",
                  )}
                />
              {/if}
            </button>
          {/if}
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="right"
          sideOffset={8}
          class={cn(
            "border-grey-200 bg-background-paper font-body text-text-primary shadow-darker-sm z-100 rounded-sm border border-solid px-4.75 py-[calc(0.5rem-1px)] text-base leading-4 font-semibold",
            selected && "text-primary",
          )}
        >
          <Tooltip.Arrow class="text-background-paper fill-current" />
          {resolveLabel(translate, item.label)}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </div>
{/if}
