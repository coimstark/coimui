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
        viewBox="0 0 24 24"
        class={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          opacity={oneTone ? 1 : 0.6}
          d="M16 16L13.0607 13.0607C12.4749 12.4749 11.5251 12.4749 10.9393 13.0607L8 16"
          stroke="currentColor"
          stroke-width={iconStrokeWidth}
          stroke-linecap="round"
        />
        <path
          d="M16 11L13.0607 8.06066C12.4749 7.47487 11.5251 7.47487 10.9393 8.06066L8 11"
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
          opacity={oneTone ? 1 : 0.4}
          d="M16.5303 16.5303C16.8232 16.2374 16.8232 15.7627 16.5303 15.4698L13.5909 12.5303C12.7122 11.6518 11.2879 11.6518 10.4092 12.5303L7.46978 15.4698C7.17689 15.7627 7.17689 16.2374 7.46978 16.5303C7.76268 16.8232 8.23744 16.8232 8.53033 16.5303L11.4698 13.5909C11.7626 13.2981 12.2375 13.2981 12.5303 13.5909L15.4698 16.5303C15.7627 16.8232 16.2374 16.8232 16.5303 16.5303Z"
          fill="currentColor"
        />
        <path
          d="M16.5303 11.5303C16.8232 11.2374 16.8232 10.7627 16.5303 10.4698L13.5909 7.53033C12.7122 6.6518 11.2879 6.6518 10.4092 7.53033L7.46978 10.4698C7.17689 10.7627 7.17689 11.2374 7.46978 11.5303C7.76268 11.8232 8.23744 11.8232 8.53033 11.5303L11.4698 8.59088C11.7626 8.29813 12.2375 8.29813 12.5303 8.59088L15.4698 11.5303C15.7627 11.8232 16.2374 11.8232 16.5303 11.5303Z"
          fill="currentColor"
        />
      </svg>
{/if}
