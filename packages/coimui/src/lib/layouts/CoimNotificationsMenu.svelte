<script lang="ts">
  import { DropdownMenu, Popover, Tabs, Tooltip } from "bits-ui";
  import CoimIcon from "../icons/CoimIcon.svelte";
  import CiBell from "../icons/ui/CiBell.svelte";
  import CiBellInactive from "../icons/ui/CiBellInactive.svelte";
  import CiEllipsisHorizontal from "../icons/ui/CiEllipsisHorizontal.svelte";
  import CiScreen from "../icons/ui/CiScreen.svelte";
  import CiSettings from "../icons/ui/CiSettings.svelte";
  import CiStructure from "../icons/ui/CiStructure.svelte";
  import CiUsers from "../icons/ui/CiUsers.svelte";
  import { getThemeContext } from "../theme/theme-state.svelte.js";
  import { cn } from "../utilities/utils.js";
  import type { CoimNotificationAction, CoimNotificationItem, NavigateFn } from "./types.js";

  interface Props {
    notifications?: CoimNotificationItem[];
    settingsHref?: string;
    viewAllHref?: string;
    onAction?: (item: CoimNotificationItem, action: CoimNotificationAction) => void;
    onNavigate?: NavigateFn;
    class?: string;
  }

  const defaultNotifications: CoimNotificationItem[] = [
    {
      id: "100",
      labelBold: "Laura Ellis",
      labelRegular: "published a component release note.",
      type: "user",
      time: "2 minutes ago",
      href: "/components",
      avatarImage: "/images/avatars/avatar-1.jpg",
      temporaryUnread: true,
      markedUnread: false,
      chips: [{ label: "Release v1.0.0", image: "/images/products/product-1.jpg", id: "1001" }],
    },
    {
      id: "101",
      labelBold: "Zoila Vittorino",
      labelRegular: "updated analytics targets.",
      type: "user",
      time: "14 minutes ago",
      href: "/charts",
      avatarImage: "/images/avatars/avatar-2.jpg",
      temporaryUnread: true,
      markedUnread: false,
      chips: [
        { label: "Charts", id: "1011" },
        { label: "Telemetry", id: "1012" },
      ],
    },
    {
      id: "102",
      labelBold: "Travis Howard",
      labelRegular: "requested workspace reviewer access.",
      type: "user",
      time: "20 minutes ago",
      avatarImage: "/images/avatars/avatar-3.jpg",
      temporaryUnread: false,
      markedUnread: false,
      actions: [
        { type: "positive", id: "1021", label: "Approve" },
        { type: "negative", id: "1022", label: "Decline" },
      ],
    },
    {
      id: "103",
      labelBold: "Cindy Baker",
      labelRegular: "shared Q4 billing invoices.",
      type: "user",
      time: "2 hours ago",
      href: "/data-grid",
      avatarImage: "/images/avatars/avatar-4.jpg",
      temporaryUnread: false,
      markedUnread: false,
    },
    {
      id: "104",
      labelBold: "CoimUI v1.0.0",
      labelRegular: "All WCAG 2.1 AA and visual checks passed.",
      type: "system",
      time: "4 hours ago",
      href: "/docs",
      avatarColorBackground: "bg-accent-3-light/10",
      avatarColorMain: "text-accent-3",
      avatarIcon: "CiFire",
      temporaryUnread: false,
      markedUnread: false,
    },
    {
      id: "105",
      labelBold: "Tip:",
      labelRegular: "Explore modular form validation schemas.",
      type: "system",
      time: "4 hours ago",
      href: "/forms",
      avatarColorBackground: "bg-accent-1-light/10",
      avatarColorMain: "text-accent-1",
      avatarIcon: "CiBulbOn",
      temporaryUnread: false,
      markedUnread: false,
    },
  ];

  let {
    notifications = defaultNotifications,
    settingsHref = "/docs",
    viewAllHref,
    onAction,
    onNavigate,
    class: className = "",
  }: Props = $props();

  const theme = getThemeContext();

  let items = $state<CoimNotificationItem[]>([]);
  let resolvedActions = $state<Record<string, string>>({});
  $effect(() => {
    items = notifications.map((n) => ({ ...n }));
  });

  let open = $state(false);
  let seenTemporary = $state(false);
  let tabValue = $state("all");
  let notificationOn = $state(true);

  const unreadCount = $derived.by(() => {
    return items.reduce((acc, n) => {
      if (seenTemporary) {
        return acc + (n.markedUnread ? 1 : 0);
      }
      return acc + (n.temporaryUnread || n.markedUnread ? 1 : 0);
    }, 0);
  });

  function markAllTemporaryRead() {
    items = items.map((n) => (n.temporaryUnread ? { ...n, temporaryUnread: false } : n));
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      seenTemporary = true;
    } else {
      markAllTemporaryRead();
    }
    open = nextOpen;
  }

  function toggleReadState(id: string, unread: boolean) {
    items = items.map((n) => (n.id === id ? { ...n, markedUnread: unread, temporaryUnread: unread } : n));
  }

  function handleActionClick(item: CoimNotificationItem, action: CoimNotificationAction) {
    const label = action.type === "positive" ? "Approved" : "Declined";
    resolvedActions = { ...resolvedActions, [item.id]: label };
    toggleReadState(item.id, false);
    onAction?.(item, action);
  }

  function handleViewAll() {
    items = items.map((n) => ({ ...n, temporaryUnread: false, markedUnread: false }));
    tabValue = "all";
    if (viewAllHref) {
      open = false;
      onNavigate?.(viewAllHref);
    }
  }

  function handleItemNavigate(href?: string) {
    markAllTemporaryRead();
    open = false;
    if (href) {
      onNavigate?.(href);
    }
  }

  const displayedItems = $derived.by(() => {
    if (tabValue === "system") return items.filter((n) => n.type === "system");
    if (tabValue === "user") return items.filter((n) => n.type === "user");
    return items;
  });
</script>

<Popover.Root {open} onOpenChange={handleOpenChange}>
  <Tooltip.Root disabled={open}>
    <Tooltip.Trigger>
      {#snippet child({ props: tipProps })}
        <Popover.Trigger>
          {#snippet child({ props: popProps })}
            <div class="relative inline-flex shrink-0">
              <button
                {...tipProps}
                {...popProps}
                type="button"
                aria-label="Notifications"
                class={cn(
                  "icon-only hover-icon-shrink hover:bg-grey-25 text-text-primary inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent transition-all",
                  open && "active bg-grey-25 text-primary!",
                  theme.isTopNavContained && "hover:bg-grey-50",
                  open && theme.isTopNavContained && "active bg-grey-50",
                  className,
                )}
              >
                {#if notificationOn}
                  <CiBell size="large" variant={open ? "contained" : "outlined"} class="transition-transform" />
                {:else}
                  <CiBellInactive size="large" variant={open ? "contained" : "outlined"} class="transition-transform" />
                {/if}
              </button>
              {#if unreadCount > 0}
                <span
                  aria-label="{unreadCount} unread notifications"
                  class="bg-primary text-text-contrast font-body pointer-events-none absolute top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold ltr:right-2 rtl:left-2"
                >
                  {unreadCount}
                </span>
              {/if}
            </div>
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
        Notifications
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>

  <Popover.Portal>
    <Popover.Content
      align="end"
      sideOffset={12}
      class="bg-background-paper shadow-darker-sm z-100 w-xs rounded-3xl p-3 outline-none md:w-sm"
    >
      <div class="flex flex-row items-start justify-between pe-4">
        <h2 class="card-title font-heading text-text-primary mb-2 min-h-8 px-4 pt-4 text-lg font-bold">
          Notifications
        </h2>
        <div class="mt-3 flex flex-row gap-1">
          <button
            type="button"
            aria-label={notificationOn ? "Mute notifications" : "Enable notifications"}
            onclick={() => (notificationOn = !notificationOn)}
            class="text-text-secondary hover:bg-grey-25 hover:text-text-primary inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent"
          >
            {#if notificationOn}
              <CiBell size="small" />
            {:else}
              <CiBellInactive size="small" />
            {/if}
          </button>
          <a
            href={settingsHref}
            aria-label="Notification settings"
            onclick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                open = false;
                onNavigate(settingsHref);
              }
            }}
            class="text-text-secondary hover:bg-grey-25 hover:text-text-primary inline-flex h-8 w-8 items-center justify-center rounded-sm no-underline"
          >
            <CiSettings size="small" />
          </a>
        </div>
      </div>

      <Tabs.Root bind:value={tabValue}>
        <Tabs.List class="mb-5 flex gap-1 px-4">
          <Tabs.Trigger
            value="all"
            class={cn(
              "font-body text-text-primary border-grey-200 hover:text-primary inline-flex cursor-pointer items-center gap-1 rounded-xs border border-solid bg-transparent px-3.25 py-[calc(0.375rem-1px)] text-sm leading-4 font-medium transition-colors",
              tabValue === "all" && "border-primary! text-primary!",
            )}
          >
            <CiStructure size="tiny" /> All
          </Tabs.Trigger>
          <Tabs.Trigger
            value="system"
            class={cn(
              "font-body text-text-primary border-grey-200 hover:text-primary inline-flex cursor-pointer items-center gap-1 rounded-xs border border-solid bg-transparent px-3.25 py-[calc(0.375rem-1px)] text-sm leading-4 font-medium transition-colors",
              tabValue === "system" && "border-primary! text-primary!",
            )}
          >
            <CiScreen size="tiny" /> System
          </Tabs.Trigger>
          <Tabs.Trigger
            value="user"
            class={cn(
              "font-body text-text-primary border-grey-200 hover:text-primary inline-flex cursor-pointer items-center gap-1 rounded-xs border border-solid bg-transparent px-3.25 py-[calc(0.375rem-1px)] text-sm leading-4 font-medium transition-colors",
              tabValue === "user" && "border-primary! text-primary!",
            )}
          >
            <CiUsers size="tiny" /> User
          </Tabs.Trigger>
        </Tabs.List>

        <div class="mb-4 max-h-96 overflow-auto">
          <ul class="m-0 flex list-none flex-col gap-0.5 p-0">
            {#each displayedItems as item (item.id)}
              <li class="group relative px-4 py-0">
                <div
                  class={cn(
                    "hover:bg-grey-500/10 flex w-full items-start gap-3 rounded-sm px-3 py-2 transition-colors",
                    (item.temporaryUnread || item.markedUnread) && "bg-primary-dark/5",
                  )}
                >
                  {#if item.type === "user" && item.avatarImage}
                    <img
                      src={item.avatarImage}
                      alt={item.labelBold}
                      class="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                  {:else}
                    <span
                      class={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                        item.avatarColorBackground ?? "bg-primary-light/10",
                      )}
                    >
                      {#if item.avatarIcon}
                        <CoimIcon
                          icon={item.avatarIcon}
                          size="medium"
                          class={item.avatarColorMain ?? "text-primary"}
                        />
                      {/if}
                    </span>
                  {/if}

                  <div class="flex min-w-0 flex-1 flex-col items-start gap-2">
                    <button
                      type="button"
                      onclick={() => handleItemNavigate(item.href)}
                      class="w-full cursor-pointer border-0 bg-transparent p-0 pe-8 text-start"
                    >
                      <span class="font-body text-text-primary block text-base leading-4 font-normal">
                        <strong class="font-bold">{item.labelBold}</strong> {item.labelRegular}
                      </span>
                      <span class="font-body text-text-secondary mt-1 block text-sm">
                        {item.time}
                      </span>
                    </button>

                    {#if item.chips && item.chips.length > 0}
                      <div class="flex flex-wrap gap-1">
                        {#each item.chips as chip (chip.id)}
                          <span
                            class="outline-grey-200 font-body text-text-primary inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-sm font-medium outline-1 -outline-offset-1"
                          >
                            {#if chip.image}
                              <img src={chip.image} alt="" class="h-4 w-4 rounded-full object-cover" />
                            {/if}
                            {chip.label}
                          </span>
                        {/each}
                      </div>
                    {/if}

                    {#if item.actions && item.actions.length > 0}
                      {#if resolvedActions[item.id]}
                        <span class="bg-primary/10 text-primary rounded-xs px-2.5 py-0.5 text-xs font-semibold">
                          {resolvedActions[item.id]}
                        </span>
                      {:else}
                        <div class="flex flex-row gap-1">
                          {#each item.actions as action (action.id)}
                            <button
                              type="button"
                              onclick={() => handleActionClick(item, action)}
                              class={cn(
                                "font-body cursor-pointer rounded-xs border-0 px-3 py-1 text-sm leading-4 font-medium transition-colors",
                                action.type === "positive"
                                  ? "bg-primary text-text-contrast hover:bg-primary-light"
                                  : "text-primary hover:bg-primary-light/10 bg-transparent",
                              )}
                            >
                              {action.label}
                            </button>
                          {/each}
                        </div>
                      {/if}
                    {/if}
                  </div>
                </div>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    {#snippet child({ props })}
                      <button
                        {...props}
                        type="button"
                        aria-label="Notification options"
                        class="hover:text-text-primary hover:bg-grey-100 text-text-secondary absolute inset-e-6 top-2 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-xs border-0 bg-transparent opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                      >
                        <CiEllipsisHorizontal size="small" />
                      </button>
                    {/snippet}
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="end"
                      sideOffset={4}
                      class="bg-background-paper shadow-darker-sm outline-grey-50 z-110 min-w-32 rounded-lg p-1.5 outline-1"
                    >
                      {#if item.markedUnread}
                        <DropdownMenu.Item
                          onSelect={() => toggleReadState(item.id, false)}
                          class="font-body text-text-primary hover:bg-grey-500/10 cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium outline-none"
                        >
                          Mark as Read
                        </DropdownMenu.Item>
                      {:else}
                        <DropdownMenu.Item
                          onSelect={() => toggleReadState(item.id, true)}
                          class="font-body text-text-primary hover:bg-grey-500/10 cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium outline-none"
                        >
                          Mark as Unread
                        </DropdownMenu.Item>
                      {/if}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </li>
            {/each}
          </ul>
        </div>
      </Tabs.Root>

      <div class="px-4 pt-2 pb-4">
        <button
          type="button"
          onclick={handleViewAll}
          class="border-grey-200 text-text-primary hover:bg-grey-200/10 font-body w-full cursor-pointer rounded-xs border border-solid bg-transparent px-3.5 py-1.5 text-sm leading-4 font-medium transition-colors"
        >
          {viewAllHref ? "View All" : "Mark All Read"}
        </button>
      </div>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
