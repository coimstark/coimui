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
          d="M8 10L11.1515 13.1515C11.6201 13.6201 12.3799 13.6201 12.8485 13.1515L16 10"
          stroke="currentColor"
          stroke-width={iconStrokeWidth}
          stroke-linecap="round"
        />
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
          d="M7.46967 9.46967C7.17678 9.76256 7.17678 10.2373 7.46967 10.5302L10.621 13.6816C11.3826 14.4431 12.6173 14.4431 13.3788 13.6816L16.5302 10.5302C16.8231 10.2373 16.8231 9.76256 16.5302 9.46967C16.2373 9.17678 15.7626 9.17678 15.4697 9.46967L12.3183 12.621C12.1426 12.7968 11.8573 12.7968 11.6816 12.621L8.53022 9.46967C8.23732 9.17678 7.76256 9.17678 7.46967 9.46967Z"
          fill="currentColor"
        />
      </svg>
{/if}
