<script lang="ts">
  import hljs from "highlight.js/lib/common";
  import { cn } from "../utilities/utils.js";

  interface Props {
    code: string;
    language?: string;
    filename?: string;
    showLineNumbers?: boolean;
    copyable?: boolean;
    class?: string;
  }

  let {
    code,
    language = "typescript",
    filename,
    showLineNumbers = false,
    copyable = true,
    class: className = "",
  }: Props = $props();

  let copied = $state(false);

  const highlighted = $derived.by(() => {
    try {
      if (language && hljs.getLanguage(language)) {
        return hljs.highlight(code, { language }).value;
      }
      return hljs.highlightAuto(code).value;
    } catch {
      return code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
  });

  const lines = $derived(code.split("\n"));

  async function handleCopy() {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        // Fallback if clipboard API blocked in non-HTTPS test env
      }
    }
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 1500);
  }
</script>

<div class={cn("coim-code-block", className)}>
  <div class="coim-code-block-header">
    <span class="font-medium">{filename ?? language}</span>
    {#if copyable}
      <button
        type="button"
        class="hover:text-primary rounded px-2 py-0.5 text-xs font-medium transition-colors"
        onclick={handleCopy}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    {/if}
  </div>

  <div class="flex overflow-x-auto">
    {#if showLineNumbers}
      <div
        aria-hidden="true"
        class="text-text-disabled-dark border-grey-100 select-none border-e px-3 py-3.5 text-end font-mono text-xs leading-6"
      >
        {#each lines as _line, i (i)}
          <div>{i + 1}</div>
        {/each}
      </div>
    {/if}

    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre
      role="region"
      tabindex={0}
      aria-label={filename ? `${filename} code snippet` : `${language} code snippet`}
      class="coim-code-block-pre focus-visible:outline-primary flex-1 focus-visible:outline-2"
    ><code class={`hljs language-${language}`}><!-- eslint-disable-next-line svelte/no-at-html-tags -->{@html highlighted}</code></pre>
  </div>
</div>
