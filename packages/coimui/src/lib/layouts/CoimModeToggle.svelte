<script lang="ts">
  import { Tooltip } from "bits-ui";
  import CiMoon from "../icons/ui/CiMoon.svelte";
  import CiSun from "../icons/ui/CiSun.svelte";
  import { getThemeContext } from "../theme/theme-state.svelte.js";
  import { cn } from "../utilities/utils.js";

  interface Props {
    class?: string;
  }

  let { class: className = "" }: Props = $props();
  const theme = getThemeContext();

  function handleToggle() {
    theme.setMode(theme.isDarkMode ? "light" : "dark");
  }
</script>

<Tooltip.Root>
  <Tooltip.Trigger>
    {#snippet child({ props })}
      <button
        {...props}
        type="button"
        aria-label={theme.isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        onclick={handleToggle}
        class={cn(
          "icon-only hover-icon-shrink hover:bg-grey-25 text-text-primary inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent transition-all",
          theme.isTopNavContained && "hover:bg-grey-50",
          className,
        )}
      >
        {#if theme.isDarkMode}
          <CiSun size="large" class="transition-transform" />
        {:else}
          <CiMoon size="large" class="transition-transform" />
        {/if}
      </button>
    {/snippet}
  </Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content
      side="bottom"
      sideOffset={6}
      class="border-grey-200 bg-background-paper font-body text-text-primary shadow-darker-sm z-100 rounded-sm border border-solid px-3 py-1.5 text-sm font-semibold"
    >
      <Tooltip.Arrow class="text-background-paper fill-current" />
      {theme.isDarkMode ? "Light Up" : "Go Dark"}
    </Tooltip.Content>
  </Tooltip.Portal>
</Tooltip.Root>
