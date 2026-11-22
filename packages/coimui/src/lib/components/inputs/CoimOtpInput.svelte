<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import type { CoimInputSize, CoimInputVariant } from "./types.js";

  interface Props {
    value?: string;
    length?: number;
    numericOnly?: boolean;
    mask?: boolean;
    variant?: CoimInputVariant;
    size?: CoimInputSize;
    surface?: boolean;
    error?: boolean;
    disabled?: boolean;
    name?: string;
    onValueChange?: (value: string) => void;
    onComplete?: (value: string) => void;
    class?: string;
  }

  let {
    value = $bindable(""),
    length = 6,
    numericOnly = true,
    mask = false,
    variant = "outlined",
    size = "medium",
    surface = false,
    error = false,
    disabled = false,
    name,
    onValueChange,
    onComplete,
    class: className = "",
  }: Props = $props();

  let refs = $state<(HTMLInputElement | null)[]>([]);
  let focusedIndex = $state<number | null>(null);

  const cells = $derived(
    Array.from({ length }, (_, idx) => value[idx] ?? ""),
  );

  function sanitize(raw: string): string {
    return numericOnly ? raw.replace(/\D/g, "") : raw.replace(/\s+/g, "");
  }

  function updateCell(idx: number, nextChars: string) {
    const clean = sanitize(nextChars);
    const arr = Array.from({ length }, (_, i) => value[i] ?? "");

    if (!clean) {
      arr[idx] = "";
      const joined = arr.join("");
      value = joined;
      onValueChange?.(joined);
      return;
    }

    for (let offset = 0; offset < clean.length && idx + offset < length; offset++) {
      arr[idx + offset] = clean[offset];
    }

    const joined = arr.join("");
    value = joined;
    onValueChange?.(joined);

    const nextFocus = Math.min(length - 1, idx + clean.length);
    refs[nextFocus]?.focus();

    if (joined.length === length && !arr.includes("")) {
      onComplete?.(joined);
    }
  }

  function handleKeyDown(idx: number, event: KeyboardEvent) {
    if (event.key === "Backspace") {
      if (!cells[idx] && idx > 0) {
        event.preventDefault();
        const arr = Array.from({ length }, (_, i) => value[i] ?? "");
        arr[idx - 1] = "";
        value = arr.join("");
        onValueChange?.(value);
        refs[idx - 1]?.focus();
      }
    } else if (event.key === "ArrowLeft" && idx > 0) {
      event.preventDefault();
      refs[idx - 1]?.focus();
    } else if (event.key === "ArrowRight" && idx < length - 1) {
      event.preventDefault();
      refs[idx + 1]?.focus();
    }
  }

  function handlePaste(idx: number, event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData("text") ?? "";
    if (!pasted) return;
    event.preventDefault();
    updateCell(idx, pasted);
  }
</script>

<div role="group" aria-label="One-time code" class={cn("coim-otp-group", className)}>
  {#if name}
    <input type="hidden" {name} {value} />
  {/if}

  {#each cells as char, idx (idx)}
    <div
      class={cn(
        "coim-input-root coim-otp-cell justify-center",
        variant === "standard" && "coim-input-standard",
        variant === "surface-standard" && "coim-input-surface-standard",
        variant === "outlined" && "coim-input-standard-outlined",
        variant === "filled" && "coim-input-filled",
        size === "small" && "coim-input-size-small",
        surface && "surface",
        focusedIndex === idx && "coim-focused",
        error && "coim-error",
        disabled && "coim-disabled",
      )}
    >
      <input
        bind:this={refs[idx]}
        type={mask ? "password" : "text"}
        inputmode={numericOnly ? "numeric" : "text"}
        autocomplete={idx === 0 ? "one-time-code" : "off"}
        maxlength={1}
        value={char}
        {disabled}
        aria-label="Digit {idx + 1} of {length}"
        onfocus={() => (focusedIndex = idx)}
        onblur={() => (focusedIndex = null)}
        oninput={(e) => {
          const val = (e.currentTarget as HTMLInputElement).value;
          updateCell(idx, val);
        }}
        onkeydown={(e) => handleKeyDown(idx, e)}
        onpaste={(e) => handlePaste(idx, e)}
        class="coim-input-field text-center"
      />
    </div>
  {/each}
</div>
