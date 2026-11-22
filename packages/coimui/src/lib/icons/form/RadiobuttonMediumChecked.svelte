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
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class={cn("contained", className)}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11 22C17.0751 22 22 17.0751 22 11C22 4.92493 17.0751 0 11 0C4.92487 0 0 4.92493 0 11C0 17.0751 4.92487 22 11 22ZM11 18C14.866 18 18 14.866 18 11C18 7.13403 14.866 4 11 4C7.134 4 4 7.13403 4 11C4 14.866 7.134 18 11 18Z"
        fill="currentColor"
      />
    </svg>
