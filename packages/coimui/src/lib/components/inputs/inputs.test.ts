import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { createRawSnippet, tick } from "svelte";
import InputsTestHost from "../../../tests/InputsTestHost.svelte";
import {
  CoimButton,
  CoimButtonGroup,
  CoimDropzone,
  CoimFab,
  CoimIconButton,
  CoimNumberField,
  CoimNumberSpinner,
  CoimOtpInput,
  CoimRating,
  CoimTextField,
  applyInputMask,
  matchHighlights,
  parseHighlights,
} from "./index.js";

describe("Inputs Component Library", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });

  it("renders CoimButton, CoimIconButton, CoimButtonGroup, and CoimFab variants/sizes/href", () => {
    const btn = render(CoimButton, {
      props: {
        variant: "pastel",
        size: "large",
        color: "secondary",
        loading: true,
        children: createRawSnippet(() => ({ render: () => `<span>Save</span>` })),
      },
    });
    const el = btn.getByRole("button");
    expect(el).toBeDisabled();
    expect(el).toHaveAttribute("aria-busy", "true");
    expect(el.className).toContain("coim-btn-pastel");
    expect(el.className).toContain("coim-btn-size-large");
    btn.unmount();

    const anchor = render(CoimIconButton, {
      props: {
        href: "/settings",
        "aria-label": "Settings",
        variant: "surface",
        children: createRawSnippet(() => ({ render: () => `<span>S</span>` })),
      },
    });
    expect(anchor.getByRole("link", { name: "Settings" })).toHaveClass("coim-icon-btn", "coim-btn-surface");
    anchor.unmount();

    const grp = render(CoimButtonGroup, {
      props: {
        orientation: "vertical",
        children: createRawSnippet(() => ({ render: () => `<button>One</button>` })),
      },
    });
    expect(grp.getByRole("group")).toHaveClass("coim-btn-group-vertical");
    grp.unmount();

    const fab = render(CoimFab, {
      props: {
        variant: "extended",
        size: "xlarge",
        children: createRawSnippet(() => ({ render: () => `<span>Create</span>` })),
      },
    });
    expect(fab.getByRole("button", { name: "Create" })).toHaveClass("coim-fab-extended", "coim-fab-size-xlarge");
  });

  it("supports CoimTextField floating label, aria-describedby error linkage, and masking", async () => {
    const onValueChange = vi.fn();
    const view = render(CoimTextField, {
      props: {
        label: "Phone",
        helperText: "Enter US number",
        error: true,
        required: true,
        variant: "outlined",
        mask: "(000) 000-0000",
        onValueChange,
      },
    });

    const input = view.getByLabelText("Phone *") as HTMLInputElement;
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby");
    expect(view.getByRole("alert")).toHaveTextContent("Enter US number");

    await fireEvent.input(input, { target: { value: "5551234567" } });
    expect(onValueChange).toHaveBeenCalledWith("(555) 123-4567");
    expect(applyInputMask("1234.5", "currency")).toBe("$1,234.5");
  });

  it("supports CoimNumberSpinner step buttons and keyboard bounds", async () => {
    const onValueChange = vi.fn();
    const view = render(CoimNumberSpinner, {
      props: {
        label: "Quantity",
        value: 2,
        min: 1,
        max: 4,
        step: 1,
        onValueChange,
      },
    });

    await fireEvent.click(view.getByRole("button", { name: "Increase value" }));
    expect(onValueChange).toHaveBeenLastCalledWith(3);

    const input = view.getByLabelText("Quantity") as HTMLInputElement;
    await fireEvent.keyDown(input, { key: "ArrowUp" });
    await fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onValueChange).toHaveBeenLastCalledWith(4);
  });

  it("renders Bits UI toggle group, select, autocomplete, checkbox, radio, switch, and slider", async () => {
    const view = render(InputsTestHost, {});
    await tick();

    // Radio selection
    const freeRadio = view.getByRole("radio", { name: "Free" });
    await fireEvent.click(freeRadio);
    await tick();
    expect(freeRadio).toHaveAttribute("aria-checked", "true");

    // Checkbox indeterminate -> checked transition
    const cb = view.getByRole("checkbox");
    expect(cb).toHaveAttribute("aria-checked", "mixed");
    await fireEvent.click(cb);
    await tick();
    expect(cb).toHaveAttribute("aria-checked", "true");

    // Switch toggle
    const sw = view.getByRole("switch");
    expect(sw).toHaveAttribute("aria-checked", "false");
    await fireEvent.click(sw);
    await tick();
    expect(sw).toHaveAttribute("aria-checked", "true");

    // Highlight utility verification
    const ranges = matchHighlights("Svelte 5 UI", "ui");
    expect(parseHighlights("Svelte 5 UI", ranges)).toEqual([
      { text: "Svelte 5 ", highlight: false },
      { text: "UI", highlight: true },
    ]);
  });

  it("supports CoimRating keyboard, CoimOtpInput paste/completion, and CoimDropzone validation", async () => {
    const onRating = vi.fn();
    const rate = render(CoimRating, {
      props: { value: 2.5, precision: 0.5, onValueChange: onRating },
    });
    const slider = rate.getByRole("slider", { name: "Rating" });
    await fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onRating).toHaveBeenCalledWith(3);
    rate.unmount();

    const onComplete = vi.fn();
    const otp = render(CoimOtpInput, { props: { length: 4, onComplete } });
    const d1 = otp.getByLabelText("Digit 1 of 4") as HTMLInputElement;
    await fireEvent.paste(d1, {
      clipboardData: { getData: () => "1234" },
    });
    expect(onComplete).toHaveBeenCalledWith("1234");
    otp.unmount();

    const onDrop = vi.fn();
    const dz = render(CoimDropzone, {
      props: { accept: ".txt", maxSize: 10, onDrop },
    });
    const fileInput = dz.container.querySelector('input[type="file"]') as HTMLInputElement;
    const validFile = new File(["ok"], "notes.txt", { type: "text/plain" });
    const badFile = new File(["0123456789ABCDEF"], "photo.png", { type: "image/png" });
    await fireEvent.change(fileInput, { target: { files: [validFile, badFile] } });
    await tick();
    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(dz.getByText("notes.txt")).toBeInTheDocument();
    expect(dz.getByRole("alert")).toBeInTheDocument();
  });

  it("centers fullWidth CoimButton, preserves loading content styling, and renders standalone CoimNumberField label", () => {
    const fw = render(CoimButton, {
      props: {
        fullWidth: true,
        loading: true,
        children: createRawSnippet(() => ({ render: () => `<span>Submit</span>` })),
      },
    });
    const fwBtn = fw.getByRole("button");
    expect(fwBtn.className).not.toContain("justify-start");
    expect(fwBtn.className).not.toContain("text-transparent!");
    fw.unmount();

    const num = render(CoimNumberField, {
      props: { label: "License Seats", value: 25 },
    });
    const spinInput = num.getByLabelText("License Seats") as HTMLInputElement;
    expect(spinInput).toHaveValue(25);
    num.unmount();

    const outlined = render(CoimButton, {
      props: {
        variant: "outlined",
        size: "medium",
        color: "secondary",
        children: createRawSnippet(() => ({ render: () => `<span>Outlined</span>` })),
      },
    });
    const outlinedBtn = outlined.getByRole("button", { name: "Outlined" });
    expect(outlinedBtn.className).toContain("py-[calc(0.5rem-1px)]");
    expect(outlinedBtn.className).toContain("px-[calc(1.25rem-1px)]");
  });
});
