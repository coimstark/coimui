<script lang="ts">
  import { cn } from "../utilities/utils.js";

  interface Props {
    value?: string;
    placeholder?: string;
    readOnly?: boolean;
    toolbar?: "minimal" | "standard" | "full";
    ariaLabel?: string;
    onValueChange?: (html: string, text: string) => void;
    class?: string;
  }

  let {
    value = $bindable(""),
    placeholder = "Write something...",
    readOnly = false,
    toolbar = "standard",
    ariaLabel = "Rich text editor",
    onValueChange,
    class: className = "",
  }: Props = $props();

  let editorEl = $state<HTMLDivElement | null>(null);
  let quillRef: {
    root: HTMLElement;
    getText: () => string;
    enable: (enabled: boolean) => void;
    clipboard: { dangerouslyPasteHTML: (html: string) => void };
  } | null = null;

  const toolbarOptions = $derived(
    toolbar === "minimal"
      ? [["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }]]
      : toolbar === "full"
        ? [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block", "link"],
            ["clean"],
          ]
        : [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "clean"],
          ],
  );

  $effect(() => {
    if (typeof window === "undefined" || !editorEl) return;
    let cancelled = false;
    let container: HTMLDivElement | null = null;

    void (async () => {
      await import("quill/dist/quill.snow.css");
      const { default: Quill } = await import("quill");
      if (cancelled || !editorEl) return;

      editorEl.innerHTML = "";
      container = document.createElement("div");
      editorEl.appendChild(container);

      const instance = new Quill(container, {
        theme: "snow",
        placeholder,
        readOnly,
        modules: {
          toolbar: readOnly ? false : toolbarOptions,
        },
      });

      if (value) {
        instance.clipboard.dangerouslyPasteHTML(value);
      }

      instance.on("text-change", () => {
        const html = instance.root.innerHTML;
        value = html;
        onValueChange?.(html, instance.getText());
      });

      quillRef = instance;
    })();

    return () => {
      cancelled = true;
      quillRef = null;
      if (editorEl) editorEl.innerHTML = "";
    };
  });

  $effect(() => {
    if (!quillRef) return;
    quillRef.enable(!readOnly);
  });

  $effect(() => {
    if (!quillRef) return;
    if (value !== quillRef.root.innerHTML) {
      quillRef.clipboard.dangerouslyPasteHTML(value || "");
    }
  });
</script>

<div class={cn("coim-rich-editor", className)} role="region" aria-label={ariaLabel}>
  <div bind:this={editorEl}>
    <noscript>
      <div class="p-3 text-sm">{value}</div>
    </noscript>
  </div>
</div>
