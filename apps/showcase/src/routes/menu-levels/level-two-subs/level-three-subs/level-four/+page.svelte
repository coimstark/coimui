<script lang="ts">
  import MenuLevelView from "#lib/components/MenuLevelView.svelte";
</script>

<svelte:head><title>CoimUI Showcase — Menu Level 4</title></svelte:head>

<MenuLevelView
  depth={4}
  title="Menu Levels — Level 4"
  currentPath="/menu-levels/level-two-subs/level-three-subs/level-four"
  breadcrumbs={[
    { label: "Menu Levels", href: "/menu-levels" },
    { label: "Level 3 Subs", href: "/menu-levels/level-two-subs/level-three-subs" },
    { label: "Level 4" },
  ]}
/>
