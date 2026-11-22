<script lang="ts">
  import { onMount } from "svelte";
  import { Tabs, Tooltip } from "bits-ui";
  import CiBriefcase from "../icons/ui/CiBriefcase.svelte";
  import CiCheckSquare from "../icons/ui/CiCheckSquare.svelte";
  import CiController from "../icons/ui/CiController.svelte";
  import CiCross from "../icons/ui/CiCross.svelte";
  import CiCrossSquare from "../icons/ui/CiCrossSquare.svelte";
  import CiDirectory from "../icons/ui/CiDirectory.svelte";
  import CiDocumentCode from "../icons/ui/CiDocumentCode.svelte";
  import CiDocumentImage from "../icons/ui/CiDocumentImage.svelte";
  import CiSearch from "../icons/ui/CiSearch.svelte";
  import CiSlashHexagon from "../icons/ui/CiSlashHexagon.svelte";
  import CiStructure from "../icons/ui/CiStructure.svelte";
  import CiUsers from "../icons/ui/CiUsers.svelte";
  import CoimIcon from "../icons/CoimIcon.svelte";
  import { getThemeContext } from "../theme/theme-state.svelte.js";
  import { cn } from "../utilities/utils.js";
  import type { CoimSearchItem, NavigateFn } from "./types.js";

  interface Props {
    items?: CoimSearchItem[];
    onNavigate?: NavigateFn;
    class?: string;
  }

  const defaultItems: CoimSearchItem[] = [
    {
      id: "s-1",
      title: "Stretchy",
      subtitle: "/pages/ecommerce/product-detail",
      href: "/pages/ecommerce/product-detail",
      category: "products",
      avatarSrc: "/images/products/product-1.jpg",
      status: "active",
    },
    {
      id: "s-2",
      title: "Pony Soprano",
      subtitle: "/pages/ecommerce/product-detail",
      href: "/pages/ecommerce/product-detail",
      category: "products",
      avatarSrc: "/images/products/product-2.jpg",
      status: "active",
    },
    {
      id: "s-3",
      title: "Buck Rogers",
      subtitle: "/pages/ecommerce/products",
      href: "/pages/ecommerce/products",
      category: "products",
      avatarSrc: "/images/products/product-3.jpg",
      status: "inactive",
    },
    {
      id: "s-4",
      title: "Electronic Devices",
      subtitle: "314 products",
      href: "/pages/ecommerce/products",
      category: "categories",
      icon: "CiController",
      iconBgClass: "bg-primary-light/10",
      iconColorClass: "text-primary",
    },
    {
      id: "s-5",
      title: "Digital Products",
      subtitle: "14 products",
      href: "/pages/ecommerce/products",
      category: "categories",
      icon: "CiDocumentCode",
      iconBgClass: "bg-secondary-light/10",
      iconColorClass: "text-secondary",
    },
    {
      id: "s-6",
      title: "Bags",
      subtitle: "24 products",
      href: "/pages/ecommerce/products",
      category: "categories",
      icon: "CiBriefcase",
      iconBgClass: "bg-accent-1/10",
      iconColorClass: "text-accent-1",
    },
    {
      id: "s-7",
      title: "Zoila Vittorino",
      subtitle: "zoila.vittorino@coimui.dev",
      href: "/pages/user/overview",
      category: "users",
      avatarSrc: "/images/avatars/avatar-1.jpg",
    },
    {
      id: "s-8",
      title: "Travis Howard",
      subtitle: "travis.howard@coimui.dev",
      href: "/pages/user/overview",
      category: "users",
      avatarSrc: "/images/avatars/avatar-2.jpg",
    },
    {
      id: "s-9",
      title: "Olivia Bennett",
      subtitle: "olivia.bennett@coimui.dev",
      href: "/pages/user/overview",
      category: "users",
      avatarSrc: "/images/avatars/avatar-3.jpg",
    },
  ];

  let { items = defaultItems, onNavigate, class: className = "" }: Props = $props();
  const theme = getThemeContext();

  let open = $state(false);
  let query = $state("");
  let activeTab = $state("all");
  let isMac = $state(false);
  let dialogEl = $state<HTMLDialogElement | null>(null);
  let inputEl = $state<HTMLInputElement | null>(null);
  let pressedOutside = false;

  onMount(() => {
    isMac = navigator.userAgent.includes("Mac");

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openDialog();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  $effect(() => {
    if (!dialogEl) return;
    if (open && !dialogEl.open) {
      dialogEl.showModal();
      queueMicrotask(() => inputEl?.focus());
    } else if (!open && dialogEl.open) {
      dialogEl.close();
    }
  });

  function openDialog() {
    open = true;
  }

  function closeDialog() {
    open = false;
  }

  function handleDialogClose() {
    if (dialogEl) dialogEl.returnValue = "";
    open = false;
  }

  function isPointerOutside(e: PointerEvent, el: HTMLDialogElement): boolean {
    const r = el.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  }

  function handlePointerDown(e: PointerEvent) {
    if (!dialogEl || "closedBy" in HTMLDialogElement.prototype) return;
    pressedOutside = isPointerOutside(e, dialogEl);
  }

  function handlePointerUp(e: PointerEvent) {
    if (!dialogEl || "closedBy" in HTMLDialogElement.prototype) return;
    if (pressedOutside && isPointerOutside(e, dialogEl)) {
      closeDialog();
    }
    pressedOutside = false;
  }

  function handleItemSelect(item: CoimSearchItem) {
    closeDialog();
    if (item.href) {
      onNavigate?.(item.href);
    }
  }

  const filteredItems = $derived.by(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (activeTab === "result") return false;
      if (activeTab !== "all" && item.category !== activeTab) return false;
      if (!q) return true;
      return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q);
    });
  });

  const productResults = $derived(filteredItems.filter((i) => i.category === "products"));
  const categoryResults = $derived(filteredItems.filter((i) => i.category === "categories"));
  const userResults = $derived(filteredItems.filter((i) => i.category === "users"));
</script>

<Tooltip.Root>
  <Tooltip.Trigger>
    {#snippet child({ props })}
      <button
        {...props}
        type="button"
        aria-label="Open search"
        onclick={openDialog}
        class={cn(
          "icon-only hover-icon-shrink hover:bg-grey-25 text-text-primary inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent transition-all",
          open && "active bg-grey-25 text-primary!",
          theme.isTopNavContained && "hover:bg-grey-50",
          open && theme.isTopNavContained && "active bg-grey-50",
          className,
        )}
      >
        <CiSearch variant={open ? "contained" : "outlined"} size={24} class="transition-transform" />
      </button>
    {/snippet}
  </Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content
      side="bottom"
      sideOffset={6}
      class="border-grey-200 bg-background-paper font-body text-text-primary shadow-darker-sm z-100 rounded-sm border border-solid px-3 py-1.5 text-sm font-semibold"
    >
      <Tooltip.Arrow class="text-background-paper fill-current" />
      Search ({isMac ? "cmd" : "ctrl"}+k)
    </Tooltip.Content>
  </Tooltip.Portal>
</Tooltip.Root>

<dialog
  bind:this={dialogEl}
  closedby="any"
  aria-label="Global search"
  onclose={handleDialogClose}
  onpointerdown={handlePointerDown}
  onpointerup={handlePointerUp}
  class="bg-background-paper text-text-primary shadow-darker-md mx-auto mt-16 mb-auto w-[min(92vw,48rem)] flex-col overflow-hidden rounded-3xl border-0 p-0 backdrop:bg-black/40 backdrop:backdrop-blur-[2px] open:flex"
>
  <div class="border-grey-100 flex items-center gap-3 border-b px-7 py-5">
    <CiSearch size="medium" class="text-text-secondary shrink-0" />
    <input
      bind:this={inputEl}
      bind:value={query}
      type="search"
      placeholder="Search"
      aria-label="Search query"
      class="font-body text-text-primary placeholder:opacity-disabled w-full border-0 bg-transparent text-base leading-5 outline-none"
    />
    <button
      type="button"
      aria-label="Close search"
      onclick={closeDialog}
      class="text-text-secondary hover:bg-grey-25 hover:text-text-primary inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent"
    >
      <CiCross size="small" />
    </button>
  </div>

  <div class="flex max-h-[65vh] flex-col overflow-y-auto px-7 pt-5 pb-2">
    <Tabs.Root bind:value={activeTab}>
      <Tabs.List class="mb-4 flex flex-wrap gap-1">
        <Tabs.Trigger
          value="all"
          class={cn(
            "font-body text-text-secondary inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent px-3 py-2 text-sm font-medium transition-colors",
            activeTab === "all" && "bg-primary/10 text-primary",
          )}
        >
          <CiStructure size="medium" />
          <span class="hidden md:inline">All</span>
        </Tabs.Trigger>
        <Tabs.Trigger
          value="products"
          class={cn(
            "font-body text-text-secondary inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent px-3 py-2 text-sm font-medium transition-colors",
            activeTab === "products" && "bg-primary/10 text-primary",
          )}
        >
          <CiDocumentImage size="medium" />
          <span class="hidden md:inline">Products</span>
        </Tabs.Trigger>
        <Tabs.Trigger
          value="categories"
          class={cn(
            "font-body text-text-secondary inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent px-3 py-2 text-sm font-medium transition-colors",
            activeTab === "categories" && "bg-primary/10 text-primary",
          )}
        >
          <CiDirectory size="medium" />
          <span class="hidden md:inline">Categories</span>
        </Tabs.Trigger>
        <Tabs.Trigger
          value="users"
          class={cn(
            "font-body text-text-secondary inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent px-3 py-2 text-sm font-medium transition-colors",
            activeTab === "users" && "bg-primary/10 text-primary",
          )}
        >
          <CiUsers size="medium" />
          <span class="hidden md:inline">Users</span>
        </Tabs.Trigger>
        <Tabs.Trigger
          value="result"
          class={cn(
            "font-body text-text-secondary inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent px-3 py-2 text-sm font-medium transition-colors",
            activeTab === "result" && "bg-primary/10 text-primary",
          )}
        >
          <CiSlashHexagon size="medium" />
          <span class="hidden md:inline">No Result</span>
        </Tabs.Trigger>
      </Tabs.List>

      <div class="flex flex-col gap-4 pb-2">
        {#if filteredItems.length === 0}
          <p class="font-body text-text-secondary py-8 text-center text-base">
            No matching results found.
          </p>
        {:else}
          {#if productResults.length > 0}
            <div>
              <p class="font-body text-text-disabled mb-2 text-sm font-medium">Recent</p>
              <ul class="m-0 flex list-none flex-col gap-1 p-0">
                {#each productResults as item (item.id)}
                  <li>
                    <button
                      type="button"
                      onclick={() => handleItemSelect(item)}
                      class="group hover:bg-grey-500/10 flex w-full cursor-pointer items-center gap-3 rounded-sm border-0 bg-transparent px-3 py-2 text-start transition-colors"
                    >
                      {#if item.avatarSrc}
                        <img
                          src={item.avatarSrc}
                          alt={item.title}
                          class="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                      {/if}
                      <span class="flex min-w-0 flex-1 flex-col">
                        <span class="font-body text-text-primary text-base leading-4 font-normal">
                          {item.title}
                        </span>
                        <span class="font-body text-text-secondary mt-1 truncate text-sm">
                          {item.subtitle}
                        </span>
                      </span>
                      {#if item.status === "active"}
                        <span class="bg-success-light/10 text-success inline-flex items-center gap-1 rounded-xs px-2.5 py-1 text-sm font-medium">
                          <CiCheckSquare size="tiny" /> Active
                        </span>
                      {:else if item.status === "inactive"}
                        <span class="bg-grey-25 text-text-primary inline-flex items-center gap-1 rounded-xs px-2.5 py-1 text-sm font-medium">
                          <CiCrossSquare size="tiny" /> Inactive
                        </span>
                      {/if}
                    </button>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}

          {#if categoryResults.length > 0}
            <div>
              <p class="font-body text-text-disabled mb-2 text-sm font-medium">Categories</p>
              <ul class="m-0 flex list-none flex-col gap-1 p-0">
                {#each categoryResults as item (item.id)}
                  <li>
                    <button
                      type="button"
                      onclick={() => handleItemSelect(item)}
                      class="group hover:bg-grey-500/10 flex w-full cursor-pointer items-center gap-3 rounded-sm border-0 bg-transparent px-3 py-2 text-start transition-colors"
                    >
                      <span
                        class={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                          item.iconBgClass ?? "bg-primary-light/10",
                        )}
                      >
                        {#if item.icon}
                          <CoimIcon
                            icon={item.icon}
                            size="medium"
                            class={item.iconColorClass ?? "text-primary"}
                          />
                        {/if}
                      </span>
                      <span class="flex min-w-0 flex-1 flex-col">
                        <span class="font-body text-text-primary text-base leading-4 font-normal">
                          {item.title}
                        </span>
                        <span class="font-body text-text-secondary mt-1 truncate text-sm">
                          {item.subtitle}
                        </span>
                      </span>
                    </button>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}

          {#if userResults.length > 0}
            <div>
              <p class="font-body text-text-disabled mb-2 text-sm font-medium">Users</p>
              <ul class="m-0 flex list-none flex-col gap-1 p-0">
                {#each userResults as item (item.id)}
                  <li>
                    <button
                      type="button"
                      onclick={() => handleItemSelect(item)}
                      class="group hover:bg-grey-500/10 flex w-full cursor-pointer items-center gap-3 rounded-sm border-0 bg-transparent px-3 py-2 text-start transition-colors"
                    >
                      {#if item.avatarSrc}
                        <img
                          src={item.avatarSrc}
                          alt={item.title}
                          class="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                      {/if}
                      <span class="flex min-w-0 flex-1 flex-col">
                        <span class="font-body text-text-primary text-base leading-4 font-normal">
                          {item.title}
                        </span>
                        <span class="font-body text-text-secondary mt-1 truncate text-sm">
                          {item.subtitle}
                        </span>
                      </span>
                    </button>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        {/if}
      </div>
    </Tabs.Root>
  </div>

  <div class="flex justify-center px-7 pt-2 pb-5">
    <button
      type="button"
      onclick={() => {
        closeDialog();
        onNavigate?.("/pages/miscellaneous/search");
      }}
      class="font-body text-primary hover:bg-primary-light/10 cursor-pointer rounded-xs border-0 bg-transparent px-3.5 py-1.5 text-sm font-medium transition-colors"
    >
      Advanced Search
    </button>
  </div>
</dialog>
