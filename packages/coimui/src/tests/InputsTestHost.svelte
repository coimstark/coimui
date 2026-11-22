<script lang="ts">
  import {
    CoimAutocomplete,
    CoimCheckbox,
    CoimFormControlLabel,
    CoimRadio,
    CoimRadioGroup,
    CoimSelect,
    CoimSlider,
    CoimSwitch,
    CoimToggleButton,
    CoimToggleButtonGroup,
  } from "../lib/components/inputs/index.js";

  interface Props {
    toggleVal?: string;
    selectVal?: string;
    multiSelectVal?: string[];
    autoVal?: string | null;
    checkedVal?: boolean;
    indeterminateVal?: boolean;
    radioVal?: string;
    switchVal?: boolean;
    sliderVal?: number;
    rangeSliderVal?: number[];
  }

  let {
    toggleVal = $bindable("left"),
    selectVal = $bindable("us"),
    multiSelectVal = $bindable(["a"]),
    autoVal = $bindable("svelte"),
    checkedVal = $bindable(false),
    indeterminateVal = $bindable(true),
    radioVal = $bindable("pro"),
    switchVal = $bindable(false),
    sliderVal = $bindable(40),
    rangeSliderVal = $bindable([20, 80]),
  }: Props = $props();
</script>

<CoimToggleButtonGroup type="single" bind:value={toggleVal} variant="surface" color="primary">
  <CoimToggleButton value="left">Left</CoimToggleButton>
  <CoimToggleButton value="right">Right</CoimToggleButton>
</CoimToggleButtonGroup>

<CoimSelect
  label="Country"
  options={[
    { value: "us", label: "United States" },
    { value: "id", label: "Indonesia" },
  ]}
  bind:value={selectVal}
/>

<CoimSelect
  label="Tags"
  multiple
  options={[
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta" },
  ]}
  bind:value={multiSelectVal}
/>

<CoimAutocomplete
  label="Framework"
  freeSolo
  options={[
    { value: "svelte", label: "Svelte 5" },
    { value: "vite", label: "Vite 8" },
  ]}
  bind:value={autoVal}
/>

<CoimFormControlLabel label="Accept terms">
  <CoimCheckbox bind:checked={checkedVal} bind:indeterminate={indeterminateVal} />
</CoimFormControlLabel>

<CoimRadioGroup label="Plan" row bind:value={radioVal}>
  <CoimRadio value="free" label="Free" />
  <CoimRadio value="pro" label="Pro" />
</CoimRadioGroup>

<CoimSwitch label="Notifications" bind:checked={switchVal} />

<CoimSlider aria-label="Volume" bind:value={sliderVal} valueLabelDisplay="on" />
<CoimSlider aria-label="Range" bind:value={rangeSliderVal} />
