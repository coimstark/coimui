<script lang="ts">
  import { untrack, type Snippet } from "svelte";
  import { CoimPortal } from "../../utilities/portal/index.js";
  import { cn } from "../../utilities/utils.js";
  import CoimSnackbar from "./CoimSnackbar.svelte";
  import { ToastState, setToastContext, toast } from "./toast-state.svelte.js";
  import type { ToastAnchorOrigin, ToastItem } from "./types.js";

  interface Props {
    state?: ToastState;
    maxStack?: number;
    autoHideDuration?: number | null;
    anchorOrigin?: ToastAnchorOrigin;
    disablePortal?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    state: providedState,
    maxStack = 4,
    autoHideDuration = 5000,
    anchorOrigin = { vertical: "bottom", horizontal: "right" },
    disablePortal = false,
    class: className = "",
    children,
  }: Props = $props();

  const activeState = untrack(() => providedState ?? toast);
  setToastContext(activeState);

  $effect(() => {
    activeState.configure({ maxStack, autoHideDuration, anchorOrigin });
  });

  type OriginKey =
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

  const originClasses: Record<OriginKey, string> = {
    "top-left": "top-6 inset-s-6 items-start",
    "top-center": "top-6 left-1/2 -translate-x-1/2 items-center",
    "top-right": "top-6 inset-e-6 items-end",
    "bottom-left": "bottom-6 inset-s-6 items-start",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2 items-center",
    "bottom-right": "bottom-6 inset-e-6 items-end",
  };

  const groupedItems = $derived.by(() => {
    const groups = new Map<OriginKey, ToastItem[]>();
    for (const item of activeState.items) {
      const key = `${item.anchorOrigin.vertical}-${item.anchorOrigin.horizontal}` as OriginKey;
      const list = groups.get(key);
      if (list) {
        list.push(item);
      } else {
        groups.set(key, [item]);
      }
    }
    return Array.from(groups.entries());
  });
</script>

{@render children?.()}

{#if activeState.items.length > 0}
  <CoimPortal {disablePortal}>
    {#each groupedItems as [originKey, items] (originKey)}
      <div
        data-coim-toast-region={originKey}
        class={cn(
          "pointer-events-none fixed z-120 flex max-w-[calc(100vw-2rem)] flex-col gap-2",
          originClasses[originKey],
          className,
        )}
      >
        {#each items as item (item.id)}
          <CoimSnackbar
            inline
            open={true}
            message={item.message}
            title={item.title}
            description={item.description}
            variant={item.variant}
            anchorOrigin={item.anchorOrigin}
            closable={item.closable}
            actionLabel={item.action?.label}
            onAction={item.action ? () => item.action?.onClick(item.id) : undefined}
            onClose={() => activeState.dismiss(item.id)}
          />
        {/each}
      </div>
    {/each}
  </CoimPortal>
{/if}
