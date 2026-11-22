<script lang="ts">
  import { onMount, untrack, type Snippet } from "svelte";
  import { COIM_SCREENS } from "../utilities/screen.svelte.js";
  import { ThemeState, setThemeContext } from "./theme-state.svelte.js";
  import type { Direction, ThemeConfigDefaults } from "./types.js";

  interface Props {
    defaults?: Partial<ThemeConfigDefaults>;
    storagePrefix?: string;
    persist?: boolean;
    direction?: Direction;
    children?: Snippet;
  }

  let {
    defaults,
    storagePrefix = "coimui",
    persist = true,
    direction,
    children,
  }: Props = $props();

  const themeState = setThemeContext(
    untrack(
      () =>
        new ThemeState({
          defaults,
          storagePrefix,
          persist,
          direction,
        }),
    ),
  );

  $effect(() => {
    if (direction !== undefined) {
      themeState.setDirection(direction);
    }
  });

  onMount(() => {
    themeState.hydrateFromBrowser();
    themeState.syncDocumentClasses();

    const colorMql =
      typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;

    const bp = COIM_SCREENS[themeState.defaults.menuPrimaryBreakpoint];
    const bpMql =
      typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia(`(min-width: ${bp})`)
        : null;

    const onColorChange = (e: MediaQueryListEvent) => {
      themeState.systemPrefersDark = e.matches;
      themeState.syncDocumentClasses();
    };

    const onBpChange = (e: MediaQueryListEvent) => {
      themeState.isMobile = !e.matches;
    };

    colorMql?.addEventListener("change", onColorChange);
    bpMql?.addEventListener("change", onBpChange);

    const timer = window.setTimeout(() => {
      document.documentElement.style.setProperty(
        "--layout-duration",
        `${themeState.defaults.transitionDuration}ms`,
      );
    }, 200);

    return () => {
      colorMql?.removeEventListener("change", onColorChange);
      bpMql?.removeEventListener("change", onBpChange);
      window.clearTimeout(timer);
    };
  });

  $effect(() => {
    void themeState.theme;
    void themeState.resolvedMode;
    void themeState.elevation;
    void themeState.direction;
    themeState.syncDocumentClasses();
  });
</script>

{@render children?.()}
