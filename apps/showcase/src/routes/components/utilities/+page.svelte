<script lang="ts">
  import {
    COIM_SCREENS,
    CoimBreadcrumbs,
    CoimButton,
    CoimChip,
    CoimClickAwayListener,
    CoimCollapse,
    CoimFade,
    CoimFormControlLabel,
    CoimGrow,
    CoimPaper,
    CoimPortal,
    CoimSelect,
    CoimSlide,
    CoimStack,
    CoimSwitch,
    CoimTypography,
    CoimZoom,
    cn,
    createBreakpointState,
    createMediaQueryState,
    currencyFormatter,
    isPathMatch,
  } from "@coimui/svelte";
  import { createZodValidator } from "@coimui/svelte/forms";
  import ComponentDocCard from "#lib/components/ComponentDocCard.svelte";
  import type { ComponentApiGroup } from "#lib/components/doc-types.ts";

  const END_SCRIPT = "</" + "script>";

  // Interactive Transitions Playground state
  let visible = $state(true);
  let timeout = $state(250);
  let collapseOrientation = $state<"vertical" | "horizontal">("vertical");
  let slideDirection = $state<"up" | "down" | "left" | "right">("up");

  const transitionsCode = $derived(`<script lang="ts">
  import { CoimButton, CoimCollapse, CoimFade, CoimGrow, CoimSlide, CoimZoom } from "@coimui/svelte";
  let visible = $state(${visible});
${END_SCRIPT}

<CoimButton size="small" variant="contained" onclick={() => (visible = !visible)}>
  Toggle Transitions
</CoimButton>

<CoimCollapse in={visible} timeout={${timeout}} orientation="${collapseOrientation}">
  <div class="rounded-md border p-3">CoimCollapse content</div>
</CoimCollapse>
<CoimFade in={visible} timeout={${timeout}}><div>CoimFade</div></CoimFade>
<CoimGrow in={visible} timeout={${timeout}}><div>CoimGrow</div></CoimGrow>
<CoimZoom in={visible} timeout={${timeout}}><div>CoimZoom</div></CoimZoom>
<CoimSlide in={visible} direction="${slideDirection}" timeout={${timeout}}>
  <div>CoimSlide</div>
</CoimSlide>`);

  const transitionApiGroups: ComponentApiGroup[] = [
    {
      title: "CoimFade / CoimGrow / CoimZoom",
      props: [
        { name: "in", type: "boolean", defaultValue: "false", kind: "bindable", description: "Controls enter/exit transition visibility." },
        { name: "timeout", type: "number | { enter?: number; exit?: number }", defaultValue: "225", description: "Duration in ms for enter and exit transitions." },
        { name: "mountOnEnter", type: "boolean", defaultValue: "false", description: "Delays mounting child DOM until first open." },
        { name: "unmountOnExit", type: "boolean", defaultValue: "false", description: "Unmounts child DOM after exit finishes." },
        { name: "children", type: "Snippet", kind: "snippet", description: "Element(s) wrapped by the transition container." },
      ],
    },
    {
      title: "CoimCollapse & CoimSlide",
      props: [
        { name: "timeout (CoimCollapse)", type: "number | { enter?: number; exit?: number }", defaultValue: "250", description: "Collapse transition duration in ms." },
        { name: "orientation (CoimCollapse)", type: "\"vertical\" | \"horizontal\"", defaultValue: "\"vertical\"", description: "Axis along which height or width collapses." },
        { name: "collapsedSize (CoimCollapse)", type: "number | string", defaultValue: "0", description: "Remaining size when collapsed (e.g. \"40px\")." },
        { name: "direction (CoimSlide)", type: "\"up\" | \"down\" | \"left\" | \"right\"", defaultValue: "\"down\"", description: "Edge direction from which content slides into view." },
      ],
    },
  ];

  // ClickAwayListener interactive demo
  let clickAwayEnabled = $state(true);
  let insideClicks = $state(0);
  let awayClicks = $state(0);

  const clickAwayCode = $derived(`<script lang="ts">
  import { CoimClickAwayListener, CoimPaper } from "@coimui/svelte";
  let count = $state(0);
${END_SCRIPT}

<CoimClickAwayListener enabled={${clickAwayEnabled}} onClickAway={() => count++}>
  <CoimPaper class="p-4">Clicks outside this surface: {count}</CoimPaper>
</CoimClickAwayListener>`);

  const clickAwayProps = [
    { name: "onClickAway", type: "(event: Event) => void", kind: "event" as const, description: "Fires when a click/touch occurs outside the wrapped subtree." },
    { name: "enabled", type: "boolean", defaultValue: "true", description: "Temporarily disables outside-click detection when false." },
    { name: "mouseEvent", type: "\"click\" | \"mousedown\" | \"mouseup\" | false", defaultValue: "\"click\"", description: "Mouse event used to detect outside interaction." },
    { name: "touchEvent", type: "\"touchend\" | \"touchstart\" | false", defaultValue: "\"touchend\"", description: "Touch event used to detect outside interaction." },
  ];

  // Portal interactive demo
  let portalDisabled = $state(false);
  let portalMountCount = $state(1);

  const portalCode = $derived(`<script lang="ts">
  import { CoimPortal } from "@coimui/svelte";
${END_SCRIPT}

<div id="portal-target" class="rounded-md border border-dashed p-3"></div>

<CoimPortal container="#portal-target" disablePortal={${portalDisabled}}>
  <span>Rendered via CoimPortal (${portalDisabled ? "inline" : "teleported"})</span>
</CoimPortal>`);

  const portalProps = [
    { name: "container", type: "HTMLElement | string | (() => HTMLElement | null) | null", defaultValue: "document.body", description: "DOM element, selector string, or getter returning the portal host." },
    { name: "disablePortal", type: "boolean", defaultValue: "false", description: "Renders children inline in the current parent DOM node instead of teleporting." },
    { name: "children", type: "Snippet", kind: "snippet" as const, description: "Content teleported into the resolved container." },
  ];

  // Reactive breakpoint & helper demos
  const isDesktop = createBreakpointState("md");
  const prefersReducedMotion = createMediaQueryState("(prefers-reduced-motion: reduce)");

  const helpersCode = `import {
  cn,
  isPathMatch,
  currencyFormatter,
  COIM_SCREENS,
  createBreakpointState,
  createMediaQueryState,
} from "@coimui/svelte";
import { createZodValidator } from "@coimui/svelte/forms";

const classes = cn("px-4 py-2", isActive && "bg-primary text-primary-contrast");
const formatted = currencyFormatter.format(2490); // "$2,490.00"
const active = isPathMatch("/components/utilities", "/components"); // true
const isDesktop = createBreakpointState("md"); // Reactive { matches: boolean }
const validator = createZodValidator(myZodOrStandardSchema);`;

  const helperSummaryProps = [
    { name: "cn(...inputs)", type: "(...ClassValue[]) => string", description: "clsx + custom tailwind-merge supporting CoimUI shadows & line-clamp utilities." },
    { name: "isPathMatch(path, href)", type: "(string, string) => boolean", description: "Segment-aware route prefix matching used by sidebar navigation items." },
    { name: "currencyFormatter", type: "Intl.NumberFormat", description: "Preconfigured USD currency formatter ($1,234.00)." },
    { name: "createBreakpointState(bp)", type: "(ScreenBreakpoint) => { matches: boolean }", description: "Svelte 5 $state/$effect media query listener for COIM_SCREENS (sm..3xl)." },
    { name: "createMediaQueryState(q)", type: "(string) => { matches: boolean }", description: "Reactive CSS media-query observer returning { matches }." },
    { name: "createZodValidator(schema)", type: "(Zod | StandardSchema) => CoimValidator", description: "Schema-agnostic validator returning flat field errors (no extra runtime dependency)." },
  ];

  void COIM_SCREENS;
  void createZodValidator;
</script>

<svelte:head><title>CoimUI Showcase — Utilities &amp; Transitions</title></svelte:head>

<CoimStack spacing={5}>
  <div>
    <CoimBreadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "UI Components", href: "/components" },
        { label: "Utilities & Transitions" },
      ]}
    />
    <CoimTypography variant="h1" class="mt-2">Utilities &amp; Transitions</CoimTypography>
    <p class="text-text-secondary mt-1">
      CSS-free transition primitives, Portal &amp; ClickAwayListener helpers, and reactive Svelte 5 media/validation utilities.
    </p>
  </div>

  <ComponentDocCard
    id="coim-transitions"
    title="Transition Primitives (Collapse, Fade, Grow, Slide, Zoom)"
    description="Composable Svelte 5 enter/exit transitions with optional mountOnEnter and unmountOnExit."
    code={transitionsCode}
    apiGroups={transitionApiGroups}
  >
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div class="border-grey-100 rounded-md border p-3">
        <span class="text-text-secondary mb-2 block text-xs font-semibold">CoimCollapse</span>
        <CoimCollapse in={visible} {timeout} orientation={collapseOrientation}>
          <CoimPaper class="bg-primary-light/10 p-3 text-sm font-medium">Collapsed Body</CoimPaper>
        </CoimCollapse>
      </div>
      <div class="border-grey-100 rounded-md border p-3">
        <span class="text-text-secondary mb-2 block text-xs font-semibold">CoimFade</span>
        <CoimFade in={visible} {timeout}>
          <CoimPaper class="bg-secondary-light/10 p-3 text-sm font-medium">Fade Opacity</CoimPaper>
        </CoimFade>
      </div>
      <div class="border-grey-100 rounded-md border p-3">
        <span class="text-text-secondary mb-2 block text-xs font-semibold">CoimGrow</span>
        <CoimGrow in={visible} {timeout}>
          <CoimPaper class="bg-success-light/10 p-3 text-sm font-medium">Scale + Fade</CoimPaper>
        </CoimGrow>
      </div>
      <div class="border-grey-100 rounded-md border p-3">
        <span class="text-text-secondary mb-2 block text-xs font-semibold">CoimZoom</span>
        <CoimZoom in={visible} {timeout}>
          <CoimPaper class="bg-info-light/10 p-3 text-sm font-medium">Zoom Pop</CoimPaper>
        </CoimZoom>
      </div>
      <div class="border-grey-100 overflow-hidden rounded-md border p-3">
        <span class="text-text-secondary mb-2 block text-xs font-semibold">CoimSlide</span>
        <CoimSlide in={visible} direction={slideDirection} {timeout}>
          <CoimPaper class="bg-warning-light/10 p-3 text-sm font-medium">Slide ({slideDirection})</CoimPaper>
        </CoimSlide>
      </div>
    </div>

    {#snippet controls()}
      <div class="flex flex-wrap items-center gap-3">
        <CoimFormControlLabel label="Show / In">
          <CoimSwitch bind:checked={visible} />
        </CoimFormControlLabel>
        <CoimSelect
          label="Timeout (ms)"
          size="small"
          value={String(timeout)}
          onValueChange={(v) => {
            if (typeof v === "string") timeout = Number(v);
          }}
          options={[
            { value: "150", label: "150ms" },
            { value: "250", label: "250ms" },
            { value: "500", label: "500ms" },
          ]}
        />
        <CoimSelect
          label="Collapse Axis"
          size="small"
          value={collapseOrientation}
          onValueChange={(v) => {
            if (v === "vertical" || v === "horizontal") collapseOrientation = v;
          }}
          options={[
            { value: "vertical", label: "vertical" },
            { value: "horizontal", label: "horizontal" },
          ]}
        />
        <CoimSelect
          label="Slide Direction"
          size="small"
          value={slideDirection}
          onValueChange={(v) => {
            if (v === "up" || v === "down" || v === "left" || v === "right") slideDirection = v;
          }}
          options={[
            { value: "up", label: "up" },
            { value: "down", label: "down" },
            { value: "left", label: "left" },
            { value: "right", label: "right" },
          ]}
        />
      </div>
    {/snippet}
  </ComponentDocCard>

  <ComponentDocCard
    id="coim-click-away"
    title="CoimClickAwayListener"
    description="Detects clicks or touches outside a child subtree for menus, inline editors, and custom overlays."
    code={clickAwayCode}
    propsDocs={clickAwayProps}
  >
    <div class="flex flex-wrap items-center gap-4">
      <CoimClickAwayListener enabled={clickAwayEnabled} onClickAway={() => (awayClicks += 1)}>
        <button
          type="button"
          onclick={() => (insideClicks += 1)}
          class={cn(
            "border-primary bg-primary-light/10 text-text-primary cursor-pointer rounded-lg border px-4 py-3 text-sm font-medium",
          )}
        >
          Click inside ({insideClicks}) or click anywhere outside ({awayClicks})
        </button>
      </CoimClickAwayListener>
    </div>

    {#snippet controls()}
      <div class="flex flex-wrap items-center gap-3">
        <CoimFormControlLabel label="Listener Enabled">
          <CoimSwitch bind:checked={clickAwayEnabled} />
        </CoimFormControlLabel>
        <CoimButton
          size="small"
          variant="outlined"
          onclick={() => {
            insideClicks = 0;
            awayClicks = 0;
          }}
        >
          Reset Counters
        </CoimButton>
      </div>
    {/snippet}
  </ComponentDocCard>

  <ComponentDocCard
    id="coim-portal"
    title="CoimPortal"
    description="Teleports DOM content into document.body or any target container selector/element."
    code={portalCode}
    propsDocs={portalProps}
  >
    <div class="grid gap-4 md:grid-cols-2">
      <div class="border-grey-100 rounded-md border p-3">
        <span class="text-text-secondary mb-2 block text-xs font-semibold">Origin Parent</span>
        <CoimPortal container="#utilities-portal-host" disablePortal={portalDisabled}>
          <CoimChip
            label={`Portal Payload #${portalMountCount} (${portalDisabled ? "Inline" : "Teleported"})`}
            color={portalDisabled ? "secondary" : "primary"}
            variant="pastel"
            size="small"
          />
        </CoimPortal>
      </div>
      <div id="utilities-portal-host" class="border-primary/40 rounded-md border border-dashed p-3">
        <span class="text-text-secondary mb-2 block text-xs font-semibold">Target Container (#utilities-portal-host)</span>
      </div>
    </div>

    {#snippet controls()}
      <div class="flex flex-wrap items-center gap-3">
        <CoimFormControlLabel label="disablePortal (Render Inline)">
          <CoimSwitch bind:checked={portalDisabled} />
        </CoimFormControlLabel>
        <CoimButton size="small" variant="outlined" onclick={() => (portalMountCount += 1)}>
          Update Payload (#{portalMountCount})
        </CoimButton>
      </div>
    {/snippet}
  </ComponentDocCard>

  <ComponentDocCard
    id="coim-helpers"
    title="Class, Formatting, Screen &amp; Zod Validation Helpers"
    description="Type-safe Tailwind v4 class merging, route matching, currency formatting, reactive media states, and Zod 4 validation adapter."
    packageEntry="@coimui/svelte + /forms"
    code={helpersCode}
    propsDocs={helperSummaryProps}
  >
    <div class="flex flex-wrap gap-2">
      <CoimChip label={`isDesktop (>= md): ${isDesktop.matches}`} size="small" color="primary" variant="pastel" />
      <CoimChip label={`Reduced Motion: ${prefersReducedMotion.matches}`} size="small" variant="outlined" />
      <CoimChip label={`currencyFormatter: ${currencyFormatter.format(2490)}`} size="small" color="success" variant="pastel" />
      <CoimChip label={`isPathMatch("/components/utilities", "/components"): ${isPathMatch("/components/utilities", "/components")}`} size="small" variant="outlined" />
    </div>
  </ComponentDocCard>
</CoimStack>
