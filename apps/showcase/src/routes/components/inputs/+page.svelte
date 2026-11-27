<script lang="ts">
  import {
    CoimAutocomplete,
    CoimBreadcrumbs,
    CoimButton,
    CoimButtonGroup,
    CoimCheckbox,
    CoimDropzone,
    CoimFab,
    CoimFormControl,
    CoimFormControlLabel,
    CoimFormGroup,
    CoimFormHelperText,
    CoimFormLabel,
    CoimGrid,
    CoimIconButton,
    CoimInput,
    CoimInputAdornment,
    CoimNumberField,
    CoimNumberSpinner,
    CoimOtpInput,
    CoimRadio,
    CoimRadioGroup,
    CoimRating,
    CoimSelect,
    CoimSlider,
    CoimStack,
    CoimSwitch,
    CoimTextField,
    CoimTextareaAutosize,
    CoimToggleButton,
    CoimToggleButtonGroup,
    CoimTypography,
    type CoimButtonSize,
    type CoimButtonVariant,
    type CoimColor,
    type CoimInputSize,
    type CoimInputVariant,
    toast,
  } from "@coimui/svelte";
  import { CiBell, CiBinEmpty, CiPen, CiPlus, CiSearch } from "@coimui/svelte/icons";
  import ComponentDocCard from "#lib/components/ComponentDocCard.svelte";
  import type { ComponentApiGroup } from "#lib/components/doc-types.ts";
  import { COMPONENT_CODE_EXAMPLES } from "#lib/examples/component-docs.ts";

  const END_SCRIPT = "</" + "script>";

  let toggleView = $state("grid");
  let cadenceRange = $state<"day" | "week" | "month">("week");
  let projectTitle = $state("CoimUI Launch Playbook");
  let seatLimit = $state<number | null>(25);
  let tier = $state("enterprise");
  let region = $state<string | null>("apac");
  let emailAlerts = $state(true);
  let auditMode = $state(false);
  let billingCycle = $state("annual");
  let threshold = $state(68);
  let ratingValue = $state<number | null>(4.5);
  let otpValue = $state("581920");
  let droppedFiles = $state<File[]>([]);

  // Interactive Playground state (below fold)
  let btnVariant = $state<CoimButtonVariant>("contained");
  let btnColor = $state<CoimColor>("primary");
  let btnSize = $state<CoimButtonSize>("medium");
  let btnLoading = $state(false);
  let btnDisabled = $state(false);

  let tfVariant = $state<CoimInputVariant>("outlined");
  let tfSize = $state<CoimInputSize>("medium");
  let tfError = $state(false);
  let tfFloating = $state(false);
  let tfMultiline = $state(false);
  let tfValue = $state("release@coimui.dev");

  const playgroundCode = $derived(`<script lang="ts">
  import { CoimButton, CoimTextField } from "@coimui/svelte";
  let value = $state(${JSON.stringify(tfValue)});
${END_SCRIPT}

<CoimButton
  variant="${btnVariant}"
  color="${btnColor}"
  size="${btnSize}"${btnLoading ? "\n  loading" : ""}${btnDisabled ? "\n  disabled" : ""}
>
  Save Workspace
</CoimButton>

<CoimTextField
  label="Notification Email"
  variant="${tfVariant}"
  size="${tfSize}"${tfError ? "\n  error\n  helperText=\"Enter a valid email address\"" : ""}${tfFloating ? "\n  floatingLabel" : ""}${tfMultiline ? "\n  multiline\n  minRows={2}" : ""}
  bind:value
  fullWidth
/>`);

  // Low-level input & form primitives state
  let rawDomain = $state("coimui");
  let spinnerCount = $state<number | null>(3);
  let notesValue = $state("Auto-growing release notes line 1\nLine 2");
  let primitiveError = $state(false);

  const primitivesCode = $derived(`<script lang="ts">
  import {
    CoimFormControl,
    CoimFormGroup,
    CoimFormLabel,
    CoimFormHelperText,
    CoimInput,
    CoimInputAdornment,
    CoimNumberSpinner,
    CoimTextareaAutosize,
    CoimCheckbox,
  } from "@coimui/svelte";

  let domain = $state(${JSON.stringify(rawDomain)});
  let workers = $state<number | null>(${spinnerCount ?? 3});
  let notes = $state(${JSON.stringify(notesValue)});
${END_SCRIPT}

<CoimFormControl error={${primitiveError}} fullWidth>
  <CoimFormLabel required>Custom Subdomain</CoimFormLabel>
  <CoimInput bind:value={domain} variant="outlined">
    {#snippet startAdornment()}
      <CoimInputAdornment position="start">https://</CoimInputAdornment>
    {/snippet}
    {#snippet endAdornment()}
      <CoimInputAdornment position="end">.coimui.dev</CoimInputAdornment>
    {/snippet}
  </CoimInput>
  <CoimFormHelperText>${primitiveError ? "Subdomain is already reserved" : "Lowercase alphanumeric slug"}</CoimFormHelperText>
</CoimFormControl>

<CoimNumberSpinner label="Worker Replicas" bind:value={workers} min={1} max={16} />
<CoimTextareaAutosize bind:value={notes} minRows={2} maxRows={6} class="w-full rounded-md border p-2.5 text-sm" />
<CoimFormGroup legend="Channels" row>
  <CoimCheckbox label="Webhook" checked />
  <CoimCheckbox label="Email" />
</CoimFormGroup>`);

  const primitivesApiGroups: ComponentApiGroup[] = [
    {
      title: "CoimInput, CoimInputAdornment, CoimNumberSpinner & CoimTextareaAutosize",
      props: [
        { name: "CoimInput.value", type: "string", kind: "bindable", description: "Input text value; also supports mask, startAdornment, and endAdornment snippets." },
        { name: "CoimInputAdornment.position", type: "\"start\" | \"end\"", description: "Aligns prefix/suffix icons or text tokens inside CoimInput." },
        { name: "CoimNumberSpinner", type: "value?, min?, max?, step?, precision?", description: "Compact numeric spinner with +/- buttons and keyboard arrow stepping." },
        { name: "CoimTextareaAutosize", type: "value?, minRows?, maxRows?, ref?", description: "Native textarea that grows smoothly within row bounds." },
      ],
    },
    {
      title: "CoimFormControl, CoimFormGroup, CoimFormLabel & CoimFormHelperText",
      props: [
        { name: "CoimFormControl", type: "error?, disabled?, required?, readOnly?, size?, variant?, fullWidth?", description: "Provides shared form state context to child labels, inputs, and helper text." },
        { name: "CoimFormGroup", type: "row?, legend?, disabled?", description: "Semantic <fieldset> wrapper grouping related checkboxes or switches." },
        { name: "CoimFormLabel", type: "for?, component?, required?, error?, disabled?", description: "Renders <label>, <legend>, or <span> inheriting form state." },
        { name: "CoimFormHelperText", type: "id?, error?, disabled?", description: "Accessible caption or validation message below inputs." },
      ],
    },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Inputs &amp; Controls</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Components", href: "/components" }, { label: "Inputs & Controls" }]} />
    <CoimTypography variant="h1" class="mt-2">Inputs &amp; Controls</CoimTypography>
    <p class="text-text-secondary mt-1">
      Buttons, toggle groups, text and number fields, accessible selects, comboboxes, switches, sliders, ratings, OTP verification, and dropzones.
    </p>
  </div>

  <CoimTypography variant="h2">Action Triggers, Text Entry &amp; Selection Widgets</CoimTypography>

  <ComponentDocCard
    id="coim-button"
    title="Buttons, Groups, FAB &amp; Toggle Groups"
    description="Standard, pastel, outlined, and contained buttons plus compact icon controls."
    code={COMPONENT_CODE_EXAMPLES.buttons}
    propsDocs={[
      { name: "variant", type: "\"contained\" | \"outlined\" | \"text\" | \"pastel\" | \"surface\"", defaultValue: "\"contained\"", description: "Visual emphasis level across button families." },
      { name: "color / size", type: "CoimColor / \"tiny\" | \"small\" | \"medium\" | \"large\"", defaultValue: "\"primary\" / \"medium\"", description: "Theme color token and touch-target sizing." },
      { name: "loading", type: "boolean", defaultValue: "false", description: "Renders inline indicator while preserving layout geometry." },
      { name: "CoimToggleButtonGroup", type: "type: \"single\" | \"multiple\"", defaultValue: "\"single\"", description: "Roving focus radio/toggle semantics via Bits UI." },
    ]}
  >
    <CoimStack spacing={4}>
      <div class="flex flex-wrap items-center gap-3">
        <CoimButton variant="contained" color="primary" onclick={() => toast.success("Primary trigger clicked")}>Contained</CoimButton>
        <CoimButton variant="outlined" color="secondary" onclick={() => toast.info("Outlined secondary clicked")}>Outlined</CoimButton>
        <CoimButton variant="pastel" color="success" onclick={() => toast.success("Pastel confirmation triggered")}>Pastel</CoimButton>
        <CoimButton variant="text" color="primary" onclick={() => toast.info("Text action triggered")}>Text</CoimButton>
        <CoimButton variant="contained" loading aria-label="Loading submission">Loading</CoimButton>
      </div>
      <div class="flex flex-wrap items-center gap-4">
        <CoimIconButton aria-label="Edit configuration" color="primary" variant="pastel" onclick={() => toast.info("Edit mode opened")}>
          <CiPen />
        </CoimIconButton>
        <CoimIconButton aria-label="Remove item" color="error" variant="outlined" onclick={() => toast.warning("Delete confirmation requested")}>
          <CiBinEmpty />
        </CoimIconButton>
        <CoimButtonGroup variant="outlined">
          <CoimButton
            variant={cadenceRange === "day" ? "contained" : "outlined"}
            onclick={() => {
              cadenceRange = "day";
              toast.info("Switched cadence: Day");
            }}
          >
            Day
          </CoimButton>
          <CoimButton
            variant={cadenceRange === "week" ? "contained" : "outlined"}
            onclick={() => {
              cadenceRange = "week";
              toast.info("Switched cadence: Week");
            }}
          >
            Week
          </CoimButton>
          <CoimButton
            variant={cadenceRange === "month" ? "contained" : "outlined"}
            onclick={() => {
              cadenceRange = "month";
              toast.info("Switched cadence: Month");
            }}
          >
            Month
          </CoimButton>
        </CoimButtonGroup>
        <CoimToggleButtonGroup type="single" bind:value={toggleView} color="primary">
          <CoimToggleButton value="list">List</CoimToggleButton>
          <CoimToggleButton value="grid">Grid</CoimToggleButton>
          <CoimToggleButton value="board">Board</CoimToggleButton>
        </CoimToggleButtonGroup>
        <CoimFab size="small" color="primary" aria-label="Create entry" onclick={() => toast.info("Quick create triggered")}>
          <CiPlus />
        </CoimFab>
      </div>
    </CoimStack>
  </ComponentDocCard>

  <ComponentDocCard
    id="coim-text-field"
    title="TextField, NumberField, Select &amp; Autocomplete"
    description="Labeled inputs wired to CoimFormControl with start/end adornments and combobox search."
    code={COMPONENT_CODE_EXAMPLES.textAndSelectInputs}
    propsDocs={[
      { name: "floatingLabel", type: "boolean", defaultValue: "true (outlined/filled)", description: "Enables animated top label treatment on outlined and filled inputs." },
      { name: "value", type: "string | number | string[] | null", kind: "bindable", description: "Two-way bound input/selection value." },
      { name: "freeSolo (Autocomplete)", type: "boolean", defaultValue: "false", description: "Allows custom text alongside filtered option suggestions." },
      { name: "multiple (Select)", type: "boolean", defaultValue: "false", description: "Switches value binding between string and string[]." },
    ]}
  >
    <CoimGrid container spacing={4}>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimTextField
          label="Workspace Name"
          bind:value={projectTitle}
          helperText="Visible to organization members"
          fullWidth
        >
          {#snippet startAdornment()}
            <CiSearch size={18} />
          {/snippet}
        </CoimTextField>
      </CoimGrid>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimNumberField
          label="License Seats"
          bind:value={seatLimit}
          min={1}
          max={500}
          step={5}
          fullWidth
        />
      </CoimGrid>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimSelect
          label="Subscription Plan"
          bind:value={tier}
          fullWidth
          options={[
            { value: "starter", label: "Starter Team" },
            { value: "pro", label: "Professional" },
            { value: "enterprise", label: "Enterprise SLA" },
          ]}
        />
      </CoimGrid>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimAutocomplete
          label="Primary Region"
          bind:value={region}
          fullWidth
          options={[
            { value: "apac", label: "Asia-Pacific (Singapore)" },
            { value: "eu", label: "Europe (Frankfurt)" },
            { value: "na", label: "North America (Oregon)" },
          ]}
        />
      </CoimGrid>
    </CoimGrid>
  </ComponentDocCard>

  <ComponentDocCard
    id="coim-selection"
    title="Checkboxes, Radios, Switches, Slider, Rating, OTP &amp; Dropzone"
    description="Binary, discrete, continuous, verification, and file-upload interactive controls."
    code={COMPONENT_CODE_EXAMPLES.selectionAndAdvancedInputs}
    propsDocs={[
      { name: "CoimCheckbox / CoimSwitch", type: "checked?: boolean, indeterminate?: boolean", kind: "bindable", description: "Two-way bound boolean selection controls." },
      { name: "CoimRadioGroup", type: "value?: string, row?: boolean", kind: "bindable", description: "Manages active radio choice horizontally or vertically." },
      { name: "CoimSlider / CoimRating", type: "value?: number | number[] / number | null, precision?", kind: "bindable", description: "Continuous slider and half-star rating selector." },
      { name: "CoimOtpInput / CoimDropzone", type: "value?, length? / files?, maxFiles?, onDrop?", description: "Multi-cell verification input and drag-and-drop file uploader." },
    ]}
  >
    <CoimGrid container spacing={4}>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimStack spacing={3}>
          <CoimFormControlLabel label="Receive deployment status alerts">
            <CoimCheckbox bind:checked={emailAlerts} />
          </CoimFormControlLabel>
          <CoimSwitch label="Enforce read-only audit snapshots" bind:checked={auditMode} />
          <CoimRadioGroup label="Billing Interval" row bind:value={billingCycle}>
            <CoimRadio value="monthly" label="Monthly" />
            <CoimRadio value="annual" label="Annual (Save 20%)" />
          </CoimRadioGroup>
          <div>
            <p class="text-text-secondary mb-1 text-sm">Alert Threshold: {threshold}%</p>
            <CoimSlider aria-label="CPU alert threshold" bind:value={threshold} valueLabelDisplay="auto" />
          </div>
        </CoimStack>
      </CoimGrid>

      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimStack spacing={4}>
          <div class="flex items-center gap-3">
            <CiBell size={18} />
            <span class="text-sm font-medium">Release Satisfaction:</span>
            <CoimRating aria-label="Release satisfaction" precision={0.5} bind:value={ratingValue} />
            <span class="text-text-secondary text-sm">({ratingValue ?? 0}/5)</span>
          </div>
          <div>
            <p class="text-text-secondary mb-1 text-sm">Two-Factor Verification Code</p>
            <CoimOtpInput bind:value={otpValue} length={6} />
          </div>
          <CoimDropzone
            bind:files={droppedFiles}
            maxFiles={3}
            title="Drop assets here or click to attach"
            subtitle="PNG, JPG, PDF up to 10 MB"
            onDrop={(accepted) => {
              if (accepted.length > 0) {
                toast.success(`Attached ${accepted.length} file(s)`);
              }
            }}
          />
        </CoimStack>
      </CoimGrid>
    </CoimGrid>
  </ComponentDocCard>

  <ComponentDocCard
    id="coim-input-playground"
    title="Interactive Playground: CoimButton &amp; CoimTextField"
    description="Toggle props live below to inspect rendered contrast, sizing, and synchronized Svelte 5 code."
    code={playgroundCode}
  >
    <div class="grid gap-4 md:grid-cols-2 md:items-center">
      <div class="flex flex-wrap items-center gap-3">
        <CoimButton
          variant={btnVariant}
          color={btnColor}
          size={btnSize}
          loading={btnLoading}
          disabled={btnDisabled}
          onclick={() => toast.success(`Clicked ${btnVariant} ${btnColor} button`)}
        >
          Save Workspace
        </CoimButton>
      </div>
      <div>
        <CoimTextField
          label="Notification Email"
          variant={tfVariant}
          size={tfSize}
          error={tfError}
          helperText={tfError ? "Enter a valid email address" : "Used for release & webhook alerts"}
          floatingLabel={tfFloating}
          multiline={tfMultiline}
          minRows={2}
          bind:value={tfValue}
          fullWidth
        />
      </div>
    </div>

    {#snippet controls()}
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <CoimSelect
          label="Button Variant"
          size="small"
          value={btnVariant}
          onValueChange={(v) => {
            if (typeof v === "string") btnVariant = v as CoimButtonVariant;
          }}
          options={[
            { value: "contained", label: "contained" },
            { value: "outlined", label: "outlined" },
            { value: "pastel", label: "pastel" },
            { value: "surface", label: "surface" },
            { value: "text", label: "text" },
          ]}
          fullWidth
        />
        <CoimSelect
          label="Button Color"
          size="small"
          value={btnColor}
          onValueChange={(v) => {
            if (typeof v === "string") btnColor = v as CoimColor;
          }}
          options={[
            { value: "primary", label: "primary" },
            { value: "secondary", label: "secondary" },
            { value: "success", label: "success" },
            { value: "warning", label: "warning" },
            { value: "error", label: "error" },
            { value: "info", label: "info" },
          ]}
          fullWidth
        />
        <CoimSelect
          label="Button Size"
          size="small"
          value={btnSize}
          onValueChange={(v) => {
            if (typeof v === "string") btnSize = v as CoimButtonSize;
          }}
          options={[
            { value: "tiny", label: "tiny" },
            { value: "small", label: "small" },
            { value: "medium", label: "medium" },
            { value: "large", label: "large" },
          ]}
          fullWidth
        />
        <CoimSelect
          label="TextField Variant"
          size="small"
          value={tfVariant}
          onValueChange={(v) => {
            if (typeof v === "string") tfVariant = v as CoimInputVariant;
          }}
          options={[
            { value: "outlined", label: "outlined" },
            { value: "filled", label: "filled" },
            { value: "standard", label: "standard" },
          ]}
          fullWidth
        />
        <CoimSelect
          label="TextField Size"
          size="small"
          value={tfSize}
          onValueChange={(v) => {
            if (typeof v === "string") tfSize = v as CoimInputSize;
          }}
          options={[
            { value: "small", label: "small" },
            { value: "medium", label: "medium" },
          ]}
          fullWidth
        />
        <div class="flex flex-wrap items-center gap-3">
          <CoimFormControlLabel label="Btn Loading"><CoimSwitch bind:checked={btnLoading} /></CoimFormControlLabel>
          <CoimFormControlLabel label="Btn Disabled"><CoimSwitch bind:checked={btnDisabled} /></CoimFormControlLabel>
          <CoimFormControlLabel label="Field Error"><CoimSwitch bind:checked={tfError} /></CoimFormControlLabel>
          <CoimFormControlLabel label="Floating Label"><CoimSwitch bind:checked={tfFloating} /></CoimFormControlLabel>
          <CoimFormControlLabel label="Multiline"><CoimSwitch bind:checked={tfMultiline} /></CoimFormControlLabel>
        </div>
      </div>
    {/snippet}
  </ComponentDocCard>

  <ComponentDocCard
    id="coim-input-primitives"
    title="Low-Level Input &amp; Form Control Primitives"
    description="Composable primitives (CoimInput, CoimInputAdornment, CoimNumberSpinner, CoimTextareaAutosize, CoimFormControl, CoimFormGroup, CoimFormLabel, CoimFormHelperText)."
    code={primitivesCode}
    apiGroups={primitivesApiGroups}
  >
    <CoimGrid container spacing={4}>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimFormControl error={primitiveError} fullWidth>
          <CoimFormLabel required>Custom Subdomain</CoimFormLabel>
          <CoimInput bind:value={rawDomain} variant="outlined" fullWidth>
            {#snippet startAdornment()}
              <CoimInputAdornment position="start">https://</CoimInputAdornment>
            {/snippet}
            {#snippet endAdornment()}
              <CoimInputAdornment position="end">.coimui.dev</CoimInputAdornment>
            {/snippet}
          </CoimInput>
          <CoimFormHelperText>
            {primitiveError ? "Subdomain is already reserved" : "Lowercase alphanumeric slug"}
          </CoimFormHelperText>
        </CoimFormControl>
      </CoimGrid>

      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimNumberSpinner
          label="Worker Replicas"
          bind:value={spinnerCount}
          min={1}
          max={16}
          step={1}
          fullWidth
        />
      </CoimGrid>

      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimStack spacing={1.5}>
          <CoimFormLabel for="autosize-notes">Release Notes (CoimTextareaAutosize)</CoimFormLabel>
          <CoimTextareaAutosize
            id="autosize-notes"
            bind:value={notesValue}
            minRows={2}
            maxRows={5}
            class="border-grey-200 bg-background-paper text-text-primary w-full rounded-md border p-2.5 text-sm outline-none focus:border-primary"
          />
        </CoimStack>
      </CoimGrid>

      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimFormGroup legend="Alert Channels (CoimFormGroup)" row>
          <CoimCheckbox label="Webhook" checked />
          <CoimCheckbox label="Email" />
          <CoimCheckbox label="SMS" />
        </CoimFormGroup>
      </CoimGrid>
    </CoimGrid>

    {#snippet controls()}
      <CoimFormControlLabel label="Simulate Subdomain Error">
        <CoimSwitch bind:checked={primitiveError} />
      </CoimFormControlLabel>
    {/snippet}
  </ComponentDocCard>
</CoimStack>
