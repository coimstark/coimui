<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimChip,
    CoimLinearProgress,
    CoimStack,
    CoimTypography,
  } from "@coimui/svelte";
  import { driveStore } from "./drive.svelte.ts";

  interface Props {
    title: string;
    subtitle: string;
    children?: Snippet;
  }

  let { title, subtitle, children }: Props = $props();

  $effect(() => {
    driveStore.hydrate();
  });

  const navItems = [
    { label: "Home", href: "/apps/drive/home" },
    { label: "My Files", href: "/apps/drive/files" },
    { label: "Folders", href: "/apps/drive/folder" },
    { label: "Favorites", href: "/apps/drive/favorites" },
    { label: "Shared", href: "/apps/drive/shared" },
    { label: "Labels", href: "/apps/drive/label" },
    { label: "Workspaces", href: "/apps/drive/workspaces" },
    { label: "Organizations", href: "/apps/drive/organizations" },
    { label: "Spam", href: "/apps/drive/spam" },
    { label: "Trash", href: "/apps/drive/trash" },
    { label: "Plans", href: "/apps/drive/premium-plans" },
    { label: "Settings", href: "/apps/drive/settings" },
  ];

  const currentPath = $derived(page.url.pathname);
</script>

<CoimStack spacing={5}>
  <div class="flex flex-wrap items-start justify-between gap-4">
    <div>
      <CoimBreadcrumbs
        items={[
          { label: "Applications", href: "/apps" },
          { label: "Cloud Drive", href: "/apps/drive/home" },
          { label: title },
        ]}
      />
      <div class="mt-2 flex flex-wrap items-center gap-3">
        <CoimTypography variant="h1">{title}</CoimTypography>
        <CoimChip label={`${driveStore.totalUsedMb} MB / 50 GB`} size="small" variant="pastel" color="primary" />
      </div>
      <p class="text-text-secondary mt-1 text-sm">{subtitle}</p>
    </div>

    <div class="w-48">
      <div class="text-text-secondary mb-1 flex justify-between text-xs">
        <span>Storage Quota</span>
        <span>{Math.min(100, Math.max(4, Math.round(driveStore.totalUsedMb)))}%</span>
      </div>
      <CoimLinearProgress variant="determinate" value={Math.min(100, Math.max(8, Math.round(driveStore.totalUsedMb * 4)))} />
    </div>
  </div>

  <nav aria-label="Cloud Drive sections" class="flex flex-wrap gap-2">
    {#each navItems as item (item.href)}
      <CoimButton
        href={item.href}
        size="small"
        variant={currentPath === item.href || (currentPath === "/apps/drive" && item.href === "/apps/drive/home")
          ? "contained"
          : "outlined"}
      >
        {item.label}
      </CoimButton>
    {/each}
  </nav>

  {@render children?.()}
</CoimStack>
