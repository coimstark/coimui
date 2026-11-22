import { getContext, setContext } from "svelte";
import type {
  ToastAnchorOrigin,
  ToastItem,
  ToastOptions,
  ToastVariant,
} from "./types.js";

const TOAST_CONTEXT_KEY = Symbol("coimui-toast-context");

export interface ToastProviderConfig {
  maxStack?: number;
  autoHideDuration?: number | null;
  anchorOrigin?: ToastAnchorOrigin;
}

let toastSequence = 0;

function generateToastId(): string {
  toastSequence += 1;
  return `coim-toast-${toastSequence}`;
}

export class ToastState {
  items = $state<ToastItem[]>([]);
  maxStack = $state<number>(4);
  defaultAutoHideDuration = $state<number | null>(5000);
  defaultAnchorOrigin = $state<ToastAnchorOrigin>({
    vertical: "bottom",
    horizontal: "right",
  });

  #timers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor(config: ToastProviderConfig = {}) {
    this.configure(config);
  }

  configure(config: ToastProviderConfig): void {
    if (typeof config.maxStack === "number" && config.maxStack >= 1) {
      this.maxStack = Math.floor(config.maxStack);
      this.#trimToMaxStack();
    }
    if (config.autoHideDuration !== undefined) {
      this.defaultAutoHideDuration = config.autoHideDuration;
    }
    if (config.anchorOrigin) {
      this.defaultAnchorOrigin = { ...config.anchorOrigin };
    }
  }

  #clearTimer(id: string): void {
    const timer = this.#timers.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      this.#timers.delete(id);
    }
  }

  #scheduleTimer(id: string, duration: number | null): void {
    this.#clearTimer(id);
    if (typeof window === "undefined") return;
    if (duration !== null && duration > 0 && Number.isFinite(duration)) {
      const timer = setTimeout(() => {
        this.#timers.delete(id);
        this.#remove(id, "timeout");
      }, duration);
      this.#timers.set(id, timer);
    }
  }

  #remove(id: string, reason: "timeout" | "dismiss" | "maxStack"): void {
    this.#clearTimer(id);
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return;
    const [removed] = this.items.splice(index, 1);
    removed?.onClose?.(reason);
  }

  #trimToMaxStack(): void {
    while (this.items.length > this.maxStack) {
      const evicted = this.items.shift();
      if (evicted) {
        this.#clearTimer(evicted.id);
        evicted.onClose?.("maxStack");
      }
    }
  }

  show(message: string, options: ToastOptions = {}): string {
    const id = options.id ?? generateToastId();
    const duration =
      options.autoHideDuration === undefined
        ? this.defaultAutoHideDuration
        : options.autoHideDuration;
    const anchorOrigin = options.anchorOrigin ?? this.defaultAnchorOrigin;
    const variant: ToastVariant = options.variant ?? "default";

    const nextItem: ToastItem = {
      id,
      message,
      title: options.title,
      description: options.description,
      variant,
      autoHideDuration: duration,
      anchorOrigin: { ...anchorOrigin },
      action: options.action,
      closable: options.closable ?? true,
      onClose: options.onClose,
      createdAt: Date.now(),
    };

    const existingIndex = this.items.findIndex((item) => item.id === id);
    if (existingIndex !== -1) {
      this.items[existingIndex] = nextItem;
    } else {
      this.items.push(nextItem);
      this.#trimToMaxStack();
    }

    this.#scheduleTimer(id, duration);
    return id;
  }

  success(message: string, options: Omit<ToastOptions, "variant"> = {}): string {
    return this.show(message, { ...options, variant: "success" });
  }

  info(message: string, options: Omit<ToastOptions, "variant"> = {}): string {
    return this.show(message, { ...options, variant: "info" });
  }

  warning(message: string, options: Omit<ToastOptions, "variant"> = {}): string {
    return this.show(message, { ...options, variant: "warning" });
  }

  error(message: string, options: Omit<ToastOptions, "variant"> = {}): string {
    return this.show(message, { ...options, variant: "error" });
  }

  dismiss(id?: string): void {
    if (id !== undefined) {
      this.#remove(id, "dismiss");
      return;
    }
    this.clear();
  }

  clear(): void {
    const existing = [...this.items];
    for (const item of existing) {
      this.#clearTimer(item.id);
    }
    this.items = [];
    for (const item of existing) {
      item.onClose?.("dismiss");
    }
  }
}

export const toast = new ToastState();

export function setToastContext(state: ToastState): ToastState {
  return setContext(TOAST_CONTEXT_KEY, state);
}

export function getToastContext(): ToastState {
  return getContext<ToastState | undefined>(TOAST_CONTEXT_KEY) ?? toast;
}

export function tryGetToastContext(): ToastState | undefined {
  return getContext<ToastState | undefined>(TOAST_CONTEXT_KEY);
}
