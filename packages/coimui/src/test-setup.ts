import "@testing-library/jest-dom/vitest";

if (typeof HTMLDialogElement !== "undefined") {
  const proto = HTMLDialogElement.prototype;
  if (!proto.showModal) {
    proto.showModal = function showModal() {
      this.setAttribute("open", "");
    };
  }
  if (!proto.show) {
    proto.show = function show() {
      this.setAttribute("open", "");
    };
  }
  if (!proto.close) {
    proto.close = function close(returnValue?: string) {
      if (returnValue !== undefined) {
        this.returnValue = returnValue;
      }
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    };
  }
}

if (typeof Element !== "undefined" && typeof Element.prototype.animate !== "function") {
  Element.prototype.animate = function animate() {
    let settled = false;
    let resolveFinished!: (value: Animation) => void;
    const finished = new Promise<Animation>((resolve) => {
      resolveFinished = resolve;
    });

    const anim: Partial<Animation> = {
      onfinish: null,
      oncancel: null,
      playState: "finished",
      finished,
      cancel() {
        if (settled) return;
        settled = true;
        anim.oncancel?.call(anim as Animation, new Event("cancel") as unknown as AnimationPlaybackEvent);
        resolveFinished(anim as Animation);
      },
      finish() {
        if (settled) return;
        settled = true;
        anim.onfinish?.call(anim as Animation, new Event("finish") as unknown as AnimationPlaybackEvent);
        resolveFinished(anim as Animation);
      },
      play() {},
      pause() {},
      reverse() {},
    };

    queueMicrotask(() => {
      if (!settled) {
        anim.finish?.();
      }
    });

    return anim as Animation;
  };
}

if (typeof window !== "undefined") {
  window.scrollTo = () => {};
  if (typeof window.matchMedia !== "function") {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener() {},
        removeListener() {},
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent: () => false,
      }) as MediaQueryList;
  }
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
