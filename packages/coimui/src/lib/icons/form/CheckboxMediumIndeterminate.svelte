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
        d="M8 0C3.58172 0 0 3.58172 0 8V14C0 18.4183 3.58172 22 8 22H14C18.4183 22 22 18.4183 22 14V8C22 3.58172 18.4183 0 14 0H8ZM14 11.875C14.4832 11.875 14.875 11.4832 14.875 11C14.875 10.5168 14.4832 10.125 14 10.125H8C7.51675 10.125 7.125 10.5168 7.125 11C7.125 11.4832 7.51675 11.875 8 11.875H14Z"
        fill="currentColor"
      />
    </svg>
