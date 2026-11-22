<script lang="ts">
  import { DropdownMenu, Popover } from "bits-ui";
  import CiBuilding from "../icons/ui/CiBuilding.svelte";
  import CiChevronRightSmall from "../icons/ui/CiChevronRightSmall.svelte";
  import CiDocumentFull from "../icons/ui/CiDocumentFull.svelte";
  import CiFolder from "../icons/ui/CiFolder.svelte";
  import CiMessages from "../icons/ui/CiMessages.svelte";
  import CiMoon from "../icons/ui/CiMoon.svelte";
  import CiPaintRoller from "../icons/ui/CiPaintRoller.svelte";
  import CiQuestionHexagon from "../icons/ui/CiQuestionHexagon.svelte";
  import CiScreen from "../icons/ui/CiScreen.svelte";
  import CiSettings from "../icons/ui/CiSettings.svelte";
  import CiSquircle from "../icons/ui/CiSquircle.svelte";
  import CiSun from "../icons/ui/CiSun.svelte";
  import CiUser from "../icons/ui/CiUser.svelte";
  import CiUsers from "../icons/ui/CiUsers.svelte";
  import { getThemeContext } from "../theme/theme-state.svelte.js";
  import { THEME_OPTIONS, type ModeVariant, type ThemeVariant } from "../theme/types.js";
  import { cn } from "../utilities/utils.js";
  import type {
    CoimLocaleOption,
    CoimUserAccount,
    CoimUserProfile,
    NavigateFn,
    TranslateFn,
  } from "./types.js";

  interface Props {
    user?: CoimUserProfile;
    accounts?: CoimUserAccount[];
    locales?: CoimLocaleOption[];
    locale?: string;
    onLocaleChange?: (code: string) => void;
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
    { id: "a-1", name: "Laura Ellis", email: "laura@coimui.dev", avatar: "/images/avatars/avatar-3.jpg" },
    { id: "a-2", name: "Travis Howard", email: "travis@coimui.dev", avatar: "/images/avatars/avatar-2.jpg" },
    { id: "a-3", name: "Cindy Baker", email: "cindy@coimui.dev", avatar: "/images/avatars/avatar-7.jpg" },
    { id: "a-4", name: "Agnes Walker", email: "agnes@coimui.dev", avatar: "/images/avatars/avatar-4.jpg" },
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
    locales = defaultLocales,
    locale = "en",
    onLocaleChange,
    onNavigate,
    translate = (k) => k,
    signOutHref = "/auth/sign-in",
    class: className = "",
  }: Props = $props();

  const theme = getThemeContext();

  let open = $state(false);
  let accountsExpanded = $state(false);

  function go(href: string) {
    open = false;
    onNavigate?.(href);
  }

  const modeLabel = $derived(
    theme.mode === "light"
      ? translate("mode-light")
      : theme.mode === "dark"
        ? translate("mode-dark")
        : translate("mode-system"),
  );

  const themeLabel = $derived(
    theme.theme === "theme-blue"
      ? translate("user-blue")
      : theme.theme === "theme-green"
        ? translate("user-green")
        : theme.theme === "theme-orange"
          ? translate("user-orange")
          : translate("user-purple"),
  );

  const themeChoices: { value: ThemeVariant; labelKey: string; colorClass: string }[] = [
    { value: THEME_OPTIONS.PURPLE, labelKey: "user-purple", colorClass: "text-[#BF33B2]" },
    { value: THEME_OPTIONS.BLUE, labelKey: "user-blue", colorClass: "text-[#00C1EC]" },
    { value: THEME_OPTIONS.GREEN, labelKey: "user-green", colorClass: "text-[#66BA39]" },
    { value: THEME_OPTIONS.ORANGE, labelKey: "user-orange", colorClass: "text-[#F8A52D]" },
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
          class={cn(
            "group hover:bg-grey-25 font-body text-text-primary ms-2 hidden cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent py-0! pe-0! ps-2 text-base font-medium transition-all hover:py-1! hover:pe-1.5! md:flex",
            open && "active bg-grey-25 py-1! pe-1.5!",
            theme.isTopNavContained && "hover:bg-grey-50",
            theme.isTopNavContained && open && "bg-grey-50",
          )}
        >
          <span>{user.name}</span>
          {#if user.avatar}
            <img
              src={user.avatar}
              alt={user.name}
              class={cn(
                "h-10 w-10 rounded-lg object-cover transition-all group-hover:ms-0.5 group-hover:h-8 group-hover:w-8",
                open && "ms-0.5 h-8! w-8!",
              )}
            />
          {/if}
        </button>

        <button
          {...props}
          type="button"
          aria-label="Open user menu"
          class={cn(
            "hover:bg-grey-25 icon-only group ms-1 me-1 inline-flex cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-0! transition-all hover:p-1.5! md:hidden",
            open && "active bg-grey-25 p-1.5!",
            theme.isTopNavContained && "hover:bg-grey-50",
            theme.isTopNavContained && open && "bg-grey-50",
          )}
        >
          {#if user.avatar}
            <img
              src={user.avatar}
              alt={user.name}
              class={cn("h-10 w-10 rounded-lg object-cover transition-all group-hover:h-7 group-hover:w-7", open && "h-7! w-7!")}
            />
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
            {#if user.avatar}
              <img src={user.avatar} alt={user.name} class="mb-2 h-10 w-10 rounded-lg object-cover" />
            {/if}
            <p class="font-body text-text-primary m-0 text-base font-bold">{user.name}</p>
            <p class="font-body text-text-secondary m-0 mt-0.5 text-sm">{user.email}</p>
          </div>

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
                <span>{translate("user-accounts")}</span>
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
                <ul class="m-0 mb-4 flex list-none flex-col gap-1 p-0">
                  {#each accounts as acc (acc.id)}
                    <li>
                      <button
                        type="button"
                        onclick={() => (open = false)}
                        class="hover:bg-grey-500/10 flex w-full cursor-pointer items-center gap-2 rounded-sm border-0 bg-transparent px-2 py-1.5 text-start transition-colors"
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
                <button
                  type="button"
                  onclick={() => (open = false)}
                  class="border-grey-200 text-text-primary hover:bg-grey-200/10 font-body w-full cursor-pointer rounded-xs border border-solid bg-transparent px-3.5 py-1.5 text-sm leading-4 font-medium"
                >
                  {translate("user-add-account")}
                </button>
              </div>
            {/if}
          </div>

          <hr class="border-grey-100 my-4 border-0 border-t" />

          <div class="flex flex-col gap-0.5">
            <button
              type="button"
              onclick={() => go("/pages/user/overview")}
              class="font-body text-text-primary hover:bg-grey-500/10 flex w-full cursor-pointer items-center gap-3 rounded-sm border-0 bg-transparent px-3 py-2 text-start text-base font-medium transition-colors"
            >
              <CiUser size={20} />
              <span>{translate("user-overview")}</span>
            </button>
            <button
              type="button"
              onclick={() => go("/settings")}
              class="font-body text-text-primary hover:bg-grey-500/10 flex w-full cursor-pointer items-center gap-3 rounded-sm border-0 bg-transparent px-3 py-2 text-start text-base font-medium transition-colors"
            >
              <CiSettings size={20} />
              <span>{translate("user-profile")}</span>
            </button>
            <button
              type="button"
              onclick={() => go("/pages/support/issues")}
              class="font-body text-text-primary hover:bg-grey-500/10 flex w-full cursor-pointer items-center gap-3 rounded-sm border-0 bg-transparent px-3 py-2 text-start text-base font-medium transition-colors"
            >
              <CiBuilding size={20} />
              <span>{translate("user-issues")}</span>
            </button>
            <button
              type="button"
              onclick={() => go("/pages/user/projects")}
              class="font-body text-text-primary hover:bg-grey-500/10 flex w-full cursor-pointer items-center gap-3 rounded-sm border-0 bg-transparent px-3 py-2 text-start text-base font-medium transition-colors"
            >
              <CiFolder size={20} />
              <span>{translate("user-projects")}</span>
            </button>

            <hr class="border-grey-100 my-3 border-0 border-t" />

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
                    <span class="flex-1">{translate("user-mode")}</span>
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
                      {translate(choice.labelKey)}
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
                    <span class="flex-1">Theme</span>
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
                      {translate(choice.labelKey)}
                    </DropdownMenu.Item>
                  {/each}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

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
                    <span class="flex-1">{translate("user-language")}</span>
                    <span class="outline-grey-200 inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-sm outline-1 -outline-offset-1">
                      {translate(locale)}
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
                        <img src={opt.flagSrc} alt={translate(opt.label)} class="h-4 w-4 rounded-full object-cover" />
                      {/if}
                      {translate(opt.label)}
                    </DropdownMenu.Item>
                  {/each}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <hr class="border-grey-100 my-3 border-0 border-t" />

            <button
              type="button"
              onclick={() => go("/docs")}
              class="font-body text-text-primary hover:bg-grey-500/10 flex w-full cursor-pointer items-center gap-3 rounded-sm border-0 bg-transparent px-3 py-2 text-start text-base font-medium transition-colors"
            >
              <CiDocumentFull size={20} />
              <span>{translate("user-documentation")}</span>
            </button>
            <button
              type="button"
              onclick={() => go("/pages/miscellaneous/knowledge-base")}
              class="font-body text-text-primary hover:bg-grey-500/10 flex w-full cursor-pointer items-center gap-3 rounded-sm border-0 bg-transparent px-3 py-2 text-start text-base font-medium transition-colors"
            >
              <CiQuestionHexagon size={20} />
              <span>{translate("user-help")}</span>
            </button>
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
              {translate("user-sign-out")}
            </a>
          </div>
        </div>
      </div>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
