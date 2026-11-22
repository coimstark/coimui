<script lang="ts">
  import type { Snippet } from "svelte";
  import { CoimPortal } from "../../utilities/portal/index.js";
  import { cn } from "../../utilities/utils.js";
  import type { PopperPlacement, PopperVirtualElement } from "./types.js";

  interface Props {
    open?: boolean;
    anchorEl?: HTMLElement | PopperVirtualElement | null;
    placement?: PopperPlacement;
    offset?: number;
    disablePortal?: boolean;
    keepMounted?: boolean;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    open = false,
    anchorEl = null,
    placement = "bottom",
    offset = 6,
    disablePortal = false,
    keepMounted = false,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  let popperEl = $state<HTMLDivElement | null>(null);
  let posX = $state(0);
  let posY = $state(0);

  function computePosition() {
    if (typeof window === "undefined" || !open || !anchorEl || !popperEl) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const popperRect = popperEl.getBoundingClientRect();
    const isRtl =
      typeof document !== "undefined" &&
      (document.documentElement.dir === "rtl" ||
        getComputedStyle(document.documentElement).direction === "rtl");

    const [baseSide, align] = placement.split("-") as [
      "top" | "bottom" | "left" | "right",
      "start" | "end" | undefined,
    ];

    let x = anchorRect.left;
    let y = anchorRect.bottom + offset;

    if (baseSide === "top") {
      y = anchorRect.top - popperRect.height - offset;
    } else if (baseSide === "bottom") {
      y = anchorRect.bottom + offset;
    } else if (baseSide === "left") {
      x = anchorRect.left - popperRect.width - offset;
    } else if (baseSide === "right") {
      x = anchorRect.right + offset;
    }

    if (baseSide === "top" || baseSide === "bottom") {
      if (align === "start") {
        x = isRtl ? anchorRect.right - popperRect.width : anchorRect.left;
      } else if (align === "end") {
        x = isRtl ? anchorRect.left : anchorRect.right - popperRect.width;
      } else {
        x = anchorRect.left + (anchorRect.width - popperRect.width) / 2;
      }
    } else {
      if (align === "start") {
        y = anchorRect.top;
      } else if (align === "end") {
        y = anchorRect.bottom - popperRect.height;
      } else {
        y = anchorRect.top + (anchorRect.height - popperRect.height) / 2;
      }
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (vw > 0 && popperRect.width > 0) {
      x = Math.max(4, Math.min(x, vw - popperRect.width - 4));
    }
    if (vh > 0 && popperRect.height > 0) {
      y = Math.max(4, Math.min(y, vh - popperRect.height - 4));
    }

    posX = Math.round(x);
    posY = Math.round(y);
  }

  $effect(() => {
    if (typeof window === "undefined") return;
    if (!open || !anchorEl || !popperEl) return;

    computePosition();

    const handleUpdate = () => computePosition();
    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, true);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(handleUpdate);
      observer.observe(popperEl);
      if (anchorEl instanceof Element) {
        observer.observe(anchorEl);
      }
    }

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate, true);
      observer?.disconnect();
    };
  });
</script>

{#if open || keepMounted}
  <CoimPortal {disablePortal}>
    <div
      bind:this={popperEl}
      data-coim-popper="true"
      data-placement={placement}
      data-state={open ? "open" : "closed"}
      hidden={!open}
      aria-hidden={!open ? "true" : undefined}
      style:position="fixed"
      style:left="{posX}px"
      style:top="{posY}px"
      class={cn(
        "coim-popper bg-background-paper border-grey-100 text-text-primary shadow-darker-sm z-50 rounded-lg border border-solid p-4",
        !open && "hidden",
        className,
      )}
      {...rest}
    >
      {@render children?.()}
    </div>
  </CoimPortal>
{/if}
