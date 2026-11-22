import { describe, expect, it } from "vitest";
import { render } from "svelte/server";
import InputsTestHost from "../../../tests/InputsTestHost.svelte";
import { CoimDropzone, CoimNumberSpinner, CoimOtpInput, CoimRating, CoimTextField } from "./index.js";

describe("Inputs SSR Safety", () => {
  it("renders all input controls and Bits UI composites cleanly on server", () => {
    const host = render(InputsTestHost, {});
    expect(host.body).toContain("coim-toggle-group");
    expect(host.body).toContain("coim-select-trigger");
    expect(host.body).toContain("coim-autocomplete-root");
    expect(host.body).toContain("coim-checkbox");
    expect(host.body).toContain("coim-radio-group");
    expect(host.body).toContain("coim-switch");
    expect(host.body).toContain("coim-slider");

    const tf = render(CoimTextField, { props: { label: "Email", variant: "outlined" } });
    expect(tf.body).toContain("coim-input-outlined");

    const num = render(CoimNumberSpinner, { props: { value: 10 } });
    expect(num.body).toContain("coim-number-field");

    const rate = render(CoimRating, { props: { value: 4 } });
    expect(rate.body).toContain("coim-rating");

    const otp = render(CoimOtpInput, { props: { length: 4 } });
    expect(otp.body).toContain("coim-otp-group");

    const dz = render(CoimDropzone, {});
    expect(dz.body).toContain("coim-dropzone");
  });
});
