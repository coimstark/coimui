<script lang="ts">
  import MenuLevelView from "#lib/components/MenuLevelView.svelte";
</script>

<svelte:head><title>CoimUI Showcase — Menu Levels</title></svelte:head>

<MenuLevelView
  depth={1}
  title="Menu Levels — Level 1"
  currentPath="/menu-levels"
  breadcrumbs={[{ label: "Pages", href: "/pages" }, { label: "Menu Levels" }]}
/>
