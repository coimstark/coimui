<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import CiChevronRightSmall from "../icons/ui/CiChevronRightSmall.svelte";
  import { cn } from "../utilities/utils.js";
  import type { CoimVersionOption } from "./types.js";

  interface Props {
    versions?: CoimVersionOption[];
    selectedVersion?: string;
    onSelectVersion?: (version: string) => void;
    onNavigate?: (href: string) => void;
    class?: string;
  }

  const defaultVersions: CoimVersionOption[] = [
    { label: "CoimUI v1.0.0", href: "/" },
    { label: "Components", href: "/components" },
    { label: "Documentation", href: "/docs" },
  ];

  let {
    versions = defaultVersions,
    selectedVersion = $bindable("CoimUI v1.0.0"),
    onSelectVersion,
    onNavigate,
    class: className = "",
  }: Props = $props();

  let open = $state(false);

  function selectVersion(item: CoimVersionOption) {
    selectedVersion = item.label;
    open = false;
    onSelectVersion?.(item.label);
    if (item.href) {
      onNavigate?.(item.href);
    }
  }
</script>

<DropdownMenu.Root bind:open>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <button
        {...props}
        type="button"
        class={cn(
          "border-grey-200 text-text-primary hover:bg-grey-200/10 hover:text-text-primary-dark font-body inline-flex max-w-36 cursor-pointer items-center gap-1 rounded-full border border-solid bg-transparent px-3.5 py-1.5 text-xs leading-4 font-medium whitespace-nowrap transition-all sm:max-w-none sm:text-sm",
          className,
        )}
      >
        <span class="truncate">{selectedVersion}</span>
        <CiChevronRightSmall
          size="small"
          class={cn(
            "shrink-0 transition-transform rtl:rotate-180",
            open && "rotate-90 rtl:rotate-90",
          )}
        />
      </button>
    {/snippet}
  </DropdownMenu.Trigger>

  <DropdownMenu.Portal>
    <DropdownMenu.Content
      align="start"
      sideOffset={6}
      class="bg-background-paper shadow-darker-sm outline-grey-50 z-100 mt-1 min-w-40 rounded-lg px-2 py-2 outline-1"
    >
      {#each versions as item (item.label)}
        <DropdownMenu.Item
          onSelect={() => selectVersion(item)}
          class={cn(
            "font-body text-text-primary hover:bg-grey-500/10 my-0.5 flex cursor-pointer items-center rounded-sm px-4 py-2 text-base leading-5 font-medium transition-colors outline-none",
            item.label === selectedVersion && "bg-grey-500/15 text-primary",
          )}
        >
          {item.label}
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
