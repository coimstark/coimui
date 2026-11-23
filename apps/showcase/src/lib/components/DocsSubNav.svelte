<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import { CoimBreadcrumbs, CoimButton, CoimChip, CoimStack, CoimTypography } from "@coimui/svelte";

  interface Props {
    section: string;
    title: string;
    subtitle: string;
    children?: Snippet;
  }

  let { section, title, subtitle, children }: Props = $props();

  const docsNav = [
    { label: "Docs Overview", href: "/docs" },
    { label: "Introduction", href: "/docs/welcome/introduction" },
    { label: "FAQ", href: "/docs/welcome/faq" },
    { label: "Changelog", href: "/docs/welcome/changelog" },
    { label: "Installation", href: "/docs/getting-started/installation" },
    { label: "File Structure", href: "/docs/getting-started/file-structure" },
    { label: "Routing & Menu", href: "/docs/getting-started/routing-and-menu" },
    { label: "Multi-Language & RTL", href: "/docs/getting-started/multi-language" },
    { label: "Theme Provider", href: "/docs/theme/theme-provider" },
    { label: "Theme Settings", href: "/docs/theme/settings" },
    { label: "Tokens & Styling", href: "/docs/theme/styling" },
  ];

  const currentPath = $derived(page.url.pathname);
</script>

<CoimStack spacing={5}>
  <div>
    <CoimBreadcrumbs
      items={[
        { label: "Docs", href: "/docs" },
        { label: section },
        { label: title },
      ]}
    />
    <div class="mt-2 flex flex-wrap items-center gap-3">
      <CoimTypography variant="h1">{title}</CoimTypography>
      <CoimChip label="CoimUI v1 Svelte 5" size="small" color="primary" variant="pastel" />
    </div>
    <p class="text-text-secondary mt-1 text-sm">{subtitle}</p>
  </div>

  <nav aria-label="Documentation sections" class="flex flex-wrap gap-2">
    {#each docsNav as item (item.href)}
      <CoimButton
        href={item.href}
        size="small"
        variant={currentPath === item.href ? "contained" : "outlined"}
      >
        {item.label}
      </CoimButton>
    {/each}
  </nav>

  {@render children?.()}
</CoimStack>
