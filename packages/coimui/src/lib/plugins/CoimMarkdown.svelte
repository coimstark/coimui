<script lang="ts">
  import { marked } from "marked";
  import { cn } from "../utilities/utils.js";

  interface Props {
    content: string;
    breaks?: boolean;
    gfm?: boolean;
    sanitize?: boolean;
    class?: string;
  }

  let {
    content,
    breaks = false,
    gfm = true,
    sanitize = true,
    class: className = "",
  }: Props = $props();

  let sanitizedClientHtml = $state<string | null>(null);

  function basicSanitizeHtml(rawHtml: string): string {
    return rawHtml
      .replace(/<(script|style|iframe|object|embed|svg|math)[\s\S]*?<\/\1>/gi, "")
      .replace(/<(script|iframe|object|embed)[^>]*\/?>/gi, "")
      .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(/\s+(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, ' $1="#"');
  }

  const parsedHtml = $derived.by(() => {
    const rendered = marked.parse(content, {
      async: false,
      gfm,
      breaks,
    });
    const html = typeof rendered === "string" ? rendered : "";
    return sanitize ? basicSanitizeHtml(html) : html;
  });

  $effect(() => {
    const htmlSnapshot = parsedHtml;
    if (!sanitize || typeof window === "undefined") {
      sanitizedClientHtml = null;
      return;
    }

    let cancelled = false;
    void import("dompurify").then((mod) => {
      if (cancelled) return;
      const purifier = mod.default;
      if (purifier && typeof purifier.sanitize === "function") {
        sanitizedClientHtml = purifier.sanitize(htmlSnapshot);
      }
    });

    return () => {
      cancelled = true;
    };
  });

  const finalHtml = $derived(sanitizedClientHtml ?? parsedHtml);
</script>

<div class={cn("coim-markdown", className)}>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html finalHtml}
</div>
