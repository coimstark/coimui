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
        d="M6 0C2.68629 0 0 2.68628 0 6V12C0 15.3137 2.68629 18 6 18H12C15.3137 18 18 15.3137 18 12V6C18 2.68628 15.3137 0 12 0H6ZM8.38373 12.6768L14.5303 6.53033C14.8232 6.23743 14.8232 5.76257 14.5303 5.46967C14.2374 5.17676 13.7626 5.17676 13.4697 5.46967L7.49986 11.4394L5.03035 8.96967C4.73747 8.67676 4.26259 8.67676 3.9697 8.96967C3.67679 9.26251 3.67677 9.73743 3.96965 10.0303L6.61594 12.6768C7.10408 13.165 7.89555 13.165 8.38373 12.6768Z"
        fill="currentColor"
      />
    </svg>
