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
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6 0C2.68629 0 0 2.68629 0 6V12C0 15.3137 2.68629 18 6 18H12C15.3137 18 18 15.3137 18 12V6C18 2.68629 15.3137 0 12 0H6ZM12 9.75C12.4142 9.75 12.75 9.41421 12.75 9C12.75 8.58579 12.4142 8.25 12 8.25H6C5.58579 8.25 5.25 8.58579 5.25 9C5.25 9.41421 5.58579 9.75 6 9.75H12Z"
        fill="currentColor"
      />
    </svg>
