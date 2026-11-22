<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../utils.js";
  import {
    clickAway,
    type ClickAwayMouseEvent,
    type ClickAwayTouchEvent,
  } from "./click-away.js";

  interface Props {
    onClickAway: (event: Event) => void;
    enabled?: boolean;
    mouseEvent?: ClickAwayMouseEvent;
    touchEvent?: ClickAwayTouchEvent;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    onClickAway,
    enabled = true,
    mouseEvent = "click",
    touchEvent = "touchend",
    class: className = "",
    children,
    ...rest
  }: Props = $props();
</script>

<div
  use:clickAway={{ enabled, onClickAway, mouseEvent, touchEvent }}
  class={cn("contents", className)}
  {...rest}
>
  {@render children?.()}
</div>
