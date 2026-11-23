import { getContext, setContext } from "svelte";
import type {
  CoimTreeItemData,
  CoimTreeReorderDetail,
  CoimTreeReorderPosition,
} from "./types.js";

const TREE_VIEW_KEY = Symbol("coim-tree-view");
const TREE_DEPTH_KEY = Symbol("coim-tree-depth");

export interface TreeViewContextValue {
  readonly multiSelect: boolean;
  readonly checkboxSelection: boolean;
  readonly reorderable: boolean;
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
  getDraggingId(): string | null;
  setDraggingId(id: string | null): void;
  moveItem(sourceId: string, targetId: string, position: CoimTreeReorderPosition): void;
  reorderByOffset(itemId: string, offset: -1 | 1): void;
}

function containsDescendant(node: CoimTreeItemData, targetId: string): boolean {
  if (!node.children) return false;
  for (const child of node.children) {
    if (child.id === targetId || containsDescendant(child, targetId)) return true;
  }
  return false;
}

function findNode(items: CoimTreeItemData[], id: string): CoimTreeItemData | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findNode(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

function removeNode(
  items: CoimTreeItemData[],
  sourceId: string,
): { removed: CoimTreeItemData | null; next: CoimTreeItemData[] } {
  let removed: CoimTreeItemData | null = null;
  const next: CoimTreeItemData[] = [];
  for (const item of items) {
    if (item.id === sourceId) {
      removed = item;
      continue;
    }
    if (item.children && item.children.length > 0) {
      const childRes = removeNode(item.children, sourceId);
      if (childRes.removed) {
        removed = childRes.removed;
        next.push({ ...item, children: childRes.next });
        continue;
      }
    }
    next.push(item);
  }
  return { removed, next };
}

function insertNode(
  items: CoimTreeItemData[],
  node: CoimTreeItemData,
  targetId: string,
  position: CoimTreeReorderPosition,
): { inserted: boolean; next: CoimTreeItemData[] } {
  let inserted = false;
  const next: CoimTreeItemData[] = [];

  for (const item of items) {
    if (item.id === targetId) {
      inserted = true;
      if (position === "before") {
        next.push(node, item);
      } else if (position === "after") {
        next.push(item, node);
      } else {
        const nextChildren = [...(item.children ?? []), node];
        next.push({ ...item, children: nextChildren });
      }
      continue;
    }

    if (!inserted && item.children && item.children.length > 0) {
      const childRes = insertNode(item.children, node, targetId, position);
      if (childRes.inserted) {
        inserted = true;
        next.push({ ...item, children: childRes.next });
        continue;
      }
    }
    next.push(item);
  }

  return { inserted, next };
}

/** Immutably moves `sourceId` relative to `targetId` (`before` | `after` | `inside`), guarding cycles. */
export function reorderTreeItems(
  items: CoimTreeItemData[],
  sourceId: string,
  targetId: string,
  position: CoimTreeReorderPosition,
): CoimTreeItemData[] {
  if (!sourceId || !targetId || sourceId === targetId) return items;
  const sourceNode = findNode(items, sourceId);
  if (!sourceNode || containsDescendant(sourceNode, targetId)) return items;

  const { removed, next: stripped } = removeNode(items, sourceId);
  if (!removed) return items;

  const { inserted, next } = insertNode(stripped, removed, targetId, position);
  return inserted ? next : items;
}

/** Moves an item one slot up or down among its immediate sibling nodes. */
export function moveTreeItemSibling(
  items: CoimTreeItemData[],
  itemId: string,
  offset: -1 | 1,
): { nextItems: CoimTreeItemData[]; detail: CoimTreeReorderDetail } | null {
  const directIdx = items.findIndex((item) => item.id === itemId);
  if (directIdx >= 0) {
    const targetIdx = directIdx + offset;
    if (targetIdx < 0 || targetIdx >= items.length) return null;
    const target = items[targetIdx];
    const position: CoimTreeReorderPosition = offset < 0 ? "before" : "after";
    const nextItems = reorderTreeItems(items, itemId, target.id, position);
    return { nextItems, detail: { itemId, targetId: target.id, position } };
  }

  for (let i = 0; i < items.length; i += 1) {
    const child = items[i];
    if (!child.children || child.children.length === 0) continue;
    const sub = moveTreeItemSibling(child.children, itemId, offset);
    if (sub) {
      const nextItems = items.map((entry, idx) =>
        idx === i ? { ...entry, children: sub.nextItems } : entry,
      );
      return { nextItems, detail: sub.detail };
    }
  }

  return null;
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
