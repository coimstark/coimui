<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "class" | "children"> {
    ariaLabel?: string;
    ariaLabelledBy?: string;
    class?: string;
    children?: Snippet;
  }

  let {
    ariaLabel,
    ariaLabelledBy,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  const resolvedLabelledBy = $derived(
    ariaLabelledBy ?? (rest["aria-labelledby"] as string | undefined),
  );
  const resolvedLabel = $derived(
    resolvedLabelledBy
      ? undefined
      : (ariaLabel ?? (rest["aria-label"] as string | undefined) ?? "Table"),
  );
</script>

<!-- Scrollable region requires tabindex="0" for keyboard-only scrolling access -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  {...rest}
  role="region"
  tabindex={0}
  aria-label={resolvedLabel}
  aria-labelledby={resolvedLabelledBy}
  class={cn("coim-table-container w-full overflow-auto", className)}
>
  {@render children?.()}
</div>
