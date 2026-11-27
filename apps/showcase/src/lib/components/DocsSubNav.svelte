<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import { COIMUI_VERSION, CoimBreadcrumbs, CoimButton, CoimChip, CoimStack, CoimTypography } from "@coimui/svelte";

  interface Props {
    section: string;
    title: string;
    subtitle: string;
    children?: Snippet;
  }

  let { section, title, subtitle, children }: Props = $props();

  const docsNav = [
    { label: "Docs Overview", href: "/docs", group: "Overview" },
    { label: "Introduction", href: "/docs/welcome/introduction", group: "Welcome" },
    { label: "FAQ", href: "/docs/welcome/faq", group: "Welcome" },
    { label: "Changelog", href: "/docs/welcome/changelog", group: "Welcome" },
    { label: "Installation", href: "/docs/getting-started/installation", group: "Setup" },
    { label: "File Structure", href: "/docs/getting-started/file-structure", group: "Setup" },
    { label: "Routing & Menu", href: "/docs/getting-started/routing-and-menu", group: "Setup" },
    { label: "Multi-Language & RTL", href: "/docs/getting-started/multi-language", group: "Setup" },
    { label: "Theme Provider", href: "/docs/theme/theme-provider", group: "Theme" },
    { label: "Tokens & Styling", href: "/docs/theme/styling", group: "Theme" },
    { label: "Theme Settings", href: "/docs/theme/settings", group: "Theme" },
    { label: "Layouts & Shell", href: "/components/layouts", group: "Reference" },
    { label: "Utilities & Transitions", href: "/components/utilities", group: "Reference" },
    { label: "Component API Index", href: "/components", group: "Reference" },
  ];

  const currentPath = $derived(page.url.pathname);
  const currentIndex = $derived(docsNav.findIndex((item) => item.href === currentPath));
  const prevGuide = $derived(currentIndex > 0 ? docsNav[currentIndex - 1] : null);
  const nextGuide = $derived(
    currentIndex >= 0 && currentIndex < docsNav.length - 1 ? docsNav[currentIndex + 1] : null,
  );
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
      <CoimChip label={`@coimui/svelte v${COIMUI_VERSION}`} size="small" color="primary" variant="pastel" />
    </div>
    <p class="text-text-secondary mt-1 text-sm">{subtitle}</p>
  </div>

  <nav
    aria-label="Documentation sections"
    class="border-grey-100 bg-background-paper -mx-1 flex items-center gap-2 overflow-x-auto rounded-lg border px-2 py-2"
  >
    {#each docsNav as item (item.href)}
      <CoimButton
        href={item.href}
        size="small"
        variant={currentPath === item.href ? "contained" : "text"}
        color={currentPath === item.href ? "primary" : "secondary"}
        class="shrink-0 whitespace-nowrap"
        aria-current={currentPath === item.href ? "page" : undefined}
      >
        {item.label}
      </CoimButton>
    {/each}
  </nav>

  {@render children?.()}

  {#if prevGuide || nextGuide}
    <nav
      aria-label="Adjacent documentation guides"
      class="border-grey-100 flex flex-wrap items-center justify-between gap-3 border-t pt-4"
    >
      <div>
        {#if prevGuide}
          <CoimButton href={prevGuide.href} size="small" variant="outlined">
            ← {prevGuide.label}
          </CoimButton>
        {/if}
      </div>
      <div>
        {#if nextGuide}
          <CoimButton href={nextGuide.href} size="small" variant="contained">
            {nextGuide.label} →
          </CoimButton>
        {/if}
      </div>
    </nav>
  {/if}
</CoimStack>
