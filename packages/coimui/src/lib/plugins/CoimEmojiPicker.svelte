<script lang="ts">
  import { tryGetThemeContext } from "../theme/theme-state.svelte.js";
  import { cn } from "../utilities/utils.js";
  import type { CoimEmojiSelectDetail } from "./types.js";

  interface Props {
    quickReactions?: string[];
    onSelect?: (detail: CoimEmojiSelectDetail) => void;
    ariaLabel?: string;
    class?: string;
  }

  let {
    quickReactions = ["😊", "🎉", "❤️", "👍", "🚀"],
    onSelect,
    ariaLabel = "Emoji picker",
    class: className = "",
  }: Props = $props();

  const theme = tryGetThemeContext();
  let mountEl = $state<HTMLDivElement | null>(null);
  let mountedCustomPicker = $state(false);
  let pickerEl: HTMLElement | null = null;

  $effect(() => {
    if (typeof window === "undefined" || !mountEl) return;
    let cancelled = false;

    void import("emoji-picker-element").then((mod) => {
      if (cancelled || !mountEl) return;
      try {
        const PickerCtor = mod.Picker;
        if (!PickerCtor || typeof customElements === "undefined") return;
        const el = new PickerCtor() as unknown as HTMLElement;
        el.setAttribute("aria-label", ariaLabel);
        el.addEventListener("emoji-click", (event: Event) => {
          const custom = event as CustomEvent<{ unicode?: string; emoji?: { annotation?: string; unicode?: string } }>;
          const unicode = custom.detail?.unicode ?? custom.detail?.emoji?.unicode ?? "";
          if (unicode) {
            onSelect?.({
              unicode,
              name: custom.detail?.emoji?.annotation,
            });
          }
        });
        mountEl.replaceChildren(el);
        pickerEl = el;
        mountedCustomPicker = true;
      } catch {
        mountedCustomPicker = false;
      }
    });

    return () => {
      cancelled = true;
      pickerEl?.remove();
      pickerEl = null;
    };
  });

  $effect(() => {
    if (!pickerEl) return;
    pickerEl.classList.toggle("dark", Boolean(theme?.isDarkMode));
  });
</script>

<div class={cn("coim-emoji-picker inline-flex flex-col gap-2 rounded-lg border border-grey-100 bg-background-paper p-2", className)} role="region" aria-label={ariaLabel}>
  <div class="flex items-center gap-1" role="group" aria-label="Quick reactions">
    {#each quickReactions as emoji (emoji)}
      <button
        type="button"
        class="hover:bg-grey-50 rounded-md px-2 py-1 text-base leading-none transition-colors"
        onclick={() => onSelect?.({ unicode: emoji })}
      >
        {emoji}
      </button>
    {/each}
  </div>
  <div bind:this={mountEl} data-mounted={mountedCustomPicker ? "true" : "false"}></div>
</div>
