<script lang="ts">
  import {
    CoimAutocomplete,
    CoimBreadcrumbs,
    CoimButton,
    CoimButtonGroup,
    CoimCheckbox,
    CoimDropzone,
    CoimFab,
    CoimFormControlLabel,
    CoimGrid,
    CoimIconButton,
    CoimNumberField,
    CoimOtpInput,
    CoimRadio,
    CoimRadioGroup,
    CoimRating,
    CoimSelect,
    CoimSlider,
    CoimStack,
    CoimSwitch,
    CoimTextField,
    CoimToggleButton,
    CoimToggleButtonGroup,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import { CiBell, CiBinEmpty, CiPen, CiPlus, CiSearch } from "@coimui/svelte/icons";
  import ComponentDocCard from "#lib/components/ComponentDocCard.svelte";
  import { COMPONENT_CODE_EXAMPLES } from "#lib/examples/component-docs.ts";

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
</script>

<svelte:head>
  <title>CoimUI Showcase — Inputs & Controls</title>
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
    title="Buttons, Groups, FAB & Toggle Groups"
    description="Standard, pastel, outlined, and contained buttons plus compact icon controls."
    code={COMPONENT_CODE_EXAMPLES.buttons}
    propsDocs={[
      { name: "variant", type: '"contained" | "outlined" | "text" | "pastel" | "surface"', defaultValue: '"text"', description: "Visual emphasis level across button families." },
      { name: "loading", type: "boolean", defaultValue: "false", description: "Renders inline indicator while preserving layout geometry." },
      { name: "CoimToggleButtonGroup", type: 'type: "single" | "multiple"', defaultValue: '"single"', description: "Roving focus radio/toggle semantics via Bits UI." },
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
    title="TextField, NumberField, Select & Autocomplete"
    description="Labeled inputs wired to CoimFormControl with start/end adornments and combobox search."
    code={COMPONENT_CODE_EXAMPLES.textAndSelectInputs}
    propsDocs={[
      { name: "floatingLabel", type: "boolean", description: "Enables animated top label treatment on outlined and filled inputs." },
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
    title="Checkboxes, Radios, Switches, Slider, Rating, OTP & Dropzone"
    description="Binary, discrete, continuous, verification, and file-upload interactive controls."
    code={COMPONENT_CODE_EXAMPLES.selectionAndAdvancedInputs}
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
</CoimStack>
