<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import CiChevronRightSmall from "../icons/ui/CiChevronRightSmall.svelte";
  import { cn } from "../utilities/utils.js";
  import type { CoimVersionOption } from "./types.js";

  interface Props {
    versions?: CoimVersionOption[];
    selectedVersion?: string;
    onSelectVersion?: (version: string) => void;
    class?: string;
  }

  const defaultVersions: CoimVersionOption[] = [
    { label: "CoimUI v1.0.0" },
    { label: "CoimUI Starter v1.0" },
    { label: "CoimUI Docs v1.0" },
  ];

  let {
    versions = defaultVersions,
    selectedVersion = $bindable("CoimUI v1.0.0"),
    onSelectVersion,
    class: className = "",
  }: Props = $props();

  let open = $state(false);

  function selectVersion(label: string) {
    selectedVersion = label;
    open = false;
    onSelectVersion?.(label);
  }
</script>

<DropdownMenu.Root bind:open>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <button
        {...props}
        type="button"
        class={cn(
          "border-grey-200 text-text-primary hover:bg-grey-200/10 hover:text-text-primary-dark font-body inline-flex max-w-30 cursor-pointer items-center gap-1 rounded-md border border-solid bg-transparent px-4 py-[calc(0.5rem-1px)] text-base leading-5 font-medium transition-all sm:max-w-none",
          className,
        )}
      >
        <span class="w-full truncate text-clip">{selectedVersion}</span>
        <CiChevronRightSmall
          size="medium"
          class={cn(
            "-ms-1 shrink-0 transition-transform rtl:rotate-180",
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
      class="bg-background-paper shadow-darker-sm outline-grey-50 z-100 mt-1 min-w-36 rounded-lg px-2 py-2 outline-1"
    >
      {#each versions as item (item.label)}
        <DropdownMenu.Item
          onSelect={() => selectVersion(item.label)}
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
