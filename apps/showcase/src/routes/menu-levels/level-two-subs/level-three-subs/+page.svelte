<script lang="ts">
  import MenuLevelView from "#lib/components/MenuLevelView.svelte";
</script>

<svelte:head><title>CoimUI Showcase — Menu Level 3 (With Subs)</title></svelte:head>

<MenuLevelView
  depth={3}
  title="Menu Levels — Level 3 (With Sub-levels)"
  currentPath="/menu-levels/level-two-subs/level-three-subs"
  breadcrumbs={[
    { label: "Menu Levels", href: "/menu-levels" },
    { label: "Level 2 Subs", href: "/menu-levels/level-two-subs" },
    { label: "Level 3 Subs" },
  ]}
/>
