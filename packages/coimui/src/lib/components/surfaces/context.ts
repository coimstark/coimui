import { getContext, setContext } from "svelte";
import type { AccordionVariant } from "./types.js";

const ACCORDION_GROUP_KEY = Symbol("coim-accordion-group");

export interface AccordionGroupContext {
  readonly variant: AccordionVariant;
}

export function setAccordionGroupContext(ctx: AccordionGroupContext): AccordionGroupContext {
  return setContext(ACCORDION_GROUP_KEY, ctx);
}

export function tryGetAccordionGroupContext(): AccordionGroupContext | undefined {
  return getContext<AccordionGroupContext | undefined>(ACCORDION_GROUP_KEY);
}
