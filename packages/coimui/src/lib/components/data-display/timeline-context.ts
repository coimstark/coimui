import { getContext, setContext } from "svelte";
import type { TimelinePosition } from "./types.js";

const TIMELINE_KEY = Symbol("coim-timeline");
const TIMELINE_ITEM_KEY = Symbol("coim-timeline-item");

export interface TimelineContextValue {
  readonly position: TimelinePosition;
}

export interface TimelineItemContextValue {
  registerOppositeContent: () => () => void;
}

export function setTimelineContext(ctx: TimelineContextValue): TimelineContextValue {
  return setContext(TIMELINE_KEY, ctx);
}

export function tryGetTimelineContext(): TimelineContextValue | undefined {
  return getContext<TimelineContextValue | undefined>(TIMELINE_KEY);
}

export function setTimelineItemContext(ctx: TimelineItemContextValue): TimelineItemContextValue {
  return setContext(TIMELINE_ITEM_KEY, ctx);
}

export function tryGetTimelineItemContext(): TimelineItemContextValue | undefined {
  return getContext<TimelineItemContextValue | undefined>(TIMELINE_ITEM_KEY);
}
