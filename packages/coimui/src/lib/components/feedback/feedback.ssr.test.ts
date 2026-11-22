import { describe, expect, it } from "vitest";
import { render } from "svelte/server";
import { createRawSnippet } from "svelte";
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
import { CoimClickAwayListener } from "../../utilities/click-away/index.js";
import { CoimPortal } from "../../utilities/portal/index.js";
import {
  CoimCollapse,
  CoimFade,
  CoimGrow,
  CoimSlide,
  CoimZoom,
} from "../../utilities/transitions/index.js";

describe("Phase D Feedback & Utilities SSR Safety", () => {
  it("renders all feedback components cleanly on server", () => {
    const textSnippet = createRawSnippet(() => ({
      render: () => `<span>SSR content</span>`,
    }));

    const alert = render(CoimAlert, {
      props: { severity: "warning", variant: "outlined", children: textSnippet },
    });
    expect(alert.body).toContain('role="alert"');
    expect(alert.body).toContain("SSR content");
    expect(alert.body).toContain("<svg");

    const alertTitle = render(CoimAlertTitle, { props: { children: textSnippet } });
    expect(alertTitle.body).toContain("coim-alert-title");

    const backdrop = render(CoimBackdrop, { props: { open: true } });
    expect(backdrop.body).toContain("data-coim-backdrop");

    const dialog = render(CoimDialog, {
      props: {
        open: true,
        children: createRawSnippet(() => ({
          render: () => `<div>Dialog SSR</div>`,
        })),
      },
    });
    expect(dialog.body).toContain("<dialog");

    const dialogTitle = render(CoimDialogTitle, { props: { children: textSnippet } });
    const dialogContent = render(CoimDialogContent, { props: { children: textSnippet } });
    const dialogText = render(CoimDialogContentText, { props: { children: textSnippet } });
    const dialogActions = render(CoimDialogActions, { props: { children: textSnippet } });
    expect(dialogTitle.body).toContain("coim-dialog-title");
    expect(dialogContent.body).toContain("coim-dialog-content");
    expect(dialogText.body).toContain("coim-dialog-content-text");
    expect(dialogActions.body).toContain("coim-dialog-actions");

    const confirm = render(CoimConfirmDialog, {
      props: { open: true, title: "Confirm SSR", description: "Proceed?" },
    });
    expect(confirm.body).toContain("Confirm SSR");

    const modal = render(CoimModal, {
      props: { open: true, children: textSnippet },
    });
    expect(modal.body).toContain("data-coim-modal");

    const drawer = render(CoimDrawer, {
      props: { open: true, variant: "permanent", anchor: "right", children: textSnippet },
    });
    expect(drawer.body).toContain("coim-drawer-anchor-right");

    const popover = render(CoimPopover, {
      props: { open: false, children: textSnippet },
    });
    expect(popover.body).toBeDefined();

    const popper = render(CoimPopper, {
      props: { open: true, children: textSnippet },
    });
    expect(popper.body).toContain("data-coim-popper");

    const circular = render(CoimCircularProgress, {
      props: { variant: "determinate", value: 50 },
    });
    expect(circular.body).toContain('role="progressbar"');

    const linear = render(CoimLinearProgress, {
      props: { variant: "buffer", value: 25, valueBuffer: 60 },
    });
    expect(linear.body).toContain('aria-valuenow="25"');

    const skeleton = render(CoimSkeleton, {
      props: { variant: "rounded", animation: "pulse" },
    });
    expect(skeleton.body).toContain('aria-busy="true"');

    const snackbar = render(CoimSnackbar, {
      props: { open: true, variant: "info", message: "SSR toast" },
    });
    expect(snackbar.body).toContain("SSR toast");

    const store = new ToastState();
    store.success("Server notification");
    const provider = render(CoimToastProvider, {
      props: { state: store, children: textSnippet },
    });
    expect(provider.body).toContain("Server notification");
  });

  it("renders portal, click-away listener, and transitions cleanly on server", () => {
    const child = createRawSnippet(() => ({
      render: () => `<div>SSR Util</div>`,
    }));

    const portal = render(CoimPortal, { props: { children: child } });
    expect(portal.body).toContain("SSR Util");

    const clickAwayListener = render(CoimClickAwayListener, {
      props: { onClickAway: () => {}, children: child },
    });
    expect(clickAwayListener.body).toContain("SSR Util");

    expect(render(CoimFade, { props: { in: true, children: child } }).body).toContain("SSR Util");
    expect(render(CoimGrow, { props: { in: true, children: child } }).body).toContain("SSR Util");
    expect(render(CoimZoom, { props: { in: true, children: child } }).body).toContain("SSR Util");
    expect(
      render(CoimSlide, { props: { in: true, direction: "up", children: child } }).body,
    ).toContain("SSR Util");
    expect(
      render(CoimCollapse, { props: { in: true, collapsedSize: 40, children: child } }).body,
    ).toContain("SSR Util");
  });
});
