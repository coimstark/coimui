<script lang="ts">
  import type { Snippet } from "svelte";
  import { MenuShowState } from "../theme/types.js";
  import { cn } from "../utilities/utils.js";
  import { getLayoutContext } from "./layout-state.svelte.js";
  import { findPrimaryNavItem } from "./nav-utils.js";
  import CoimContentWrapper from "./CoimContentWrapper.svelte";
  import CoimFooter from "./CoimFooter.svelte";
  import type { CoimFooterLink, CoimNavItem, NavigateFn, TranslateFn } from "./types.js";

  interface Props {
    items: CoimNavItem[];
    bottomItems?: CoimNavItem[];
    currentPath: string;
    footerLinks?: CoimFooterLink[];
    showFooter?: boolean;
    fullHeight?: boolean;
    disableContentWrapper?: boolean;
    onNavigate?: NavigateFn;
    translate?: TranslateFn;
    headerSlot?: Snippet;
    children?: Snippet;
  }

  let {
    items,
    bottomItems = [],
    currentPath,
    footerLinks,
    showFooter = true,
    fullHeight = false,
    disableContentWrapper = false,
    onNavigate,
    translate,
    headerSlot,
    children,
  }: Props = $props();

  const layout = getLayoutContext();

  const activeItem = $derived(findPrimaryNavItem(items, bottomItems, currentPath));

  const mainPadding = $derived.by(() => {
    if (!layout.mounted) return 0;
    let pad = 0;
    if (layout.leftPrimaryCurrent === MenuShowState.Show) {
      pad += layout.leftMenuWidth.primary;
    }
    const visibleChildren = (activeItem?.children ?? []).filter((x) => !x.hideInMenu);
    if (
      layout.leftSecondaryCurrent === MenuShowState.Show &&
      visibleChildren.length > 0 &&
      layout.leftMenuWidth.secondary > 0
    ) {
      pad += layout.leftMenuWidth.secondary;
    }
    return pad;
  });
</script>

<main
  id="coim-main-content"
  tabindex="-1"
  class="relative flex h-full min-h-0 w-full flex-col transition-all duration-(--layout-duration)"
  style:width="100%"
  style:padding-inline-start={`${mainPadding}px`}
>
  {@render headerSlot?.()}
  <div class={cn(fullHeight ? "flex h-[calc(100dvh-4rem)] min-h-0 flex-1 flex-col overflow-hidden" : "min-h-[calc(100vh-7rem)]")}>
    {#if disableContentWrapper}
      {@render children?.()}
    {:else}
      <CoimContentWrapper>
        {@render children?.()}
      </CoimContentWrapper>
    {/if}
  </div>
  {#if showFooter}
    <CoimFooter links={footerLinks} {onNavigate} {translate} />
  {/if}
</main>
