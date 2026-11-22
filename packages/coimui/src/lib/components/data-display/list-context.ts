import { getContext, hasContext, setContext } from "svelte";

export interface ListContextValue {
  readonly dense: boolean;
}

const LIST_CONTEXT_KEY = Symbol("coim-list");

export function setListContext(value: ListContextValue): ListContextValue {
  return setContext(LIST_CONTEXT_KEY, value);
}

export function tryGetListContext(): ListContextValue | undefined {
  if (!hasContext(LIST_CONTEXT_KEY)) {
    return undefined;
  }
  return getContext<ListContextValue>(LIST_CONTEXT_KEY);
}
