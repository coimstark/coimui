import { getContext, hasContext, setContext } from "svelte";

export type AvatarSize = "nano" | "tiny" | "small" | "medium" | "large";
export type AvatarVariant = "circular" | "rounded" | "square";

export interface AvatarGroupContextValue {
  readonly size: AvatarSize;
  readonly variant: AvatarVariant;
  registerIndex: () => number;
  registerMounted: (index: number) => () => void;
  isIndexVisible: (index: number) => boolean;
}

const AVATAR_GROUP_CONTEXT_KEY = Symbol("coim-avatar-group");

export function setAvatarGroupContext(value: AvatarGroupContextValue): AvatarGroupContextValue {
  return setContext(AVATAR_GROUP_CONTEXT_KEY, value);
}

export function tryGetAvatarGroupContext(): AvatarGroupContextValue | undefined {
  if (!hasContext(AVATAR_GROUP_CONTEXT_KEY)) {
    return undefined;
  }
  return getContext<AvatarGroupContextValue>(AVATAR_GROUP_CONTEXT_KEY);
}
