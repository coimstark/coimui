<script lang="ts">
  import {
    CoimAlert,
    CoimAlertTitle,
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimCheckbox,
    CoimFormControlLabel,
    CoimGrid,
    CoimNumberField,
    CoimRadio,
    CoimRadioGroup,
    CoimSelect,
    CoimStack,
    CoimTextField,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import { showcaseFormSchema } from "#lib/schemas/showcase-form.ts";

  interface ShowcaseFormValues {
    fullName: string;
    email: string;
    organization: string;
    seatCount: number;
    deploymentModel: "cloud" | "dedicated" | "self-hosted";
    releaseWindow: "immediate" | "next-sprint" | "quarterly";
    notes: string;
    agreeTerms: boolean;
  }

  type FieldErrors = Partial<Record<keyof ShowcaseFormValues, string>>;

  let form = $state<ShowcaseFormValues>({
    fullName: "Laura Ellis",
    email: "laura.ellis@coimui.dev",
    organization: "Northstar Engineering",
    seatCount: 45,
    deploymentModel: "cloud",
    releaseWindow: "next-sprint",
    notes: "",
    agreeTerms: true,
  });

  let errors = $state<FieldErrors>({});
  let message = $state<string | null>(null);
  let submitting = $state(false);

  function mapIssuesToErrors(issues: readonly { path: PropertyKey[]; message: string }[]): FieldErrors {
    const next: FieldErrors = {};
    for (const issue of issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in next)) {
        next[key as keyof ShowcaseFormValues] = issue.message;
      }
    }
    return next;
  }

  function clearError(field: keyof ShowcaseFormValues) {
    if (!errors[field]) return;
    const { [field]: _, ...rest } = errors;
    errors = rest;
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    submitting = true;
    try {
      const parsed = showcaseFormSchema.safeParse(form);
      if (!parsed.success) {
        errors = mapIssuesToErrors(parsed.error.issues);
        message = null;
        return;
      }

      errors = {};
      form = { ...form, ...parsed.data };
      const acceptedMessage = `Provisioning request queued for ${parsed.data.organization} (${parsed.data.seatCount} seats).`;
      message = acceptedMessage;
      toast.success(acceptedMessage);
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — Forms &amp; Validation</title>
</svelte:head>

<CoimStack spacing={6} class="max-w-3xl">
  <div>
    <CoimBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Forms & Validation" }]} />
    <CoimTypography variant="h1" class="mt-2">Forms &amp; Schema Validation</CoimTypography>
    <p class="text-text-secondary mt-1">
      Client-side Zod 4 schema validation with interactive error recovery and accessible live status announcements.
    </p>
  </div>

  {#if message}
    <CoimAlert severity="success" role="status" aria-live="polite">
      <CoimAlertTitle>Provisioning Request Accepted</CoimAlertTitle>
      {message}
    </CoimAlert>
  {/if}

  <CoimCard>
    <CoimCardHeader
      title="Enterprise Workspace Provisioning"
      subheader="Demonstrates native autocomplete hints, aria-invalid synchronization, and custom constraints"
    />
    <CoimCardContent>
      <form onsubmit={handleSubmit} novalidate class="flex flex-col gap-5">
        <CoimGrid container spacing={4}>
          <CoimGrid size={{ xs: 12, sm: 6 }}>
            <CoimTextField
              name="fullName"
              label="Full Name"
              autocomplete="name"
              bind:value={form.fullName}
              oninput={() => clearError("fullName")}
              error={Boolean(errors.fullName)}
              helperText={errors.fullName ?? "Primary administrative contact"}
              required
              fullWidth
            />
          </CoimGrid>

          <CoimGrid size={{ xs: 12, sm: 6 }}>
            <CoimTextField
              name="email"
              type="email"
              label="Work Email"
              autocomplete="email"
              bind:value={form.email}
              oninput={() => clearError("email")}
              error={Boolean(errors.email)}
              helperText={errors.email ?? "Used for release announcements"}
              required
              fullWidth
            />
          </CoimGrid>

          <CoimGrid size={{ xs: 12, sm: 8 }}>
            <CoimTextField
              name="organization"
              label="Organization"
              autocomplete="organization"
              bind:value={form.organization}
              oninput={() => clearError("organization")}
              error={Boolean(errors.organization)}
              helperText={errors.organization}
              required
              fullWidth
            />
          </CoimGrid>

          <CoimGrid size={{ xs: 12, sm: 4 }}>
            <CoimNumberField
              label="Seat Allocation"
              bind:value={form.seatCount}
              min={1}
              max={5000}
              error={Boolean(errors.seatCount)}
              fullWidth
            />
            {#if errors.seatCount}
              <p class="text-error mt-1 text-xs">{errors.seatCount}</p>
            {/if}
          </CoimGrid>
        </CoimGrid>

        <CoimRadioGroup
          label="Deployment Topology"
          row
          value={form.deploymentModel}
          onValueChange={(next) => {
            form.deploymentModel = next as ShowcaseFormValues["deploymentModel"];
          }}
        >
          <CoimRadio value="cloud" label="Managed Cloud" />
          <CoimRadio value="dedicated" label="Dedicated VPC" />
          <CoimRadio value="self-hosted" label="Self-Hosted Cluster" />
        </CoimRadioGroup>

        <CoimSelect
          label="Rollout Cadence"
          value={form.releaseWindow}
          onValueChange={(next) => {
            form.releaseWindow = next as ShowcaseFormValues["releaseWindow"];
          }}
          options={[
            { value: "immediate", label: "Immediate Rollout" },
            { value: "next-sprint", label: "Next Sprint Cycle" },
            { value: "quarterly", label: "Quarterly Maintenance Window" },
          ]}
          fullWidth
        />

        <CoimTextField
          name="notes"
          label="Compliance / Network Notes"
          multiline
          rows={3}
          bind:value={form.notes}
          oninput={() => clearError("notes")}
          error={Boolean(errors.notes)}
          helperText={errors.notes ?? "Optional security or region constraints"}
          fullWidth
        />

        <div>
          <CoimFormControlLabel label="I confirm organization billing authorization">
            <CoimCheckbox
              bind:checked={form.agreeTerms}
              onCheckedChange={() => clearError("agreeTerms")}
            />
          </CoimFormControlLabel>
          {#if errors.agreeTerms}
            <p class="text-error mt-1 text-xs">{errors.agreeTerms}</p>
          {/if}
        </div>

        <div class="flex flex-wrap items-center gap-3 pt-2">
          <CoimButton type="submit" variant="contained" loading={submitting}>
            Submit Provisioning Request
          </CoimButton>
          <CoimButton
            type="button"
            variant="outlined"
            onclick={() => {
              form.notes = "";
              clearError("notes");
              toast.info("Cleared optional notes");
            }}
          >
            Reset Notes
          </CoimButton>
        </div>
      </form>
    </CoimCardContent>
  </CoimCard>
</CoimStack>
