import { getContext, setContext } from "svelte";
import type { ImageListVariant } from "./types.js";

export interface ImageListContext {
  variant: () => ImageListVariant;
  cols: () => number;
  gap: () => string;
  rowHeight: () => number | "auto";
}

const IMAGE_LIST_CONTEXT_KEY = Symbol("coimui-image-list-context");

export function setImageListContext(ctx: ImageListContext): ImageListContext {
  setContext(IMAGE_LIST_CONTEXT_KEY, ctx);
  return ctx;
}

export function getImageListContext(): ImageListContext | undefined {
  try {
    return getContext<ImageListContext | undefined>(IMAGE_LIST_CONTEXT_KEY);
  } catch {
    return undefined;
  }
}
