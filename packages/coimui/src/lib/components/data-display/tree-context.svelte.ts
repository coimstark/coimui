import { getContext, setContext } from "svelte";

const TREE_VIEW_KEY = Symbol("coim-tree-view");
const TREE_DEPTH_KEY = Symbol("coim-tree-depth");

export interface TreeViewContextValue {
  readonly multiSelect: boolean;
  readonly checkboxSelection: boolean;
  readonly expansionTrigger: "content" | "iconContainer";
  readonly focusedId: string | null;
  getRootEl(): HTMLUListElement | null;
  isExpanded(id: string): boolean;
  isSelected(id: string): boolean;
  isFocusable(id: string, firstEligibleFallback: () => boolean): boolean;
  setFocusedId(id: string | null): void;
  toggleExpanded(id: string, event?: Event): void;
  setExpanded(id: string, nextExpanded: boolean, event?: Event): void;
  selectItem(id: string, event?: Event, options?: { toggle?: boolean }): void;
  notifyItemClick(event: Event, id: string): void;
  notifyLabelChange(id: string, label: string): void;
}

export function setTreeViewContext(ctx: TreeViewContextValue): TreeViewContextValue {
  return setContext(TREE_VIEW_KEY, ctx);
}

export function getTreeViewContext(): TreeViewContextValue {
  const ctx = getContext<TreeViewContextValue | undefined>(TREE_VIEW_KEY);
  if (!ctx) {
    throw new Error("CoimTreeItem must be rendered inside CoimSimpleTreeView or CoimRichTreeView.");
  }
  return ctx;
}

export function setTreeDepthContext(depth: number): number {
  return setContext(TREE_DEPTH_KEY, depth);
}

export function getTreeDepthContext(): number {
  return getContext<number | undefined>(TREE_DEPTH_KEY) ?? 0;
}
