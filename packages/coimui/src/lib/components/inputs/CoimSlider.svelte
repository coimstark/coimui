<script lang="ts">
  import { Slider } from "bits-ui";
  import type { CoimColor } from "../../theme/types.js";
  import { cn } from "../../utilities/utils.js";
  import type { CoimInputSize, CoimSliderMark } from "./types.js";

  interface Props {
    value?: number | number[];
    min?: number;
    max?: number;
    step?: number;
    orientation?: "horizontal" | "vertical";
    dir?: "ltr" | "rtl";
    size?: CoimInputSize;
    color?: CoimColor;
    track?: "normal" | "inverted" | false;
    marks?: boolean | CoimSliderMark[];
    valueLabelDisplay?: "off" | "on" | "auto";
    valueLabelFormat?: (value: number) => string;
    disabled?: boolean;
    "aria-label"?: string;
    onValueChange?: (value: number | number[]) => void;
    onValueCommit?: (value: number | number[]) => void;
    class?: string;
  }

  let {
    value = $bindable<number | number[]>(0),
    min = 0,
    max = 100,
    step = 1,
    orientation = "horizontal",
    dir = "ltr",
    size = "medium",
    color = "primary",
    track = "normal",
    marks = false,
    valueLabelDisplay = "off",
    valueLabelFormat = (v) => String(v),
    disabled = false,
    "aria-label": ariaLabel,
    onValueChange,
    onValueCommit,
    class: className = "",
  }: Props = $props();

  const isRange = $derived(Array.isArray(value));
  const singleValue = $derived(typeof value === "number" ? value : (value[0] ?? min));
  const rangeValues = $derived(Array.isArray(value) ? value : [value]);

  const markList = $derived.by((): CoimSliderMark[] => {
    if (!marks) return [];
    if (Array.isArray(marks)) return marks;
    const list: CoimSliderMark[] = [];
    const safeStep = step > 0 ? step : 10;
    for (let v = min; v <= max; v += safeStep) {
      list.push({ value: v });
    }
    return list;
  });

  const rootClass = $derived(
    cn(
      "coim-slider",
      orientation === "vertical" ? "coim-slider-vertical" : "coim-slider-horizontal",
      size === "small" ? "coim-slider-size-small" : "coim-slider-size-medium",
      `coim-slider-color-${color}`,
      track === "inverted" && "coim-slider-track-inverted",
      track === false && "coim-slider-track-none",
      disabled && "coim-disabled",
      className,
    ),
  );
</script>

{#snippet sliderInner(thumbItems: { index: number; value: number }[])}
  <span class="coim-slider-rail">
    <Slider.Range class="coim-slider-track" />
  </span>

  {#each markList as mark (mark.value)}
    {@const pct = max === min ? 0 : ((mark.value - min) / (max - min)) * 100}
    <span
      class="coim-slider-mark pointer-events-none absolute -translate-x-1/2"
      style={orientation === "vertical" ? `bottom: ${pct}%; left: 50%;` : `left: ${pct}%;`}
    ></span>
    {#if mark.label}
      <span
        class="coim-slider-mark-label -translate-x-1/2"
        style={orientation === "vertical"
          ? `bottom: ${pct}%; inset-inline-start: 1.5rem;`
          : `left: ${pct}%; top: 1.5rem;`}
      >
        {mark.label}
      </span>
    {/if}
  {/each}

  {#each thumbItems as thumb (thumb.index)}
    <Slider.Thumb
      index={thumb.index}
      aria-label={ariaLabel}
      class="coim-slider-thumb"
    >
      {#snippet children({ active })}
        {#if valueLabelDisplay === "on" || (valueLabelDisplay === "auto" && active)}
          <span class="coim-slider-value-label">
            {valueLabelFormat(thumb.value)}
          </span>
        {/if}
      {/snippet}
    </Slider.Thumb>
  {/each}
{/snippet}

{#if isRange}
  <Slider.Root
    type="multiple"
    value={rangeValues}
    onValueChange={(next) => {
      value = next;
      onValueChange?.(next);
    }}
    onValueCommit={(next) => onValueCommit?.(next)}
    {min}
    {max}
    {step}
    {orientation}
    {dir}
    {disabled}
    class={rootClass}
  >
    {#snippet children({ thumbItems })}
      {@render sliderInner(thumbItems)}
    {/snippet}
  </Slider.Root>
{:else}
  <Slider.Root
    type="single"
    value={singleValue}
    onValueChange={(next) => {
      value = next;
      onValueChange?.(next);
    }}
    onValueCommit={(next) => onValueCommit?.(next)}
    {min}
    {max}
    {step}
    {orientation}
    {dir}
    {disabled}
    class={rootClass}
  >
    {#snippet children({ thumbItems })}
      {@render sliderInner(thumbItems)}
    {/snippet}
  </Slider.Root>
{/if}
