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
        d="M8 0C3.58173 0 0 3.58173 0 8V14C0 18.4183 3.58173 22 8 22H14C18.4183 22 22 18.4183 22 14V8C22 3.58173 18.4183 0 14 0H8ZM9.97212 14.7653L16.1187 8.61871C16.4604 8.27704 16.4604 7.72302 16.1187 7.38129C15.777 7.03955 15.223 7.03955 14.8813 7.38129L8.99986 13.2626L6.61874 10.8813C6.27705 10.5396 5.72302 10.5396 5.3813 10.8813C5.03958 11.223 5.03957 11.777 5.38126 12.1187L8.02754 14.7652C8.5645 15.3022 9.43513 15.3022 9.97212 14.7653Z"
        fill="currentColor"
      />
    </svg>
