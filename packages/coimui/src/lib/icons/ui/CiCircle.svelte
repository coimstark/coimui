<script lang="ts">
  import { sizeHelper, strokeSizeHelper, type IconProps } from "../helpers.js";

  let {
    class: className = "",
    variant = "outlined",
    size = "medium",
    oneTone = false,
    strokeWidth,
    label,
    ...rest
  }: IconProps = $props();

  const iconSize = $derived(sizeHelper(size));
  const iconStrokeWidth = $derived(strokeWidth ?? strokeSizeHelper(iconSize));
</script>

{#if variant === "outlined"}
  <svg
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      {...rest}
        width={iconSize}
        height={iconSize}
        class={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width={iconStrokeWidth} />
      </svg>
{:else}
  <svg
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      {...rest}
        width={iconSize}
        height={iconSize}
        class={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12C1.25 6.06294 6.06294 1.25 12 1.25Z"
          fill="currentColor"
        />
      </svg>
{/if}
