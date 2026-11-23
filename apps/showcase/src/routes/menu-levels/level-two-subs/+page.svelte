<script lang="ts">
  import MenuLevelView from "#lib/components/MenuLevelView.svelte";
</script>

<svelte:head><title>CoimUI Showcase — Menu Level 2 (With Subs)</title></svelte:head>

<MenuLevelView
  depth={2}
  title="Menu Levels — Level 2 (With Sub-levels)"
  currentPath="/menu-levels/level-two-subs"
  breadcrumbs={[{ label: "Menu Levels", href: "/menu-levels" }, { label: "Level 2 Subs" }]}
/>
