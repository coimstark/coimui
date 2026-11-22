import { getContext, setContext } from "svelte";
import type { CoimColor } from "../../theme/types.js";
import type { CoimStepperOrientation, CoimTabsSize } from "./types.js";

const BOTTOM_NAV_KEY = Symbol("coim-bottom-navigation");
const STEPPER_KEY = Symbol("coim-stepper");
const STEP_KEY = Symbol("coim-step");
const TABS_KEY = Symbol("coim-tabs");
const SPEED_DIAL_KEY = Symbol("coim-speed-dial");

export interface BottomNavigationContextValue {
  readonly value: string | number;
  readonly showLabels: boolean;
  select(nextValue: string | number, event: Event): void;
  assignIndex(): number;
}

export interface StepperContextValue {
  readonly activeStep: number;
  readonly orientation: CoimStepperOrientation;
  readonly alternativeLabel: boolean;
  readonly nonLinear: boolean;
  assignIndex(): number;
  selectStep(index: number): void;
}

export interface StepContextValue {
  readonly index: number;
  readonly active: boolean;
  readonly completed: boolean;
  readonly disabled: boolean;
}

export interface TabsContextValue {
  readonly color: CoimColor;
  readonly size: CoimTabsSize;
  readonly hairline: boolean;
}

export interface SpeedDialContextValue {
  close(): void;
}

export function setBottomNavigationContext(
  ctx: BottomNavigationContextValue,
): BottomNavigationContextValue {
  return setContext(BOTTOM_NAV_KEY, ctx);
}

export function getBottomNavigationContext(): BottomNavigationContextValue {
  const ctx = getContext<BottomNavigationContextValue | undefined>(BOTTOM_NAV_KEY);
  if (!ctx) {
    throw new Error("CoimBottomNavigationAction must be inside CoimBottomNavigation.");
  }
  return ctx;
}

export function setStepperContext(ctx: StepperContextValue): StepperContextValue {
  return setContext(STEPPER_KEY, ctx);
}

export function getStepperContext(): StepperContextValue {
  const ctx = getContext<StepperContextValue | undefined>(STEPPER_KEY);
  if (!ctx) {
    throw new Error("CoimStep must be rendered inside CoimStepper.");
  }
  return ctx;
}

export function setStepContext(ctx: StepContextValue): StepContextValue {
  return setContext(STEP_KEY, ctx);
}

export function tryGetStepContext(): StepContextValue | undefined {
  return getContext<StepContextValue | undefined>(STEP_KEY);
}

export function setTabsContext(ctx: TabsContextValue): TabsContextValue {
  return setContext(TABS_KEY, ctx);
}

export function tryGetTabsContext(): TabsContextValue | undefined {
  return getContext<TabsContextValue | undefined>(TABS_KEY);
}

export function setSpeedDialContext(ctx: SpeedDialContextValue): SpeedDialContextValue {
  return setContext(SPEED_DIAL_KEY, ctx);
}

export function tryGetSpeedDialContext(): SpeedDialContextValue | undefined {
  return getContext<SpeedDialContextValue | undefined>(SPEED_DIAL_KEY);
}
