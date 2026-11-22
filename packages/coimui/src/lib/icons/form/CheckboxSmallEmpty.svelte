<script lang="ts">
  import { cn } from "../../utilities/utils.js";
  import type { FormIconProps } from "../helpers.js";

  let { class: className = "", label, ...rest }: FormIconProps = $props();
</script>

<svg
    role={label ? "img" : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : "true"}
    {...rest}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class={cn("contained", className)}
    >
      <rect width="18" height="18" rx="6" fill="currentColor" />
    </svg>
