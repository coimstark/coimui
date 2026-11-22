<script lang="ts">
  import { Popover, Tooltip } from "bits-ui";
  import CoimIcon from "../icons/CoimIcon.svelte";
  import CiCells from "../icons/ui/CiCells.svelte";
  import CiPlus from "../icons/ui/CiPlus.svelte";
  import { getThemeContext } from "../theme/theme-state.svelte.js";
  import { cn } from "../utilities/utils.js";
  import type { CoimShortcutItem, NavigateFn } from "./types.js";

  interface Props {
    shortcuts?: CoimShortcutItem[];
    onNavigate?: NavigateFn;
    class?: string;
  }

  const defaultShortcuts: CoimShortcutItem[] = [
    {
      id: "sc-1",
      label: "Add Product",
      description: "/pages/ecommerce/products",
      href: "/pages/ecommerce/products",
      icon: "CiBag",
      bgClass: "bg-primary-light/10",
      colorClass: "text-primary",
    },
    {
      id: "sc-2",
      label: "Add Category",
      description: "/pages/ecommerce/products-filters",
      href: "/pages/ecommerce/products-filters",
      icon: "CiCells",
      bgClass: "bg-secondary-light/10",
      colorClass: "text-secondary",
    },
    {
      id: "sc-3",
      label: "Discounts",
      description: "/pages/ecommerce/orders",
      href: "/pages/ecommerce/orders",
      icon: "CiPercent",
      bgClass: "bg-accent-1-light/10",
      colorClass: "text-accent-1",
    },
    {
      id: "sc-4",
      label: "Teams",
      description: "/pages/user/friends",
      href: "/pages/user/friends",
      icon: "CiUsers",
      bgClass: "bg-accent-2-light/10",
      colorClass: "text-accent-2",
    },
    {
      id: "sc-5",
      label: "Comments",
      description: "/pages/user/social",
      href: "/pages/user/social",
      icon: "CiMessages",
      bgClass: "bg-accent-3-light/10",
      colorClass: "text-accent-3",
    },
    {
      id: "sc-6",
      label: "Ads",
      description: "/dashboards/analytics",
      href: "/dashboards/analytics",
      icon: "CiTelescope",
      bgClass: "bg-accent-4-light/10",
      colorClass: "text-accent-4",
    },
  ];

  let { shortcuts = defaultShortcuts, onNavigate, class: className = "" }: Props = $props();
  const theme = getThemeContext();

  let open = $state(false);

  function handleShortcutClick(item: CoimShortcutItem) {
    open = false;
    if (item.href) {
      onNavigate?.(item.href);
    }
  }
</script>

<Popover.Root bind:open>
  <Tooltip.Root disabled={open}>
    <Tooltip.Trigger>
      {#snippet child({ props: tipProps })}
        <Popover.Trigger>
          {#snippet child({ props: popProps })}
            <button
              {...tipProps}
              {...popProps}
              type="button"
              aria-label="Shortcuts"
              class={cn(
                "icon-only hover-icon-shrink hover:bg-grey-25 text-text-primary inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent transition-all",
                open && "active bg-grey-25 text-primary!",
                theme.isTopNavContained && "hover:bg-grey-50",
                open && theme.isTopNavContained && "active bg-grey-50",
                className,
              )}
            >
              <CiCells variant={open ? "contained" : "outlined"} size={24} class="transition-transform" />
            </button>
          {/snippet}
        </Popover.Trigger>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content
        side="bottom"
        sideOffset={6}
        class="border-grey-200 bg-background-paper font-body text-text-primary shadow-darker-sm z-100 rounded-sm border border-solid px-3 py-1.5 text-sm font-semibold"
      >
        <Tooltip.Arrow class="text-background-paper fill-current" />
        Shortcuts
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>

  <Popover.Portal>
    <Popover.Content
      align="end"
      sideOffset={12}
      class="bg-background-paper shadow-darker-sm z-100 w-xs rounded-3xl p-3 outline-none"
    >
      <div class="flex flex-row items-start justify-between pe-4">
        <h6 class="card-title font-heading text-text-primary mb-2 min-h-8 px-4 pt-4 text-lg font-bold">
          Shortcuts
        </h6>
        <button
          type="button"
          aria-label="Add shortcut"
          class="text-text-secondary hover:bg-grey-25 mt-3 inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-xs border-0 bg-transparent"
        >
          <CiPlus size="small" />
        </button>
      </div>

      <div class="mb-4">
        <ul class="m-0 flex max-h-72 list-none flex-col gap-0.5 overflow-auto p-0">
          {#each shortcuts as sc (sc.id)}
            <li class="py-0 ps-0 pe-2">
              <button
                type="button"
                onclick={() => handleShortcutClick(sc)}
                class="group hover:bg-grey-500/10 flex w-full cursor-pointer items-start gap-3 rounded-sm border-0 bg-transparent px-4 py-2 text-start transition-colors"
              >
                <span
                  class={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                    sc.bgClass ?? "bg-primary-light/10",
                  )}
                >
                  <CoimIcon icon={sc.icon} size="medium" class={sc.colorClass ?? "text-primary"} />
                </span>
                <span class="flex min-w-0 flex-1 flex-col">
                  <span class="font-body text-text-primary text-base leading-4 font-semibold">
                    {sc.label}
                  </span>
                  <span class="font-body text-text-secondary mt-1 truncate text-sm">
                    {sc.description}
                  </span>
                </span>
              </button>
            </li>
          {/each}
        </ul>
      </div>

      <div class="px-4 pt-2 pb-4">
        <button
          type="button"
          onclick={() => (open = false)}
          class="border-grey-200 text-text-primary hover:bg-grey-200/10 font-body w-full cursor-pointer rounded-xs border border-solid bg-transparent px-3.5 py-1.5 text-sm leading-4 font-medium transition-colors"
        >
          Add Shortcut
        </button>
      </div>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
