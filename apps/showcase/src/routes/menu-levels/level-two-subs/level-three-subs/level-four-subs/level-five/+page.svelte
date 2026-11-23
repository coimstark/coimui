<script lang="ts">
  import MenuLevelView from "#lib/components/MenuLevelView.svelte";
</script>

<svelte:head><title>CoimUI Showcase — Menu Level 5</title></svelte:head>

<MenuLevelView
  depth={5}
  title="Menu Levels — Level 5 (Leaf Route)"
  currentPath="/menu-levels/level-two-subs/level-three-subs/level-four-subs/level-five"
  breadcrumbs={[
    { label: "Menu Levels", href: "/menu-levels" },
    { label: "Level 4 Subs", href: "/menu-levels/level-two-subs/level-three-subs/level-four-subs" },
    { label: "Level 5" },
  ]}
/>
