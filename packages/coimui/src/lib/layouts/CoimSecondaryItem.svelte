<script lang="ts">
  import { untrack } from "svelte";
  import CoimIcon from "../icons/CoimIcon.svelte";
  import CiChevronRightSmall from "../icons/ui/CiChevronRightSmall.svelte";
  import { cn, isPathMatch } from "../utilities/utils.js";
  import { resolveLabel } from "./nav-utils.js";
  import CoimSecondaryItem from "./CoimSecondaryItem.svelte";
  import type { CoimNavItem, NavigateFn, OpenedAccordion, TranslateFn } from "./types.js";

  interface Props {
    item: CoimNavItem;
    currentPath: string;
    indent?: number;
    openedAccordions: OpenedAccordion[];
    onToggleAccordion: (accordions: OpenedAccordion[]) => void;
    onSelect?: (item: CoimNavItem) => void;
    onNavigate?: NavigateFn;
    translate?: TranslateFn;
    class?: string;
  }

  let {
    item,
    currentPath,
    indent = 0,
    openedAccordions,
    onToggleAccordion,
    onSelect,
    onNavigate,
    translate = (k) => k,
    class: className = "",
  }: Props = $props();

  function hasActiveDescendant(menuItem: CoimNavItem, path: string): boolean {
    if (menuItem.href && isPathMatch(path, menuItem.href)) return true;
    if (menuItem.children) {
      return menuItem.children.some((child) => hasActiveDescendant(child, path));
    }
    return false;
  }

  const isActive = $derived(hasActiveDescendant(item, currentPath));
  const visibleChildren = $derived((item.children ?? []).filter((x) => !x.hideInMenu));
  const isLeafLink = $derived(visibleChildren.length === 0 && Boolean(item.href));
  const isExpanded = $derived(
    Boolean(openedAccordions.find((a) => a.id === item.id && a.indent === indent)),
  );

  $effect(() => {
    if (isActive && visibleChildren.length > 0 && !isExpanded) {
      untrack(() => {
        onToggleAccordion([
          ...openedAccordions.filter((a) => a.indent !== indent),
          { indent, id: item.id },
        ]);
      });
    }
  });

  function handleAccordionClick() {
    if (isExpanded) {
      onToggleAccordion(openedAccordions.filter((a) => !(a.indent === indent && a.id === item.id)));
    } else {
      onToggleAccordion([
        ...openedAccordions.filter((a) => a.indent !== indent),
        { indent, id: item.id },
      ]);
    }
  }

  function handleInternalLink(event: MouseEvent, href: string) {
    onSelect?.(item);
    if (!onNavigate) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    onNavigate(href);
  }

  const buttonSizeClass = $derived(
    indent >= 1
      ? "min-w-9 rounded-md py-2 text-base leading-5"
      : "min-w-10 rounded-lg py-2 text-base leading-6",
  );
</script>

{#if item.isExternalLink}
  <a
    href={item.href}
    target="_blank"
    rel="noreferrer"
    aria-label={resolveLabel(translate, item.label)}
    class={cn(
      "font-body text-text-primary group hover:bg-grey-25 flex w-full items-center justify-start gap-2 px-4 text-start font-medium no-underline transition-all",
      indent === 1 ? "min-w-10 rounded-lg py-2 text-base leading-6" : buttonSizeClass,
      isActive && "active text-primary-fg! bg-grey-25!",
      className,
    )}
  >
    {#if item.icon}
      <CoimIcon
        variant={isActive ? "contained" : "outlined"}
        icon={item.icon}
        size={indent === 1 ? "large" : "medium"}
        class={cn("shrink-0 transition-transform group-hover:scale-[0.85]", isActive && "scale-[0.85]")}
      />
    {/if}
    <span class="flex-1 truncate">{resolveLabel(translate, item.label)}</span>
  </a>
{:else if item.content}
  <button
    type="button"
    aria-label={resolveLabel(translate, item.label)}
    onclick={() => {
      onSelect?.(item);
      onToggleAccordion([
        ...openedAccordions.filter((a) => a.indent !== indent),
        { indent, id: item.id },
      ]);
    }}
    class={cn(
      "font-body text-text-primary group hover:bg-grey-25 flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent px-4 py-2 text-start text-base leading-6 font-medium transition-all",
      isActive && "active text-primary-fg! bg-grey-25!",
      className,
    )}
  >
    {#if item.icon}
      <CoimIcon
        variant={isActive ? "contained" : "outlined"}
        icon={item.icon}
        size="large"
        class={cn("shrink-0 transition-transform group-hover:scale-[0.85]", isActive && "scale-[0.85]")}
      />
    {/if}
    <span class="flex-1 truncate">{resolveLabel(translate, item.label)}</span>
  </button>
{:else if isLeafLink && item.href}
  <a
    href={item.href}
    aria-label={resolveLabel(translate, item.label)}
    aria-current={isActive ? "page" : undefined}
    onclick={(e) => handleInternalLink(e, item.href!)}
    class={cn(
      "font-body text-text-primary group hover:bg-grey-25 flex w-full items-center justify-start gap-2 rounded-lg px-4 py-2 text-start text-base leading-6 font-medium no-underline transition-all",
      isActive && "active text-primary-fg! bg-grey-25!",
      className,
    )}
  >
    {#if item.icon}
      <CoimIcon
        variant={isActive ? "contained" : "outlined"}
        icon={item.icon}
        size="large"
        class={cn("shrink-0 transition-transform group-hover:scale-[0.85]", isActive && "scale-[0.85]")}
      />
    {/if}
    <span class="flex-1 truncate">{resolveLabel(translate, item.label)}</span>
  </a>
{:else}
  <div class="m-0 bg-transparent p-0">
    <button
      type="button"
      aria-expanded={isExpanded}
      onclick={handleAccordionClick}
      class={cn(
        "font-body text-text-primary group hover:bg-grey-25 flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent px-4 py-2 text-start text-base leading-6 font-medium transition-all",
        isActive && "text-primary-fg! bg-grey-25!",
        (isExpanded || isActive) && "active",
        className,
      )}
    >
      {#if item.icon}
        <CoimIcon
          variant={isActive ? "contained" : "outlined"}
          icon={item.icon}
          size="large"
          class={cn(
            "shrink-0 transition-transform group-hover:scale-[0.85]",
            (isActive || isExpanded) && "scale-[0.85]",
          )}
        />
      {/if}
      <span class="flex-1 truncate">{resolveLabel(translate, item.label)}</span>
      <CiChevronRightSmall
        size="medium"
        class={cn(
          "accordion-rotate ms-auto shrink-0 transition-transform rtl:rotate-180",
          isExpanded && "rotate-90 rtl:rotate-90",
        )}
      />
    </button>

    {#if isExpanded && visibleChildren.length > 0}
      <div class="ms-7 flex flex-col gap-1 pt-2">
        {#each visibleChildren as child (`left-menu-secondary-${item.id}-${child.id}`)}
          <CoimSecondaryItem
            item={child}
            {currentPath}
            indent={indent + 1}
            {openedAccordions}
            {onToggleAccordion}
            {onSelect}
            {onNavigate}
            {translate}
            class={className}
          />
        {/each}
      </div>
    {/if}
  </div>
{/if}
