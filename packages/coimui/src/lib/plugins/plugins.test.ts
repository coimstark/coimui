import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { tick } from "svelte";
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
  resolveVideoEmbed,
  type CoimSortableItem,
} from "./index.js";

describe("Plugins Subpath", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });

  it("renders CoimMarkdown with strict XSS stripping and CoimCodeBlock with syntax highlighting", () => {
    const md = render(CoimMarkdown, {
      props: {
        content: "# Release\n\n<script>alert('xss')</script><img src=x onerror=\"alert(1)\" /> [Safe](https://coimui.dev)",
      },
    });
    expect(md.getByRole("heading", { name: "Release" })).toBeInTheDocument();
    expect(md.container.querySelector("script")).toBeNull();
    expect(md.container.innerHTML).not.toContain("onerror");
    md.unmount();

    const code = render(CoimCodeBlock, {
      props: {
        code: "export const greeting = 'CoimUI';",
        language: "typescript",
        filename: "example.ts",
        showLineNumbers: true,
      },
    });
    expect(code.getByText("example.ts")).toBeInTheDocument();
    expect(code.container.querySelector(".hljs-keyword")).toBeInTheDocument();
  });

  it("supports CoimSortableList keyboard/button reordering and live region announcements", async () => {
    const onReorder = vi.fn();
    const initial: CoimSortableItem[] = [
      { id: "a", label: "First Task" },
      { id: "b", label: "Second Task" },
    ];
    const view = render(CoimSortableList, {
      props: { items: initial, onReorder },
    });
    await tick();

    await fireEvent.click(view.getByRole("button", { name: "Move Second Task up" }));
    await tick();
    expect(onReorder).toHaveBeenCalledWith([
      { id: "b", label: "Second Task" },
      { id: "a", label: "First Task" },
    ]);
    expect(view.getByText(/Moved Second Task to position 1 of 2/)).toBeInTheDocument();
  });

  it("renders Carousel, Lightbox, EmojiPicker, RichTextEditor, VideoPlayer, EventCalendar, and printElement", async () => {
    const onEmoji = vi.fn();
    const emoji = render(CoimEmojiPicker, { props: { onSelect: onEmoji } });
    await fireEvent.click(emoji.getByRole("button", { name: "🚀" }));
    expect(onEmoji).toHaveBeenCalledWith({ unicode: "🚀" });
    emoji.unmount();

    const car = render(CoimCarousel, {
      props: { items: [{ id: "1", title: "Slide One", subtitle: "Fast UI" }] },
    });
    expect(car.getByText("Slide One")).toBeInTheDocument();
    car.unmount();

    const lb = render(CoimLightbox, {
      props: {
        images: [{ src: "/a.jpg", width: 800, height: 600, alt: "Sample Photo" }],
      },
    });
    expect(lb.getByRole("link", { name: "Sample Photo" })).toHaveAttribute("data-pswp-width", "800");
    lb.unmount();

    const rte = render(CoimRichTextEditor, { props: { value: "<p>Hello</p>" } });
    expect(rte.getByRole("region", { name: "Rich text editor" })).toBeInTheDocument();
    rte.unmount();

    const vp = render(CoimVideoPlayer, {
      props: { src: "/demo.mp4", poster: "/poster.jpg" },
    });
    expect(vp.container.querySelector("video")).toHaveAttribute("poster", "/poster.jpg");
    vp.unmount();

    const ec = render(CoimEventCalendar, {
      props: {
        events: [
          {
            id: "e1",
            title: "Sprint Review",
            start: "2026-04-15T10:00:00",
            end: "2026-04-15T11:00:00",
          },
        ],
      },
    });
    expect(ec.getByRole("region", { name: "Event calendar" })).toBeInTheDocument();

    const div = document.createElement("div");
    div.textContent = "Printable";
    expect(printElement(div, { title: "Invoice" })).toBe(true);
    ec.unmount();

    // YouTube & Vimeo embed resolution and Bubble rich text editor theme
    expect(resolveVideoEmbed("https://youtu.be/dQw4w9WgXcQ")).toEqual({
      kind: "youtube",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    });
    expect(resolveVideoEmbed("https://vimeo.com/76979871")).toEqual({
      kind: "vimeo",
      embedUrl: "https://player.vimeo.com/video/76979871",
    });

    const yt = render(CoimVideoPlayer, {
      props: { src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", ariaLabel: "YouTube demo" },
    });
    const ytFrame = yt.getByTitle("YouTube demo");
    expect(ytFrame.tagName).toBe("IFRAME");
    expect(ytFrame).toHaveAttribute("src", "https://www.youtube.com/embed/dQw4w9WgXcQ");
    yt.unmount();

    const bubbleRte = render(CoimRichTextEditor, {
      props: { theme: "bubble", variant: "outlined", value: "<p>Bubble</p>", ariaLabel: "Bubble editor" },
    });
    expect(bubbleRte.getByRole("region", { name: "Bubble editor" })).toHaveAttribute("data-theme", "bubble");
  });
});
