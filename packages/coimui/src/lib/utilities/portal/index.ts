export { default as CoimPortal } from "./CoimPortal.svelte";
export type { PortalContainer } from "./types.js";
export {
  registerPortalOrigin,
  unregisterPortalOrigin,
  isInsidePortaledDescendant,
} from "./portal-registry.js";
