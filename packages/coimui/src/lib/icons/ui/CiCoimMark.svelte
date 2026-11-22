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
          d="M12 2.5L20.5 7.4V16.6L12 21.5L3.5 16.6V7.4L12 2.5Z"
          stroke="currentColor"
          stroke-width={iconStrokeWidth}
          stroke-linejoin="round"
        />
        <path
          d="M12 7.5L16.2 9.9V14.1L12 16.5L7.8 14.1V9.9L12 7.5Z"
          stroke="currentColor"
          stroke-width={iconStrokeWidth}
          stroke-linejoin="round"
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
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12 2L21 7.2V16.8L12 22L3 16.8V7.2L12 2ZM12 7.5L7.8 9.9V14.1L12 16.5L16.2 14.1V9.9L12 7.5Z"
          fill="currentColor"
        />
      </svg>
{/if}
