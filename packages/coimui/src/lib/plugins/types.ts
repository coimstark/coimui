import type { Snippet } from "svelte";

export interface CoimLightboxImage {
  src: string;
  thumbnailSrc?: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
}

export interface CoimCarouselItem {
  id: string;
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  content?: Snippet;
}

export interface CoimVideoSource {
  src: string;
  type?: string;
}

export interface CoimCalendarEvent {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
  allDay?: boolean;
  backgroundColor?: string;
  extendedProps?: Record<string, unknown>;
}

export interface CoimSortableItem {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface CoimSortableListProps<Item extends CoimSortableItem = CoimSortableItem> {
  items: Item[];
  ariaLabel?: string;
  onReorder?: (items: Item[]) => void;
  itemContent?: Snippet<[Item, number]>;
  class?: string;
}

export interface CoimEmojiSelectDetail {
  unicode: string;
  name?: string;
}

export interface CoimPrintOptions {
  title?: string;
  styles?: string;
}
