<script lang="ts">
  import { cn } from "../utilities/utils.js";
  import { resolveLabel } from "./nav-utils.js";
  import type { CoimFooterLink, NavigateFn, TranslateFn } from "./types.js";

  interface Props {
    links?: CoimFooterLink[];
    translate?: TranslateFn;
    onNavigate?: NavigateFn;
    class?: string;
  }

  const defaultLinks: CoimFooterLink[] = [
    { label: "footer-about", href: "/" },
    { label: "footer-docs", href: "/docs" },
  ];

  let {
    links = defaultLinks,
    translate = (k) => k,
    onNavigate,
    class: className = "",
  }: Props = $props();

  function handleLinkClick(event: MouseEvent, link: CoimFooterLink) {
    if (link.external || !onNavigate) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    onNavigate(link.href);
  }
</script>

<footer
  class={cn("border-grey-100 flex h-12 items-center justify-center gap-1 border-t", className)}
>
  {#each links as link (link.href + link.label)}
    <a
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noreferrer" : undefined}
      onclick={(e) => handleLinkClick(e, link)}
      class="font-body text-text-secondary hover:text-primary inline-flex min-w-7 items-center justify-center rounded-xs px-3.5 py-1.5 text-sm leading-4 font-normal no-underline transition-colors"
    >
      {resolveLabel(translate, link.label)}
    </a>
  {/each}
</footer>
