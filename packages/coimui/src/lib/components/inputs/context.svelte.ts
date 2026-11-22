import { getContext, setContext } from "svelte";
import type {
  CoimButtonGroupContextValue,
  CoimControlLabelContextValue,
  CoimFormControlContextValue,
  CoimRadioGroupContextValue,
  CoimToggleGroupContextValue,
} from "./types.js";

const FORM_CONTROL_KEY = Symbol("coim-form-control");
const CONTROL_LABEL_KEY = Symbol("coim-control-label");
const BUTTON_GROUP_KEY = Symbol("coim-button-group");
const TOGGLE_GROUP_KEY = Symbol("coim-toggle-group");
const RADIO_GROUP_KEY = Symbol("coim-radio-group");

export function setFormControlContext(ctx: CoimFormControlContextValue): CoimFormControlContextValue {
  return setContext(FORM_CONTROL_KEY, ctx);
}

export function getFormControlContext(): CoimFormControlContextValue {
  const ctx = getContext<CoimFormControlContextValue | undefined>(FORM_CONTROL_KEY);
  if (!ctx) {
    throw new Error("getFormControlContext must be called within a <CoimFormControl> component.");
  }
  return ctx;
}

export function tryGetFormControlContext(): CoimFormControlContextValue | undefined {
  return getContext<CoimFormControlContextValue | undefined>(FORM_CONTROL_KEY);
}

export function setControlLabelContext(ctx: CoimControlLabelContextValue): CoimControlLabelContextValue {
  return setContext(CONTROL_LABEL_KEY, ctx);
}

export function tryGetControlLabelContext(): CoimControlLabelContextValue | undefined {
  return getContext<CoimControlLabelContextValue | undefined>(CONTROL_LABEL_KEY);
}

export function setButtonGroupContext(ctx: CoimButtonGroupContextValue): CoimButtonGroupContextValue {
  return setContext(BUTTON_GROUP_KEY, ctx);
}

export function tryGetButtonGroupContext(): CoimButtonGroupContextValue | undefined {
  return getContext<CoimButtonGroupContextValue | undefined>(BUTTON_GROUP_KEY);
}

export function setToggleGroupContext(ctx: CoimToggleGroupContextValue): CoimToggleGroupContextValue {
  return setContext(TOGGLE_GROUP_KEY, ctx);
}

export function tryGetToggleGroupContext(): CoimToggleGroupContextValue | undefined {
  return getContext<CoimToggleGroupContextValue | undefined>(TOGGLE_GROUP_KEY);
}

export function setRadioGroupContext(ctx: CoimRadioGroupContextValue): CoimRadioGroupContextValue {
  return setContext(RADIO_GROUP_KEY, ctx);
}

export function tryGetRadioGroupContext(): CoimRadioGroupContextValue | undefined {
  return getContext<CoimRadioGroupContextValue | undefined>(RADIO_GROUP_KEY);
}
