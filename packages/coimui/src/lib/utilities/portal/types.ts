export type PortalContainer =
  | HTMLElement
  | string
  | null
  | undefined
  | (() => HTMLElement | null | undefined);
