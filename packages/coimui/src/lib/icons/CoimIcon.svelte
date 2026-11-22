<script lang="ts">
  import { IconMap, type IconName } from "./icon-map.js";
  import type { IconProps } from "./helpers.js";

  interface Props extends IconProps {
    icon: IconName;
  }

  let {
    icon,
    size = 20,
    variant = "outlined",
    class: className = "",
    strokeWidth,
    oneTone = false,
    label,
    ...rest
  }: Props = $props();

  const IconComponent = $derived(IconMap[icon]);
</script>

{#if IconComponent}
  <IconComponent
    {variant}
    {size}
    class={className}
    {strokeWidth}
    {oneTone}
    {label}
    {...rest}
  />
{/if}
