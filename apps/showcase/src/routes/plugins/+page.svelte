<script lang="ts">
  import {
    COIMUI_VERSION,
    CoimBreadcrumbs,
    CoimButton,
    CoimGrid,
    CoimPaper,
    CoimStack,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import {
    CoimCarousel,
    CoimCodeBlock,
    CoimEmojiPicker,
    CoimEventCalendar,
    CoimLightbox,
    CoimMarkdown,
    CoimRichTextEditor,
    CoimSortableList,
    CoimVideoPlayer,
    printElement,
    type CoimCalendarEvent,
    type CoimSortableItem,
  } from "@coimui/svelte/plugins";
  import ComponentDocCard from "#lib/components/ComponentDocCard.svelte";
  import type { ComponentApiGroup } from "#lib/components/doc-types.ts";
  import { COMPONENT_CODE_EXAMPLES } from "#lib/examples/component-docs.ts";

  let htmlNotes = $state(`<p>CoimUI <strong>v${COIMUI_VERSION}</strong> ships isolated rich-text, media, and calendar plugins.</p>`);
  let editorTheme = $state<"snow" | "bubble">("snow");
  let chosenEmoji = $state("🚀");
  let printSectionEl = $state<HTMLElement | null>(null);

  let backlog = $state<CoimSortableItem[]>([
    { id: "t-1", label: "Verify external consumer minimal bundle", description: "Priority P0" },
    { id: "t-2", label: "Execute axe-core WCAG 2.1 AA audit", description: "Priority P0" },
    { id: "t-3", label: `Verify release tag v${COIMUI_VERSION}`, description: "Priority P1" },
  ]);

  const slides = [
    { id: "s1", title: "Workspace Overview", subtitle: "Adaptive telemetry dashboard", imageSrc: "/images/misc/screen-1.jpg", imageAlt: "Workspace analytics preview" },
    { id: "s2", title: "Modular Themes", subtitle: "Four accent presets & RTL", imageSrc: "/images/misc/screen-2.jpg", imageAlt: "Modular theme preview" },
  ];

  const gallery = [
    { src: "/images/products/product-1.jpg", width: 800, height: 600, alt: "Audio Hardware Kit", caption: "Audio Hardware" },
    { src: "/images/products/product-2.jpg", width: 800, height: 600, alt: "Desk Lamp Series", caption: "Lighting" },
    { src: "/images/products/product-3.jpg", width: 800, height: 600, alt: "Ceramic Studio Set", caption: "Workspace" },
  ];

  const calendarEvents: CoimCalendarEvent[] = [
    { id: "e1", title: "Design Token Review", start: "2026-11-22T10:00:00", end: "2026-11-22T11:30:00" },
    { id: "e2", title: `CoimUI v${COIMUI_VERSION} Release Freeze`, start: "2026-11-24T14:00:00", end: "2026-11-24T16:00:00" },
  ];

  const editorMarkdownApi: ComponentApiGroup[] = [
    {
      title: "CoimRichTextEditor, CoimMarkdown & CoimCodeBlock",
      props: [
        { name: "CoimRichTextEditor", type: "value (bindable), theme?: \"snow\" | \"bubble\", toolbar?: \"minimal\" | \"standard\" | \"full\", variant?", kind: "bindable", description: "Client-guarded Quill v2 editor emitting HTML and plain text." },
        { name: "CoimMarkdown", type: "content: string, sanitize?: boolean", description: "Marked parser sanitized with DOMPurify before DOM injection." },
        { name: "CoimCodeBlock", type: "code, language?, filename?, showLineNumbers?, copyable?", description: "Syntax-highlighted viewer with copy-to-clipboard button." },
        { name: "printElement(el, opts?)", type: "(HTMLElement, PrintOptions?) => void", description: "Prints an isolated DOM section cleanly." },
      ],
    },
  ];

  const mediaWidgetsApi: ComponentApiGroup[] = [
    {
      title: "Media & Interactive Plugin Components",
      props: [
        { name: "CoimCarousel", type: "items: CarouselSlide[], ariaLabel?", description: "Swiper-backed responsive slide carousel." },
        { name: "CoimLightbox", type: "images: LightboxImage[], showDownload?, showCaptions?", description: "PhotoSwipe image grid with fullscreen zoom viewer." },
        { name: "CoimEmojiPicker / VideoPlayer", type: "onSelect(ev) / src, poster?, ariaLabel?", description: "Web-component emoji selector and HTML5 video wrapper." },
        { name: "CoimSortableList / EventCalendar", type: "items (bindable), onReorder? / events, date?, onEventClick?", kind: "bindable", description: "Drag/keyboard sortable items and full schedule calendar." },
      ],
    },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Plugins</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Plugins" }]} />
    <CoimTypography variant="h1" class="mt-2">Plugin Ecosystem</CoimTypography>
    <p class="text-text-secondary mt-1">
      Client-guarded optional integrations for rich text, carousels, lightboxes, emoji picking, markdown, syntax highlighting, video, scheduling, print, and drag-and-drop.
    </p>
  </div>

  <CoimTypography variant="h2">Rich Editing, Media &amp; Scheduling</CoimTypography>

  <ComponentDocCard
    title="RichTextEditor, Markdown, CodeBlock &amp; Print"
    description="Quill editor, DOMPurify-sanitized Marked renderer, highlight.js code viewer, and DOM print utility."
    packageEntry="@coimui/svelte/plugins"
    code={COMPONENT_CODE_EXAMPLES.plugins}
    apiGroups={editorMarkdownApi}
  >
    <CoimGrid container spacing={4}>
      <CoimGrid size={{ xs: 12, lg: 6 }}>
        <CoimStack spacing={2}>
          <div class="flex items-center justify-between gap-2">
            <span class="text-text-secondary text-xs font-medium">Theme: {editorTheme}</span>
            <div class="flex gap-1.5">
              <CoimButton
                size="tiny"
                variant={editorTheme === "snow" ? "contained" : "outlined"}
                onclick={() => (editorTheme = "snow")}
              >
                Snow
              </CoimButton>
              <CoimButton
                size="tiny"
                variant={editorTheme === "bubble" ? "contained" : "outlined"}
                onclick={() => (editorTheme = "bubble")}
              >
                Bubble
              </CoimButton>
            </div>
          </div>
          {#key editorTheme}
            <CoimRichTextEditor
              bind:value={htmlNotes}
              theme={editorTheme}
              variant="outlined"
              ariaLabel="Release notes editor"
            />
          {/key}
        </CoimStack>
      </CoimGrid>
      <CoimGrid size={{ xs: 12, lg: 6 }}>
        <div bind:this={printSectionEl} class="border-grey-100 rounded-xl border p-4">
          <div class="mb-2 flex items-center justify-between gap-2">
            <span class="font-semibold">Markdown &amp; Print Snapshot</span>
            <CoimButton
              size="small"
              variant="outlined"
              onclick={() => {
                if (printSectionEl) printElement(printSectionEl, { title: "CoimUI Notes" });
              }}
            >
              Print Snippet
            </CoimButton>
          </div>
          <CoimMarkdown content={"### Release Checklist\n- **Core package**: Clean\n- **TS 7 checks**: Passing\n\n`bun add @coimui/svelte`"} />
        </div>
      </CoimGrid>
      <CoimGrid size={12}>
        <CoimCodeBlock
          language="typescript"
          filename="coimui.config.ts"
          code={`import { THEME_OPTIONS } from "@coimui/svelte";\nexport const defaultTheme = THEME_OPTIONS.PURPLE;`}
        />
      </CoimGrid>
    </CoimGrid>
  </ComponentDocCard>

  <ComponentDocCard
    title="Carousel, Lightbox, EmojiPicker, VideoPlayer, SortableList &amp; EventCalendar"
    description="Lazy-hydrated rich widgets that keep SSR deterministic."
    packageEntry="@coimui/svelte/plugins"
    code={COMPONENT_CODE_EXAMPLES.plugins}
    apiGroups={mediaWidgetsApi}
  >
    <CoimGrid container spacing={4}>
      <CoimGrid size={{ xs: 12, lg: 6 }}>
        <CoimCarousel items={slides} ariaLabel="Showcase slides" />
      </CoimGrid>
      <CoimGrid size={{ xs: 12, lg: 6 }}>
        <CoimLightbox images={gallery} showDownload showCaptions />
      </CoimGrid>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimStack spacing={3}>
          <CoimPaper variant="outlined" class="p-4">
            <p class="mb-2 text-sm font-medium">Selected Reaction: {chosenEmoji}</p>
            <CoimEmojiPicker onSelect={(ev) => (chosenEmoji = ev.unicode)} />
          </CoimPaper>
          <CoimSortableList
            bind:items={backlog}
            ariaLabel="Prioritized backlog"
            onReorder={() => toast.info("Order updated")}
          />
        </CoimStack>
      </CoimGrid>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimVideoPlayer
          src="/videos/products/product-1.mp4"
          poster="/images/misc/video-poster-light.svg"
          ariaLabel="Demo overview player"
        />
      </CoimGrid>
      <CoimGrid size={12}>
        <CoimEventCalendar
          events={calendarEvents}
          date="2026-11-22"
          onEventClick={(id) => toast.info(`Selected event ${id}`)}
        />
      </CoimGrid>
    </CoimGrid>
  </ComponentDocCard>
</CoimStack>
