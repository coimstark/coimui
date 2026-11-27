<script lang="ts">
  import { DropdownMenu, Popover } from "bits-ui";
  import CiChevronRightSmall from "../icons/ui/CiChevronRightSmall.svelte";
  import CiMessages from "../icons/ui/CiMessages.svelte";
  import CiMoon from "../icons/ui/CiMoon.svelte";
  import CiPaintRoller from "../icons/ui/CiPaintRoller.svelte";
  import CiScreen from "../icons/ui/CiScreen.svelte";
  import CiSquircle from "../icons/ui/CiSquircle.svelte";
  import CiSun from "../icons/ui/CiSun.svelte";
  import CiUsers from "../icons/ui/CiUsers.svelte";
  import CoimIcon from "../icons/CoimIcon.svelte";
  import { getThemeContext } from "../theme/theme-state.svelte.js";
  import { THEME_OPTIONS, type ModeVariant, type ThemeVariant } from "../theme/types.js";
  import { cn } from "../utilities/utils.js";
  import { resolveLabel } from "./nav-utils.js";
  import type {
    CoimLocaleOption,
    CoimUserAccount,
    CoimUserMenuLink,
    CoimUserProfile,
    NavigateFn,
    TranslateFn,
  } from "./types.js";

  interface Props {
    user?: CoimUserProfile;
    accounts?: CoimUserAccount[];
    activeAccountId?: string;
    keepUserProfileOnAccountSwitch?: boolean;
    showAccounts?: boolean;
    showThemePicker?: boolean;
    showLocalePicker?: boolean;
    links?: CoimUserMenuLink[];
    secondaryLinks?: CoimUserMenuLink[];
    locales?: CoimLocaleOption[];
    locale?: string;
    onLocaleChange?: (code: string) => void;
    onAccountSwitch?: (account: CoimUserAccount) => void;
    onNavigate?: NavigateFn;
    translate?: TranslateFn;
    signOutHref?: string;
    class?: string;
  }

  const defaultUser: CoimUserProfile = {
    name: "Laura Ellis",
    email: "laura.ellis@coimui.dev",
    avatar: "/images/avatars/avatar-3.jpg",
  };

  const defaultAccounts: CoimUserAccount[] = [
    { id: "a-1", name: "Laura Ellis", email: "laura.ellis@coimui.dev", avatar: "/images/avatars/avatar-3.jpg" },
    { id: "a-2", name: "Travis Howard", email: "travis.howard@coimui.dev", avatar: "/images/avatars/avatar-2.jpg" },
    { id: "a-3", name: "Cindy Baker", email: "cindy.baker@coimui.dev", avatar: "/images/avatars/avatar-7.jpg" },
    { id: "a-4", name: "Agnes Walker", email: "agnes.walker@coimui.dev", avatar: "/images/avatars/avatar-4.jpg" },
  ];

  const defaultLinks: CoimUserMenuLink[] = [
    { id: "overview", label: "user-overview", href: "/", icon: "CiUser" },
    { id: "profile", label: "user-profile", href: "/pages/profile", icon: "CiSettings" },
  ];

  const defaultSecondaryLinks: CoimUserMenuLink[] = [
    { id: "docs", label: "user-documentation", href: "/docs", icon: "CiDocumentFull" },
    { id: "faq", label: "user-help", href: "/pages/faq", icon: "CiQuestionHexagon" },
  ];

  const defaultLocales: CoimLocaleOption[] = [
    { code: "de", label: "de", flagSrc: "/images/flags/de.jpg" },
    { code: "en", label: "en", flagSrc: "/images/flags/en.jpg" },
    { code: "es", label: "es", flagSrc: "/images/flags/es.jpg" },
    { code: "fr", label: "fr", flagSrc: "/images/flags/fr.jpg" },
    { code: "ar", label: "ar", flagSrc: "/images/flags/ar.jpg" },
  ];

  let {
    user = defaultUser,
    accounts = defaultAccounts,
    activeAccountId,
    keepUserProfileOnAccountSwitch = false,
    showAccounts = true,
    showThemePicker = true,
    showLocalePicker = true,
    links = defaultLinks,
    secondaryLinks = defaultSecondaryLinks,
    locales = defaultLocales,
    locale = "en",
    onLocaleChange,
    onAccountSwitch,
    onNavigate,
    translate = (k) => k,
    signOutHref = "/pages/auth/sign-in",
    class: className = "",
  }: Props = $props();

  const theme = getThemeContext();

  let open = $state(false);
  let accountsExpanded = $state(false);
  let selectedAccount = $state<CoimUserAccount | null>(null);

  const activeUser = $derived<CoimUserProfile>(
    selectedAccount && !keepUserProfileOnAccountSwitch
      ? {
          name: selectedAccount.name,
          email: selectedAccount.email,
          avatar: selectedAccount.avatar,
        }
      : user,
  );

  function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }

  function go(href: string) {
    open = false;
    onNavigate?.(href);
  }

  function handleSelectAccount(acc: CoimUserAccount) {
    selectedAccount = acc;
    accountsExpanded = false;
    open = false;
    onAccountSwitch?.(acc);
  }

  const modeLabel = $derived(
    theme.mode === "light"
      ? resolveLabel(translate, "mode-light")
      : theme.mode === "dark"
        ? resolveLabel(translate, "mode-dark")
        : resolveLabel(translate, "mode-system"),
  );

  const themeLabel = $derived(
    theme.theme === "theme-blue"
      ? resolveLabel(translate, "user-blue")
      : theme.theme === "theme-green"
        ? resolveLabel(translate, "user-green")
        : theme.theme === "theme-orange"
          ? resolveLabel(translate, "user-orange")
          : resolveLabel(translate, "user-purple"),
  );

  const themeChoices: { value: ThemeVariant; labelKey: string; colorClass: string }[] = [
    { value: THEME_OPTIONS.PURPLE, labelKey: "user-purple", colorClass: "text-[#B124A4]" },
    { value: THEME_OPTIONS.BLUE, labelKey: "user-blue", colorClass: "text-[#007C9E]" },
    { value: THEME_OPTIONS.GREEN, labelKey: "user-green", colorClass: "text-[#3D8218]" },
    { value: THEME_OPTIONS.ORANGE, labelKey: "user-orange", colorClass: "text-[#B86300]" },
  ];

  const modeChoices: { value: ModeVariant; labelKey: string }[] = [
    { value: "system", labelKey: "user-system" },
    { value: "light", labelKey: "user-light" },
    { value: "dark", labelKey: "user-dark" },
  ];
</script>

<Popover.Root bind:open>
  <Popover.Trigger>
    {#snippet child({ props })}
      <div class={cn("inline-flex items-center", className)}>
        <button
          {...props}
          type="button"
          aria-label={`Open user menu for ${activeUser.name}`}
          class={cn(
            "group hover:bg-grey-25 font-body text-text-primary ms-1 me-1 inline-flex cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent p-0 text-base font-medium transition-all md:ms-2 md:me-0 md:ps-2 md:hover:py-1 md:hover:pe-1.5",
            open && "active bg-grey-25 md:py-1 md:pe-1.5",
            theme.isTopNavContained && "hover:bg-grey-50",
            theme.isTopNavContained && open && "bg-grey-50",
          )}
        >
          <span class="hidden md:inline">{activeUser.name}</span>
          {#if activeUser.avatar}
            <img
              src={activeUser.avatar}
              alt=""
              class={cn(
                "h-10 w-10 rounded-lg object-cover transition-all group-hover:h-8 group-hover:w-8 md:group-hover:ms-0.5",
                open && "h-8! w-8! md:ms-0.5",
              )}
            />
          {:else}
            <span
              aria-hidden="true"
              class={cn(
                "bg-primary-light/15 text-primary font-heading inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-all md:h-8 md:w-8",
                open && "bg-primary/20",
              )}
            >
              {getInitials(activeUser.name)}
            </span>
          {/if}
        </button>
      </div>
    {/snippet}
  </Popover.Trigger>

  <Popover.Portal>
    <Popover.Content
      align="end"
      sideOffset={12}
      class="bg-background-paper shadow-darker-sm z-100 rounded-3xl p-3 outline-none"
    >
      <div class="p-4">
        <div class="max-w-64 sm:w-72 sm:max-w-none">
          <div class="mb-4 flex flex-col items-center">
            {#if activeUser.avatar}
              <img src={activeUser.avatar} alt={activeUser.name} class="mb-2 h-10 w-10 rounded-lg object-cover" />
            {:else}
              <span
                aria-hidden="true"
                class="bg-primary-light/15 text-primary font-heading mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold"
              >
                {getInitials(activeUser.name)}
              </span>
            {/if}
            <p class="font-body text-text-primary m-0 text-base font-bold">{activeUser.name}</p>
            <p class="font-body text-text-secondary m-0 mt-0.5 text-sm">{activeUser.email}</p>
          </div>

          {#if showAccounts && accounts.length > 0}
          <!-- Switchable Accounts Accordion -->
          <div>
            <button
              type="button"
              aria-expanded={accountsExpanded}
              onclick={() => (accountsExpanded = !accountsExpanded)}
              class={cn(
                "bg-grey-500/10 hover:text-primary font-body text-text-primary flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 px-4 py-2 text-base leading-6 font-medium transition-all",
                accountsExpanded && "text-primary rounded-b-none",
              )}
            >
              <CiUsers size={20} />
              <span class="flex flex-1 items-center justify-between">
                <span>{resolveLabel(translate, "user-accounts")}</span>
                {#if !accountsExpanded}
                  <span class="flex -space-x-1.5">
                    {#each accounts.slice(0, 3) as acc (acc.id)}
                      {#if acc.avatar}
                        <img src={acc.avatar} alt={acc.name} class="border-background-paper h-6 w-6 rounded-md border object-cover" />
                      {/if}
                    {/each}
                  </span>
                {/if}
              </span>
              <CiChevronRightSmall
                size={20}
                class={cn("transition-transform rtl:rotate-180", accountsExpanded && "rotate-90 rtl:rotate-90")}
              />
            </button>

            {#if accountsExpanded}
              <div class="bg-grey-500/10 rounded-b-lg px-4 pt-2 pb-4">
                <ul class="m-0 flex list-none flex-col gap-1 p-0">
                  {#each accounts as acc (acc.id)}
                    <li>
                      <button
                        type="button"
                        onclick={() => handleSelectAccount(acc)}
                        class={cn(
                          "hover:bg-grey-500/10 flex w-full cursor-pointer items-center gap-2 rounded-sm border-0 bg-transparent px-2 py-1.5 text-start transition-colors",
                          (activeAccountId ? acc.id === activeAccountId : activeUser.email === acc.email) &&
                            "bg-primary/10 text-primary",
                        )}
                      >
                        {#if acc.avatar}
                          <img src={acc.avatar} alt={acc.name} class="h-7 w-7 rounded-md object-cover" />
                        {/if}
                        <span class="flex flex-col">
                          <span class="font-body text-text-primary text-base leading-4">{acc.name}</span>
                          <span class="font-body text-text-secondary text-sm">{acc.email}</span>
                        </span>
                      </button>
                    </li>
                  {/each}
                </ul>
              </div>
            {/if}
          </div>

          <hr class="border-grey-100 my-4 border-0 border-t" />
          {:else}
          <hr class="border-grey-100 my-3 border-0 border-t" />
          {/if}

          <div class="flex flex-col gap-0.5">
            {#each links as item (item.id)}
              <button
                type="button"
                onclick={() => go(item.href)}
                class="font-body text-text-primary hover:bg-grey-500/10 flex w-full cursor-pointer items-center gap-3 rounded-sm border-0 bg-transparent px-3 py-2 text-start text-base font-medium transition-colors"
              >
                <CoimIcon icon={item.icon} size={20} />
                <span>{resolveLabel(translate, item.label)}</span>
              </button>
            {/each}

            {#if links.length > 0 && (showThemePicker || (showLocalePicker && locales.length > 0))}
              <hr class="border-grey-100 my-3 border-0 border-t" />
            {/if}

            {#if showThemePicker}
            <!-- Mode Submenu -->
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                {#snippet child({ props })}
                  <button
                    {...props}
                    type="button"
                    class="font-body text-text-primary hover:bg-grey-500/10 flex w-full cursor-pointer items-center gap-3 rounded-sm border-0 bg-transparent px-3 py-2 text-start text-base font-medium transition-colors"
                  >
                    {#if theme.mode === "light"}
                      <CiSun size={20} />
                    {:else if theme.mode === "dark"}
                      <CiMoon size={20} />
                    {:else}
                      <CiScreen size={20} />
                    {/if}
                    <span class="flex-1">{resolveLabel(translate, "user-mode")}</span>
                    <span class="outline-grey-200 rounded-sm px-2 py-0.5 text-sm outline-1 -outline-offset-1">
                      {modeLabel}
                    </span>
                    <CiChevronRightSmall size={20} class="rtl:rotate-180" />
                  </button>
                {/snippet}
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={4}
                  class="bg-background-paper shadow-darker-sm outline-grey-50 z-110 w-60 rounded-lg p-2 outline-1"
                >
                  {#each modeChoices as choice (choice.value)}
                    <DropdownMenu.Item
                      onSelect={() => theme.setMode(choice.value)}
                      class={cn(
                        "font-body text-text-primary hover:bg-grey-500/10 flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-base font-medium outline-none",
                        theme.mode === choice.value && "bg-grey-500/15 text-primary",
                      )}
                    >
                      {#if choice.value === "system"}
                        <CiScreen size={20} />
                      {:else if choice.value === "light"}
                        <CiSun size={20} />
                      {:else}
                        <CiMoon size={20} />
                      {/if}
                      {resolveLabel(translate, choice.labelKey)}
                    </DropdownMenu.Item>
                  {/each}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <!-- Theme Palette Submenu -->
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                {#snippet child({ props })}
                  <button
                    {...props}
                    type="button"
                    class="font-body text-text-primary hover:bg-grey-500/10 flex w-full cursor-pointer items-center gap-3 rounded-sm border-0 bg-transparent px-3 py-2 text-start text-base font-medium transition-colors"
                  >
                    <CiPaintRoller size={20} />
                    <span class="flex-1">{resolveLabel(translate, "user-theme")}</span>
                    <span class="outline-grey-200 rounded-sm px-2 py-0.5 text-sm outline-1 -outline-offset-1">
                      {themeLabel}
                    </span>
                    <CiChevronRightSmall size={20} class="rtl:rotate-180" />
                  </button>
                {/snippet}
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={4}
                  class="bg-background-paper shadow-darker-sm outline-grey-50 z-110 w-60 rounded-lg p-2 outline-1"
                >
                  {#each themeChoices as choice (choice.value)}
                    <DropdownMenu.Item
                      onSelect={() => theme.setTheme(choice.value)}
                      class={cn(
                        "font-body text-text-primary hover:bg-grey-500/10 flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-base font-medium outline-none",
                        theme.theme === choice.value && "bg-grey-500/15 text-primary",
                      )}
                    >
                      <CiSquircle size={20} class={choice.colorClass} />
                      {resolveLabel(translate, choice.labelKey)}
                    </DropdownMenu.Item>
                  {/each}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            {/if}

            {#if showLocalePicker && locales.length > 0}
            <!-- Language Submenu -->
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                {#snippet child({ props })}
                  <button
                    {...props}
                    type="button"
                    class="font-body text-text-primary hover:bg-grey-500/10 flex w-full cursor-pointer items-center gap-3 rounded-sm border-0 bg-transparent px-3 py-2 text-start text-base font-medium transition-colors"
                  >
                    <CiMessages size={20} />
                    <span class="flex-1">{resolveLabel(translate, "user-language")}</span>
                    <span class="outline-grey-200 inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-sm outline-1 -outline-offset-1">
                      {resolveLabel(translate, locale)}
                    </span>
                    <CiChevronRightSmall size={20} class="rtl:rotate-180" />
                  </button>
                {/snippet}
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={4}
                  class="bg-background-paper shadow-darker-sm outline-grey-50 z-110 w-60 rounded-lg p-2 outline-1"
                >
                  {#each locales as opt (opt.code)}
                    <DropdownMenu.Item
                      onSelect={() => onLocaleChange?.(opt.code)}
                      class={cn(
                        "font-body text-text-primary hover:bg-grey-500/10 flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-base font-medium outline-none",
                        locale === opt.code && "bg-grey-500/15 text-primary",
                      )}
                    >
                      {#if opt.flagSrc}
                        <img src={opt.flagSrc} alt="" class="h-4 w-4 rounded-full object-cover" />
                      {/if}
                      {resolveLabel(translate, opt.label)}
                    </DropdownMenu.Item>
                  {/each}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            {/if}

            {#if secondaryLinks.length > 0}
              <hr class="border-grey-100 my-3 border-0 border-t" />

              {#each secondaryLinks as item (item.id)}
                <button
                  type="button"
                  onclick={() => go(item.href)}
                  class="font-body text-text-primary hover:bg-grey-500/10 flex w-full cursor-pointer items-center gap-3 rounded-sm border-0 bg-transparent px-3 py-2 text-start text-base font-medium transition-colors"
                >
                  <CoimIcon icon={item.icon} size={20} />
                  <span>{resolveLabel(translate, item.label)}</span>
                </button>
              {/each}
            {/if}
          </div>

          <div class="mt-6">
            <a
              href={signOutHref}
              onclick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  go(signOutHref);
                }
              }}
              class="border-grey-200 text-text-primary hover:bg-grey-200/10 font-body inline-flex w-full items-center justify-center rounded-xs border border-solid bg-transparent px-3.5 py-1.5 text-sm leading-4 font-medium no-underline transition-colors"
            >
              {resolveLabel(translate, "user-sign-out")}
            </a>
          </div>
        </div>
      </div>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
