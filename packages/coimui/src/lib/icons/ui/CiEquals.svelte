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
        <path d="M8 9H16" stroke="currentColor" stroke-width={iconStrokeWidth} stroke-linecap="round" />
        <path d="M8 15H16" stroke="currentColor" stroke-width={iconStrokeWidth} stroke-linecap="round" />
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
          d="M16 8.25C16.4142 8.25 16.75 8.58579 16.75 9C16.75 9.41421 16.4142 9.75 16 9.75H8.00001C7.58579 9.75 7.25001 9.41421 7.25 9C7.25 8.58579 7.58579 8.25 8 8.25H16Z"
          fill="currentColor"
        />
        <path
          d="M16 14.25C16.4142 14.25 16.75 14.5858 16.75 15C16.75 15.4142 16.4142 15.75 16 15.75H8.00001C7.58579 15.75 7.25001 15.4142 7.25 15C7.25 14.5858 7.58579 14.25 8 14.25H16Z"
          fill="currentColor"
        />
      </svg>
{/if}
