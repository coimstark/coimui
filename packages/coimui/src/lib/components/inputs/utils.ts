import type {
  CoimAutocompleteOptionItem,
  CoimDropzoneAccept,
  CoimDropzoneError,
  CoimHighlightPart,
  CoimMaskOptions,
  CoimNormalizedOption,
} from "./types.js";

const DEFAULT_MASK_DEFINITIONS: Record<string, RegExp> = {
  "0": /\d/,
  "#": /[1-9]/,
  a: /[A-Za-z]/,
  "*": /[A-Za-z0-9]/,
};

/**
 * Formats an input string against a pattern mask (e.g. `"(000) 000-0000"`,
 * `"00/00/0000"`, `"0000 0000 0000 0000"`, or `"currency"`).
 */
export function applyInputMask(raw: string, mask: string | CoimMaskOptions): string {
  const opts: CoimMaskOptions = typeof mask === "string" ? { pattern: mask } : mask;

  if (opts.pattern === "currency") {
    return formatCurrencyMask(raw, opts.currencyPrefix ?? "$", opts.decimals ?? 2);
  }

  const defs = { ...DEFAULT_MASK_DEFINITIONS, ...(opts.definitions ?? {}) };
  const pattern = opts.pattern;

  let result = "";
  let rawIdx = 0;

  for (let pIdx = 0; pIdx < pattern.length && rawIdx < raw.length; pIdx++) {
    const token = pattern[pIdx];
    const matcher = defs[token];

    if (!matcher) {
      if (raw[rawIdx] === token) {
        rawIdx++;
      }
      result += token;
      continue;
    }

    let matched = false;
    while (rawIdx < raw.length) {
      const ch = raw[rawIdx++];
      if (matcher.test(ch)) {
        result += ch;
        matched = true;
        break;
      }
    }
    if (!matched) break;
  }

  return result;
}

function formatCurrencyMask(raw: string, prefix: string, decimals: number): string {
  const cleaned = raw.replace(/[^\d.]/g, "");
  if (!cleaned) return "";

  const parts = cleaned.split(".");
  const intPartRaw = parts[0] ?? "";
  const decPartRaw = parts.slice(1).join("");
  const hasDot = cleaned.includes(".");

  const normalizedInt = intPartRaw.replace(/^0+(?=\d)/, "") || "0";
  const formattedInt = normalizedInt.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (hasDot && decimals > 0) {
    return `${prefix}${formattedInt}.${decPartRaw.slice(0, decimals)}`;
  }
  return `${prefix}${formattedInt}`;
}

/**
 * Finds `[start, end)` character match ranges for `query` within `text`.
 * Mirrors `autosuggest-highlight/match`.
 */
export function matchHighlights(
  text: string,
  query: string,
  options: { insideWords?: boolean } = {},
): [number, number][] {
  const trimmed = query.trim();
  if (!trimmed || !text) return [];

  const lowerText = text.toLowerCase();
  const tokens = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
  const ranges: [number, number][] = [];

  for (const token of tokens) {
    let searchFrom = 0;
    while (searchFrom < lowerText.length) {
      const idx = lowerText.indexOf(token, searchFrom);
      if (idx === -1) break;

      if (options.insideWords || idx === 0 || /[\s\-_/.(,[]/.test(lowerText[idx - 1])) {
        ranges.push([idx, idx + token.length]);
      }
      searchFrom = idx + token.length;
    }
  }

  if (ranges.length === 0) return [];
  ranges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  const merged: [number, number][] = [ranges[0]];
  for (let i = 1; i < ranges.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = ranges[i];
    if (curr[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], curr[1]);
    } else {
      merged.push(curr);
    }
  }

  return merged;
}

/**
 * Splits `text` into highlighted and plain segments for `matchHighlights` output.
 * Mirrors `autosuggest-highlight/parse`.
 */
export function parseHighlights(text: string, matches: [number, number][]): CoimHighlightPart[] {
  if (!text) return [];
  if (matches.length === 0) return [{ text, highlight: false }];

  const parts: CoimHighlightPart[] = [];
  let cursor = 0;

  for (const [start, end] of matches) {
    if (start > cursor) {
      parts.push({ text: text.slice(cursor, start), highlight: false });
    }
    if (end > start) {
      parts.push({ text: text.slice(start, end), highlight: true });
    }
    cursor = Math.max(cursor, end);
  }

  if (cursor < text.length) {
    parts.push({ text: text.slice(cursor), highlight: false });
  }

  return parts;
}

export function normalizeAutocompleteOption(item: CoimAutocompleteOptionItem): CoimNormalizedOption {
  if (typeof item === "string") {
    return { value: item, label: item };
  }
  return {
    value: String(item.value),
    label: item.label,
    disabled: item.disabled,
    group: item.group,
    description: item.description,
  };
}

export function toAcceptAttribute(accept?: CoimDropzoneAccept): string | undefined {
  if (!accept) return undefined;
  if (typeof accept === "string") return accept;
  if (Array.isArray(accept)) return accept.join(",");
  const tokens: string[] = [];
  for (const [mime, exts] of Object.entries(accept)) {
    if (exts.length > 0) {
      tokens.push(...exts);
    } else {
      tokens.push(mime);
    }
  }
  return tokens.join(",");
}

export function matchesAccept(file: File, accept?: CoimDropzoneAccept): boolean {
  if (!accept) return true;

  const patterns: string[] = [];
  if (typeof accept === "string") {
    patterns.push(...accept.split(",").map((s) => s.trim()).filter(Boolean));
  } else if (Array.isArray(accept)) {
    patterns.push(...accept.map((s) => s.trim()).filter(Boolean));
  } else {
    for (const [mime, exts] of Object.entries(accept)) {
      patterns.push(mime.trim());
      for (const ext of exts) patterns.push(ext.trim());
    }
  }

  if (patterns.length === 0) return true;

  const fileName = file.name.toLowerCase();
  const mimeType = (file.type || "").toLowerCase();

  return patterns.some((pattern) => {
    const p = pattern.toLowerCase();
    if (p === "*/*") return true;
    if (p.startsWith(".")) {
      return fileName.endsWith(p);
    }
    if (p.endsWith("/*")) {
      const prefix = p.slice(0, -1);
      return mimeType.startsWith(prefix);
    }
    return mimeType === p;
  });
}

export function validateDropzoneFile(
  file: File,
  opts: { accept?: CoimDropzoneAccept; minSize?: number; maxSize?: number },
): CoimDropzoneError[] {
  const errors: CoimDropzoneError[] = [];

  if (!matchesAccept(file, opts.accept)) {
    errors.push({
      code: "file-invalid-type",
      message: `File "${file.name}" has an unsupported file type.`,
    });
  }

  if (opts.minSize !== undefined && file.size < opts.minSize) {
    errors.push({
      code: "file-too-small",
      message: `File "${file.name}" is smaller than ${opts.minSize} bytes.`,
    });
  }

  if (opts.maxSize !== undefined && file.size > opts.maxSize) {
    errors.push({
      code: "file-too-large",
      message: `File "${file.name}" exceeds maximum size of ${opts.maxSize} bytes.`,
    });
  }

  return errors;
}
