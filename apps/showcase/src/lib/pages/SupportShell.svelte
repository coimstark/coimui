<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import { CoimBreadcrumbs, CoimButton, CoimStack, CoimTypography } from "@coimui/svelte";

  interface Props {
    title: string;
    subtitle: string;
    children?: Snippet;
  }

  let { title, subtitle, children }: Props = $props();

  const links = [
    { label: "Hub", href: "/pages/support" },
    { label: "Overview", href: "/pages/support/overview" },
    { label: "Issues Queue", href: "/pages/support/issues" },
    { label: "Issue Detail", href: "/pages/support/issue-detail" },
    { label: "Submit Issue", href: "/pages/support/add-issue" },
  ];

  const currentPath = $derived(page.url.pathname);
</script>

<CoimStack spacing={5}>
  <div>
    <CoimBreadcrumbs
      items={[
        { label: "Pages", href: "/pages" },
        { label: "Support", href: "/pages/support/overview" },
        { label: title },
      ]}
    />
    <CoimTypography variant="h1" class="mt-2">{title}</CoimTypography>
    <p class="text-text-secondary mt-1 text-sm">{subtitle}</p>
  </div>

  <nav aria-label="Support pages" class="flex flex-wrap gap-2">
    {#each links as item (item.href)}
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
