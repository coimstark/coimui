export type CoimVideoProvider = "auto" | "html5" | "youtube" | "vimeo";

export interface CoimResolvedVideoEmbed {
  kind: "youtube" | "vimeo";
  embedUrl: string;
}

/** Resolves a YouTube or Vimeo watch/share URL into a safe embed URL, or returns null for HTML5 playback. */
export function resolveVideoEmbed(
  src: string | undefined,
  provider: CoimVideoProvider = "auto",
): CoimResolvedVideoEmbed | null {
  if (!src || provider === "html5") return null;

  let parsed: URL;
  try {
    parsed = new URL(src, "https://coimui.invalid");
  } catch {
    return null;
  }

  const host = parsed.hostname.toLowerCase();

  if (provider === "auto" || provider === "youtube") {
    let ytId: string | null = null;
    if (host === "youtu.be") {
      ytId = parsed.pathname.split("/").filter(Boolean)[0] ?? null;
    } else if (host === "youtube.com" || host === "www.youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname.startsWith("/embed/")) {
        ytId = parsed.pathname.split("/").filter(Boolean)[1] ?? null;
      } else if (parsed.pathname === "/watch") {
        ytId = parsed.searchParams.get("v");
      } else if (parsed.pathname.startsWith("/shorts/")) {
        ytId = parsed.pathname.split("/").filter(Boolean)[1] ?? null;
      }
    }
    if (ytId && /^[A-Za-z0-9_-]{6,20}$/.test(ytId)) {
      return {
        kind: "youtube",
        embedUrl: `https://www.youtube.com/embed/${ytId}`,
      };
    }
  }

  if (provider === "auto" || provider === "vimeo") {
    let vimeoId: string | null = null;
    if (host === "vimeo.com" || host === "www.vimeo.com") {
      vimeoId = parsed.pathname.split("/").filter(Boolean)[0] ?? null;
    } else if (host === "player.vimeo.com") {
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts[0] === "video") vimeoId = parts[1] ?? null;
    }
    if (vimeoId && /^\d{4,14}$/.test(vimeoId)) {
      return {
        kind: "vimeo",
        embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      };
    }
  }

  return null;
}
