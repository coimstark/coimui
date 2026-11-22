import { describe, expect, it } from "vitest";
import { render } from "svelte/server";
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
} from "./index.js";

describe("Plugins SSR Safety", () => {
  it("renders all plugins cleanly on server and strips XSS in SSR markdown", () => {
    const md = render(CoimMarkdown, {
      props: { content: "# Doc\n\n<script>evil()</script><a href=\"javascript:alert(1)\">Click</a>" },
    }).body;
    expect(md).toContain("Doc");
    expect(md).not.toContain("<script>");
    expect(md).not.toContain("javascript:");

    expect(render(CoimCodeBlock, { props: { code: "const x = 1;" } }).body).toContain("hljs");
    expect(render(CoimCarousel, { props: { items: [{ id: "1", title: "S1" }] } }).body).toContain("S1");
    expect(render(CoimLightbox, { props: { images: [{ src: "/a.jpg", width: 100, height: 100, alt: "Alt" }] } }).body).toContain("coim-lightbox-grid");
    expect(render(CoimEmojiPicker).body).toContain("coim-emoji-picker");
    expect(render(CoimRichTextEditor, { props: { value: "<p>SSR</p>" } }).body).toContain("coim-rich-editor");
    expect(render(CoimVideoPlayer, { props: { src: "/v.mp4" } }).body).toContain("<video");
    expect(render(CoimEventCalendar, { props: { events: [{ id: "1", title: "Event", start: "2026-04-15", end: "2026-04-16" }] } }).body).toContain("Event");
    expect(render(CoimSortableList, { props: { items: [{ id: "1", label: "Item 1" }] } }).body).toContain("Item 1");
  });
});
