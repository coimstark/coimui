<script lang="ts">
  import MenuLevelView from "#lib/components/MenuLevelView.svelte";
</script>

<svelte:head><title>CoimUI Showcase — Menu Level 2</title></svelte:head>

<MenuLevelView
  depth={2}
  title="Menu Levels — Level 2"
  currentPath="/menu-levels/level-two"
  breadcrumbs={[{ label: "Menu Levels", href: "/menu-levels" }, { label: "Level 2" }]}
/>
