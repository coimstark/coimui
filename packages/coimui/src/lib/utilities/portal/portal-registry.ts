const portalOriginMap = new WeakMap<HTMLElement, Node>();

export function registerPortalOrigin(portalEl: HTMLElement, originNode: Node): void {
  portalOriginMap.set(portalEl, originNode);
}

export function unregisterPortalOrigin(portalEl: HTMLElement): void {
  portalOriginMap.delete(portalEl);
}

export function isInsidePortaledDescendant(container: Node, target: Node): boolean {
  let current: Node | null = target;

  while (current) {
    if (current instanceof HTMLElement && current.hasAttribute("data-coim-portal")) {
      const origin = portalOriginMap.get(current);
      if (origin) {
        if (container === origin || container.contains(origin)) {
          return true;
        }
        return isInsidePortaledDescendant(container, origin);
      }
    }
    current = current.parentNode;
  }

  return false;
}
