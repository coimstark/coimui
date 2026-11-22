<script lang="ts">
  import { getLayoutContext } from "./layout-state.svelte.js";

  const layout = getLayoutContext();

  function handleDismiss() {
    if (layout.temporaryShowPrimaryMenu) {
      layout.setTemporaryShowPrimaryMenu(false);
      layout.resetLeftMenu();
    }
    if (layout.leftShowBackdrop) {
      layout.resetLeftMenu();
    }
  }
</script>

{#if layout.leftShowBackdrop || layout.temporaryShowPrimaryMenu}
  <div
    class="fixed inset-0 z-5 bg-transparent"
    aria-hidden="true"
    onclick={handleDismiss}
  ></div>
{/if}
