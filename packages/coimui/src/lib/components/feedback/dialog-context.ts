import { getContext, setContext } from "svelte";

const DIALOG_CONTEXT_KEY = Symbol("coimui-dialog-context");

export interface DialogContextValue {
  readonly defaultTitleId: string;
  readonly defaultDescriptionId: string;
  registerTitle: (id: string) => () => void;
  registerDescription: (id: string) => () => void;
}

export function setDialogContext(value: DialogContextValue): DialogContextValue {
  return setContext(DIALOG_CONTEXT_KEY, value);
}

export function tryGetDialogContext(): DialogContextValue | undefined {
  return getContext<DialogContextValue | undefined>(DIALOG_CONTEXT_KEY);
}
