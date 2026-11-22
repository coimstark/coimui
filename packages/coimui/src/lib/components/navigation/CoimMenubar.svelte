<script lang="ts">
  import { Menubar } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../../utilities/utils.js";
  import type { CoimMenubarSection } from "./types.js";

  interface Props {
    value?: string;
    onValueChange?: (value: string) => void;
    menus?: CoimMenubarSection[];
    loop?: boolean;
    dir?: "ltr" | "rtl";
    outlined?: boolean;
    dense?: boolean;
    class?: string;
    contentClass?: string;
    children?: Snippet;
  }

  let {
    value = $bindable(""),
    onValueChange,
    menus = [],
    loop = true,
    dir = "ltr",
    outlined = false,
    dense = false,
    class: className = "",
    contentClass = "",
    children,
  }: Props = $props();
</script>

<Menubar.Root
  bind:value
  {loop}
  {dir}
  onValueChange={(next: string) => {
    value = next;
    onValueChange?.(next);
  }}
  class={cn("coim-menubar", className)}
>
  {#if menus.length > 0}
    {#each menus as section (section.value)}
      <Menubar.Menu value={section.value}>
        <Menubar.Trigger disabled={section.disabled} class="coim-menubar-trigger">
          {section.label}
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content
            sideOffset={4}
            class={cn(
              "coim-menu-paper",
              outlined && "outlined",
              dense && "coim-menu-dense",
              contentClass,
            )}
          >
            {@render section.items()}
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    {/each}
  {:else if children}
    {@render children()}
  {/if}
</Menubar.Root>
