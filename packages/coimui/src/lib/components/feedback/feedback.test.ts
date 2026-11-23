import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { createRawSnippet, tick } from "svelte";
import {
  CoimAlert,
  CoimAlertTitle,
  CoimBackdrop,
  CoimCircularProgress,
  CoimConfirmDialog,
  CoimDialog,
  CoimDialogActions,
  CoimDialogContent,
  CoimDialogContentText,
  CoimDialogTitle,
  CoimDrawer,
  CoimLinearProgress,
  CoimModal,
  CoimPopover,
  CoimPopper,
  CoimSkeleton,
  CoimSnackbar,
  CoimToastProvider,
  ToastState,
} from "./index.js";

describe("Phase D Feedback & Overlays", () => {
  beforeEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
  });

  it("renders CoimAlert with severities, variants, neutral look, custom action, and close button", async () => {
    const onClose = vi.fn();
    const message = createRawSnippet(() => ({
      render: () => `<span>Saved successfully</span>`,
    }));

    const { getByRole, rerender } = render(CoimAlert, {
      props: {
        severity: "success",
        variant: "standard",
        onClose,
        children: message,
      },
    });

    const alert = getByRole("alert");
    expect(alert).toHaveAttribute("data-severity", "success");
    expect(alert).toHaveAttribute("data-variant", "standard");
    expect(alert.className).toContain("coim-alert-standard");
    expect(alert.querySelector("svg")).toBeTruthy();

    await fireEvent.click(getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    await rerender({
      severity: "error",
      variant: "filled",
      neutral: true,
      icon: false,
      children: message,
    });
    expect(alert).toHaveAttribute("data-severity", "error");
    expect(alert).toHaveAttribute("data-variant", "filled");
    expect(alert.className).toContain("neutral");
    expect(alert.querySelector(".coim-alert-icon")).toBeNull();

    const title = render(CoimAlertTitle, {
      props: { children: createRawSnippet(() => ({ render: () => `<span>Heads up</span>` })) },
    });
    expect(title.container.querySelector(".coim-alert-title")).toHaveTextContent("Heads up");
  });

  it("renders CoimBackdrop with open, invisible, z-40, and click handler", async () => {
    const onClick = vi.fn();
    const { container, rerender } = render(CoimBackdrop, {
      props: { open: false, onclick: onClick },
    });
    expect(container.querySelector('[data-coim-backdrop="true"]')).toBeNull();

    await rerender({ open: true, invisible: true, onclick: onClick });
    await tick();
    const backdrop = container.querySelector('[data-coim-backdrop="true"]') as HTMLElement;
    expect(backdrop).toBeTruthy();
    expect(backdrop.className).toContain("z-40");
    expect(backdrop.className).toContain("bg-transparent");

    await fireEvent.click(backdrop);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("handles CoimDialog showModal(), ESC, backdrop dismiss, returnValue reset, sizes, and focus restoration", async () => {
    const triggerBtn = document.createElement("button");
    triggerBtn.textContent = "Open Dialog";
    document.body.appendChild(triggerBtn);
    triggerBtn.focus();
    expect(document.activeElement).toBe(triggerBtn);

    const onClose = vi.fn();
    const bodySnippet = createRawSnippet(() => ({
      render: () => `<div data-testid="dialog-inner">Body Content</div>`,
    }));

    const showModalSpy = vi.spyOn(HTMLDialogElement.prototype, "showModal");

    const { container, rerender, getByTestId } = render(CoimDialog, {
      props: {
        open: false,
        maxWidth: "md",
        fullWidth: true,
        scroll: "paper",
        onClose,
        children: bodySnippet,
      },
    });

    const dialog = container.querySelector("dialog") as HTMLDialogElement;
    expect(dialog).toBeTruthy();
    expect(dialog.open).toBe(false);

    await rerender({
      open: true,
      maxWidth: "md",
      fullWidth: true,
      scroll: "paper",
      onClose,
      children: bodySnippet,
    });
    await tick();

    expect(showModalSpy).toHaveBeenCalledTimes(1);
    expect(dialog).toHaveAttribute("open");
    expect(dialog.className).toContain("max-w-[900px]");
    expect(dialog.className).toContain("w-[calc(100%-2rem)]");

    // Clicking inside dialog content must NOT dismiss
    await fireEvent.pointerDown(getByTestId("dialog-inner"));
    await fireEvent.pointerUp(dialog);
    expect(onClose).not.toHaveBeenCalled();

    // Backdrop dismiss via pointerdown + pointerup on dialog
    dialog.returnValue = "dirty";
    await fireEvent.pointerDown(dialog);
    await fireEvent.pointerUp(dialog);
    await tick();

    expect(onClose).toHaveBeenCalledWith("backdropClick");
    expect(dialog).not.toHaveAttribute("open");
    expect(dialog.returnValue).toBe("");
    expect(document.activeElement).toBe(triggerBtn);

    // Reopen and test ESC close & disableEscapeKeyDown
    triggerBtn.focus();
    await rerender({
      open: true,
      disableEscapeKeyDown: true,
      onClose,
      children: bodySnippet,
    });
    await tick();
    await fireEvent.keyDown(dialog, { key: "Escape" });
    expect(dialog).toHaveAttribute("open");

    await rerender({
      open: true,
      disableEscapeKeyDown: false,
      fullScreen: true,
      onClose,
      children: bodySnippet,
    });
    await tick();
    expect(dialog.className).toContain("coim-dialog-fullscreen");

    await fireEvent.keyDown(dialog, { key: "Escape" });
    await tick();
    expect(onClose).toHaveBeenCalledWith("escapeKeyDown");
    expect(dialog).not.toHaveAttribute("open");
    expect(document.activeElement).toBe(triggerBtn);

    showModalSpy.mockRestore();

    // Sub-components smoke check
    const titleView = render(CoimDialogTitle, {
      props: { children: createRawSnippet(() => ({ render: () => `<span>Title</span>` })) },
    });
    expect(titleView.container.querySelector(".coim-dialog-title")).toHaveTextContent("Title");
    const contentView = render(CoimDialogContent, {
      props: { dividers: true, children: createRawSnippet(() => ({ render: () => `<span>Body</span>` })) },
    });
    expect(contentView.container.querySelector(".coim-dialog-content")).toHaveClass(
      "coim-dialog-content-dividers",
    );
    const textView = render(CoimDialogContentText, {
      props: { children: createRawSnippet(() => ({ render: () => `<span>Desc</span>` })) },
    });
    expect(textView.container.querySelector(".coim-dialog-content-text")).toHaveTextContent("Desc");
    const actionsView = render(CoimDialogActions, {
      props: { children: createRawSnippet(() => ({ render: () => `<button>Ok</button>` })) },
    });
    expect(actionsView.container.querySelector(".coim-dialog-actions")).toBeTruthy();
  });

  it("handles CoimConfirmDialog severity, async loading state, onConfirm, and onCancel", async () => {
    const deferred = { resolve: () => {} };
    const confirmPromise = new Promise<void>((resolve) => {
      deferred.resolve = resolve;
    });
    const onConfirm = vi.fn(() => confirmPromise);
    const onCancel = vi.fn();

    const { getByRole, getByText, container } = render(CoimConfirmDialog, {
      props: {
        open: true,
        title: "Delete record?",
        description: "This action cannot be undone.",
        severity: "error",
        confirmText: "Delete",
        cancelText: "Keep",
        onConfirm,
        onCancel,
      },
    });
    await tick();

    const dialog = container.querySelector("dialog") as HTMLDialogElement;
    expect(dialog).toHaveAttribute("open");
    expect(getByText("Delete record?")).toBeInTheDocument();
    expect(getByText("This action cannot be undone.")).toBeInTheDocument();

    const confirmBtn = getByRole("button", { name: "Delete" });
    await fireEvent.click(confirmBtn);
    await tick();

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(confirmBtn).toBeDisabled();
    expect(confirmBtn).toHaveAttribute("aria-busy", "true");
    expect(getByRole("button", { name: "Keep" })).toBeDisabled();

    deferred.resolve();
    await tick();
    await tick();

    expect(dialog).not.toHaveAttribute("open");

    // Test cancel flow
    const cancelDialog = render(CoimConfirmDialog, {
      props: {
        open: true,
        title: "Archive item?",
        onCancel,
      },
    });
    await tick();
    await fireEvent.click(cancelDialog.getByRole("button", { name: "Cancel" }));
    await tick();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("handles CoimModal open/close, keepMounted, and nested ESC stack", async () => {
    const onCloseOuter = vi.fn();
    const onCloseInner = vi.fn();

    const outer = render(CoimModal, {
      props: {
        open: true,
        keepMounted: true,
        onClose: onCloseOuter,
        children: createRawSnippet(() => ({
          render: () => `<div data-testid="outer-modal">Outer</div>`,
        })),
      },
    });

    const inner = render(CoimModal, {
      props: {
        open: true,
        onClose: onCloseInner,
        children: createRawSnippet(() => ({
          render: () => `<div data-testid="inner-modal">Inner</div>`,
        })),
      },
    });
    await tick();

    await fireEvent.keyDown(window, { key: "Escape" });
    await tick();

    expect(onCloseInner).toHaveBeenCalledWith("escapeKeyDown");
    expect(onCloseOuter).not.toHaveBeenCalled();

    // Backdrop click on outer
    const backdrop = outer.baseElement.querySelector('[data-coim-backdrop="true"]') as HTMLElement;
    await fireEvent.click(backdrop);
    await tick();
    expect(onCloseOuter).toHaveBeenCalledWith("backdropClick");
    expect(outer.getByTestId("outer-modal")).toBeInTheDocument();
    inner.unmount();
  });

  it("renders CoimDrawer across anchors, temporary/persistent/permanent variants, and dismisses temporary drawer", async () => {
    const onClose = vi.fn();
    const content = createRawSnippet(() => ({
      render: () => `<nav data-testid="drawer-nav">Drawer Nav</nav>`,
    }));

    const { container, rerender } = render(CoimDrawer, {
      props: {
        open: true,
        anchor: "right",
        variant: "temporary",
        surface: true,
        onClose,
        children: content,
      },
    });
    await tick();

    const dialog = container.querySelector("dialog") as HTMLDialogElement;
    expect(dialog).toHaveAttribute("open");
    expect(dialog.className).toContain("rounded-s-2xl");
    expect(dialog.className).toContain("coim-drawer-surface");

    await fireEvent.keyDown(dialog, { key: "Escape" });
    await tick();
    expect(onClose).toHaveBeenCalledWith("escapeKeyDown");

    await rerender({
      open: true,
      anchor: "left",
      variant: "persistent",
      rounded: true,
      children: content,
    });
    await tick();
    const aside = container.querySelector("aside") as HTMLElement;
    expect(aside).toBeTruthy();
    expect(aside.className).toContain("rounded-e-2xl");

    await rerender({
      open: false,
      anchor: "bottom",
      variant: "permanent",
      children: content,
    });
    await tick();
    const perm = container.querySelector("aside") as HTMLElement;
    expect(perm).toBeTruthy();
    expect(perm.className).toContain("rounded-t-2xl");
  });

  it("renders CoimPopover and non-modal CoimPopper", async () => {
    const anchor = document.createElement("button");
    anchor.textContent = "Anchor";
    anchor.getBoundingClientRect = () =>
      ({
        top: 100,
        left: 200,
        bottom: 140,
        right: 300,
        width: 100,
        height: 40,
        x: 200,
        y: 100,
        toJSON: () => ({}),
      }) as DOMRect;
    document.body.appendChild(anchor);

    const popperView = render(CoimPopper, {
      props: {
        open: true,
        anchorEl: anchor,
        placement: "bottom-start",
        offset: 8,
        children: createRawSnippet(() => ({
          render: () => `<div data-testid="popper-body">Popper text</div>`,
        })),
      },
    });
    await tick();

    const popperEl = document.body.querySelector('[data-coim-popper="true"]') as HTMLElement;
    expect(popperEl).toBeTruthy();
    expect(popperEl.getAttribute("data-placement")).toBe("bottom-start");
    expect(popperEl.style.left).toBe("200px");
    expect(popperEl.style.top).toBe("148px");

    // Non-modal: clicking outside does not close CoimPopper
    await fireEvent.click(document.body);
    expect(popperEl.getAttribute("data-state")).toBe("open");
    popperView.unmount();

    const popoverView = render(CoimPopover, {
      props: {
        open: true,
        anchorEl: anchor,
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
        children: createRawSnippet(() => ({
          render: () => `<div data-testid="popover-body">Popover content</div>`,
        })),
      },
    });
    await tick();
    const popBody = popoverView.getByTestId("popover-body");
    expect(popBody).toBeInTheDocument();
    expect(popBody.parentElement?.className).toContain("rounded-lg");
    expect(popBody.parentElement?.className).toContain("shadow-darker-sm");
  });

  it("renders CoimCircularProgress, CoimLinearProgress, and CoimSkeleton with proper ARIA attributes", () => {
    const circ = render(CoimCircularProgress, {
      props: { variant: "determinate", value: 65, size: "large", color: "success" },
    });
    const circBar = circ.getByRole("progressbar");
    expect(circBar).toHaveAttribute("aria-valuemin", "0");
    expect(circBar).toHaveAttribute("aria-valuemax", "100");
    expect(circBar).toHaveAttribute("aria-valuenow", "65");
    expect(circBar.className).toContain("large");
    expect(circBar.className).toContain("text-success");
    circ.unmount();

    const lin = render(CoimLinearProgress, {
      props: { variant: "buffer", value: 40, valueBuffer: 70, color: "info" },
    });
    const linBar = lin.getByRole("progressbar");
    expect(linBar).toHaveAttribute("aria-valuenow", "40");
    expect(linBar.className).toContain("text-info");
    lin.unmount();

    const skel = render(CoimSkeleton, {
      props: { variant: "circular", animation: "wave", width: 48, height: 48 },
    });
    const skelEl = skel.container.querySelector(".coim-skeleton") as HTMLElement;
    expect(skelEl).toHaveAttribute("aria-busy", "true");
    expect(skelEl.className).toContain("coim-skeleton-circular");
    expect(skelEl.className).toContain("coim-skeleton-wave");
    expect(skelEl.style.width).toBe("48px");
    expect(skelEl.style.height).toBe("48px");
  });

  it("manages ToastState maxStack, autoHideDuration, dismiss/clear, and renders CoimToastProvider + CoimSnackbar", async () => {
    vi.useFakeTimers();

    const store = new ToastState({ maxStack: 3, autoHideDuration: 3000 });
    const onEvict = vi.fn();
    const onAction = vi.fn();

    render(CoimToastProvider, {
      props: {
        state: store,
        maxStack: 3,
        autoHideDuration: 3000,
      },
    });
    await tick();

    const id1 = store.info("First", { onClose: onEvict });
    const id2 = store.success("Second", {
      action: { label: "Undo", onClick: onAction },
    });
    const id3 = store.warning("Third");
    const id4 = store.error("Fourth");
    await tick();

    // maxStack = 3 evicted First
    expect(onEvict).toHaveBeenCalledWith("maxStack");
    expect(store.items.map((i) => i.id)).toEqual([id2, id3, id4]);

    // Error toast uses alert + assertive, others use status + polite
    const alertEl = document.body.querySelector('[role="alert"]') as HTMLElement;
    expect(alertEl).toBeTruthy();
    expect(alertEl).toHaveAttribute("aria-live", "assertive");
    expect(alertEl).toHaveTextContent("Fourth");

    const statusEls = document.body.querySelectorAll('[role="status"]');
    expect(statusEls.length).toBe(2);
    expect(statusEls[0]).toHaveAttribute("aria-live", "polite");

    // Trigger action button on Second
    const undoBtn = Array.from(document.body.querySelectorAll("button")).find(
      (b) => b.textContent === "Undo",
    ) as HTMLButtonElement;
    await fireEvent.click(undoBtn);
    expect(onAction).toHaveBeenCalledWith(id2);

    // Manual dismiss of id3
    store.dismiss(id3);
    await tick();
    expect(store.items.map((i) => i.id)).toEqual([id2, id4]);

    // Auto-dismiss after 3000ms
    vi.advanceTimersByTime(3000);
    await tick();
    expect(store.items.length).toBe(0);

    // Clear resets immediately
    store.show("Sticky", { autoHideDuration: null });
    await tick();
    expect(store.items.length).toBe(1);
    store.clear();
    await tick();
    expect(store.items.length).toBe(0);
    expect(id1).toBeTruthy();

    // Standalone CoimSnackbar autoHideDuration & close
    const onSnackClose = vi.fn();
    const snack = render(CoimSnackbar, {
      props: {
        open: true,
        variant: "success",
        message: "Profile updated",
        autoHideDuration: 1500,
        onClose: onSnackClose,
      },
    });
    await tick();
    expect(snack.getByText("Profile updated")).toBeInTheDocument();

    vi.advanceTimersByTime(1500);
    await tick();
    expect(onSnackClose).toHaveBeenCalledWith("timeout");
  });

  it("infers determinate vs indeterminate progress and fires CoimDialog onOpenChange only on transitions", async () => {
    const detCirc = render(CoimCircularProgress, { props: { value: 65 } });
    expect(detCirc.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "65");
    expect(detCirc.container.querySelector(".coim-circular-progress-determinate")).toBeTruthy();
    detCirc.unmount();

    const indCirc = render(CoimCircularProgress, { props: {} });
    expect(indCirc.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
    expect(indCirc.container.querySelector(".coim-circular-progress-indeterminate")).toBeTruthy();
    indCirc.unmount();

    const detLin = render(CoimLinearProgress, { props: { value: 65 } });
    expect(detLin.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "65");
    expect(detLin.getByRole("progressbar")).toHaveAttribute("data-variant", "determinate");
    detLin.unmount();

    const indLin = render(CoimLinearProgress, { props: {} });
    expect(indLin.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
    expect(indLin.getByRole("progressbar")).toHaveAttribute("data-variant", "indeterminate");
    indLin.unmount();

    const onOpenChange = vi.fn();
    const dlg = render(CoimDialog, {
      props: {
        open: false,
        onOpenChange,
        children: createRawSnippet(() => ({ render: () => `<span>Body</span>` })),
      },
    });
    await tick();
    expect(onOpenChange).not.toHaveBeenCalled();

    await dlg.rerender({
      open: true,
      onOpenChange,
      children: createRawSnippet(() => ({ render: () => `<span>Body</span>` })),
    });
    await tick();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(true);

    await dlg.rerender({
      open: false,
      onOpenChange,
      children: createRawSnippet(() => ({ render: () => `<span>Body</span>` })),
    });
    await tick();
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    dlg.unmount();

    // Draggable CoimDialog translates on header pointer drag and resets on close
    const dragDlg = render(CoimDialog, {
      props: {
        open: true,
        draggable: true,
        ariaLabel: "Draggable window",
        children: createRawSnippet(() => ({
          render: () => `<div data-coim-dialog-drag-handle="true">Drag Header</div>`,
        })),
      },
    });
    await tick();
    const dialogEl = dragDlg.container.querySelector("dialog") as HTMLDialogElement;
    expect(dialogEl).toHaveAttribute("data-draggable", "true");
    const handle = dragDlg.getByText("Drag Header");
    await fireEvent.pointerDown(handle, { button: 0, clientX: 100, clientY: 100 });
    await fireEvent.pointerMove(window, { clientX: 145, clientY: 120 });
    await fireEvent.pointerUp(window);
    await tick();
    expect(dialogEl.style.transform).toContain("translate3d(45px, 20px, 0px)");

    await dragDlg.rerender({
      open: false,
      draggable: true,
      ariaLabel: "Draggable window",
      children: createRawSnippet(() => ({
        render: () => `<div data-coim-dialog-drag-handle="true">Drag Header</div>`,
      })),
    });
    await tick();
    expect(dialogEl.style.transform).toBe("");
  });
});
