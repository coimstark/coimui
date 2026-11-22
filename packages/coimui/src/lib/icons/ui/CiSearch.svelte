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
        <path
          opacity={oneTone ? 1 : 0.6}
          d="M22 22L18.5 18.5"
          stroke="currentColor"
          stroke-width={iconStrokeWidth}
          stroke-linecap="round"
        />
        <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" stroke-width={iconStrokeWidth} />
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
          opacity={oneTone ? 1 : 0.4}
          d="M19.0303 17.9697C18.7374 17.6768 18.2627 17.6768 17.9698 17.9697C17.6769 18.2626 17.6769 18.7373 17.9698 19.0302L21.4698 22.5302C21.7627 22.8231 22.2374 22.8231 22.5303 22.5302C22.8232 22.2373 22.8232 21.7626 22.5303 21.4697L19.0303 17.9697Z"
          fill="currentColor"
        />
        <path
          d="M11.5 1.25C17.1609 1.25 21.75 5.83908 21.75 11.5C21.75 17.1609 17.1609 21.75 11.5 21.75C5.83908 21.75 1.25 17.1609 1.25 11.5C1.25 5.83908 5.83908 1.25 11.5 1.25Z"
          fill="currentColor"
        />
      </svg>
{/if}
