<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import {
    CoimAvatar,
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimChip,
    CoimStack,
    CoimTypography,
  } from "@coimui/svelte";

  interface Props {
    title: string;
    subtitle: string;
    children?: Snippet;
  }

  let { title, subtitle, children }: Props = $props();

  const navItems = [
    { label: "Overview", href: "/pages/user/overview" },
    { label: "Friends", href: "/pages/user/friends" },
    { label: "Permissions", href: "/pages/user/permissions" },
    { label: "Projects", href: "/pages/user/projects" },
    { label: "Social Feed", href: "/pages/user/social" },
  ];

  const currentPath = $derived(page.url.pathname);
</script>

<CoimStack spacing={5}>
  <div>
    <CoimBreadcrumbs
      items={[
        { label: "Pages", href: "/pages" },
        { label: "User", href: "/pages/user/overview" },
        { label: title },
      ]}
    />
    <CoimTypography variant="h1" class="mt-2">{title}</CoimTypography>
    <p class="text-text-secondary mt-1 text-sm">{subtitle}</p>
  </div>

  <CoimCard>
    <CoimCardContent class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <CoimAvatar src="/images/avatars/avatar-3.jpg" alt="Laura Ellis" size="large" />
        <div>
          <div class="flex items-center gap-2">
            <h2 class="font-heading text-lg font-bold">Laura Ellis</h2>
            <CoimChip label="Staff Maintainer" size="small" color="primary" variant="pastel" />
          </div>
          <p class="text-text-secondary text-sm">laura.ellis@coimui.dev · Core Design Systems</p>
        </div>
      </div>

      <nav aria-label="User profile sections" class="flex flex-wrap gap-2">
        {#each navItems as item (item.href)}
          <CoimButton
            href={item.href}
            size="small"
            variant={currentPath === item.href || (currentPath === "/pages/user" && item.href === "/pages/user/overview")
              ? "contained"
              : "outlined"}
          >
            {item.label}
          </CoimButton>
        {/each}
      </nav>
    </CoimCardContent>
  </CoimCard>

  {@render children?.()}
</CoimStack>
