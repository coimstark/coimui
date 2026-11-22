import type { CoimPrintOptions } from "./types.js";

export function printElement(
  target: HTMLElement | null | undefined,
  options: CoimPrintOptions = {},
): boolean {
  if (typeof window === "undefined" || typeof document === "undefined" || !target) {
    return false;
  }

  const title = (options.title ?? "Print").replace(/[<>&]/g, "");
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    return false;
  }

  doc.open();
  doc.write(
    `<!doctype html><html><head><title>${title}</title><style>${options.styles ?? "body{font-family:sans-serif;padding:24px;}"}</style></head><body>${target.outerHTML}</body></html>`,
  );
  doc.close();

  iframe.contentWindow?.focus();
  iframe.contentWindow?.print();
  setTimeout(() => iframe.remove(), 500);
  return true;
}
