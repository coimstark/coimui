<script lang="ts">
  import { untrack } from "svelte";
  import { superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
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
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const { form, errors, message, submitting, enhance } = superForm(
    untrack(() => data.form),
    {
      validators: zod4Client(showcaseFormSchema),
      onUpdated: ({ form: updated }) => {
        if (updated.valid && updated.message) {
          toast.success(String(updated.message));
        }
      },
    },
  );
</script>

<svelte:head>
  <title>CoimUI Showcase — Forms & Validation</title>
</svelte:head>

<CoimStack spacing={6} class="max-w-3xl">
  <div>
    <CoimBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Forms & Validation" }]} />
    <CoimTypography variant="h1" class="mt-2">Forms &amp; Schema Validation</CoimTypography>
    <p class="text-text-secondary mt-1">
      Server actions + progressive client enhancement wired through Zod 4, SvelteKit Superforms, and accessible error announcements.
    </p>
  </div>

  {#if $message}
    <CoimAlert severity="success" role="status" aria-live="polite">
      <CoimAlertTitle>Provisioning Request Accepted</CoimAlertTitle>
      {$message}
    </CoimAlert>
  {/if}

  <CoimCard>
    <CoimCardHeader
      title="Enterprise Workspace Provisioning"
      subheader="Demonstrates native autocomplete hints, aria-invalid synchronization, and custom constraints"
    />
    <CoimCardContent>
      <form method="POST" use:enhance class="flex flex-col gap-5">
        <CoimGrid container spacing={4}>
          <CoimGrid size={{ xs: 12, sm: 6 }}>
            <CoimTextField
              name="fullName"
              label="Full Name"
              autocomplete="name"
              bind:value={$form.fullName}
              error={Boolean($errors.fullName?.length)}
              helperText={$errors.fullName?.[0] ?? "Primary administrative contact"}
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
              bind:value={$form.email}
              error={Boolean($errors.email?.length)}
              helperText={$errors.email?.[0] ?? "Used for release announcements"}
              required
              fullWidth
            />
          </CoimGrid>

          <CoimGrid size={{ xs: 12, sm: 8 }}>
            <CoimTextField
              name="organization"
              label="Organization"
              autocomplete="organization"
              bind:value={$form.organization}
              error={Boolean($errors.organization?.length)}
              helperText={$errors.organization?.[0]}
              required
              fullWidth
            />
          </CoimGrid>

          <CoimGrid size={{ xs: 12, sm: 4 }}>
            <input type="hidden" name="seatCount" value={$form.seatCount} />
            <CoimNumberField
              label="Seat Allocation"
              bind:value={$form.seatCount}
              min={1}
              max={5000}
              error={Boolean($errors.seatCount?.length)}
              fullWidth
            />
            {#if $errors.seatCount?.[0]}
              <p class="text-error mt-1 text-xs">{$errors.seatCount[0]}</p>
            {/if}
          </CoimGrid>
        </CoimGrid>

        <input type="hidden" name="deploymentModel" value={$form.deploymentModel} />
        <CoimRadioGroup
          label="Deployment Topology"
          row
          value={$form.deploymentModel}
          onValueChange={(next) => {
            $form.deploymentModel = next as "cloud" | "dedicated" | "self-hosted";
          }}
        >
          <CoimRadio value="cloud" label="Managed Cloud" />
          <CoimRadio value="dedicated" label="Dedicated VPC" />
          <CoimRadio value="self-hosted" label="Self-Hosted Cluster" />
        </CoimRadioGroup>

        <input type="hidden" name="releaseWindow" value={$form.releaseWindow} />
        <CoimSelect
          label="Rollout Cadence"
          value={$form.releaseWindow}
          onValueChange={(next) => {
            $form.releaseWindow = next as "immediate" | "next-sprint" | "quarterly";
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
          bind:value={$form.notes}
          error={Boolean($errors.notes?.length)}
          helperText={$errors.notes?.[0] ?? "Optional security or region constraints"}
          fullWidth
        />

        <div>
          <input type="hidden" name="agreeTerms" value={$form.agreeTerms ? "on" : ""} />
          <CoimFormControlLabel label="I confirm organization billing authorization">
            <CoimCheckbox bind:checked={$form.agreeTerms} />
          </CoimFormControlLabel>
          {#if $errors.agreeTerms?.[0]}
            <p class="text-error mt-1 text-xs">{$errors.agreeTerms[0]}</p>
          {/if}
        </div>

        <div class="flex flex-wrap items-center gap-3 pt-2">
          <CoimButton type="submit" variant="contained" loading={$submitting}>
            Submit Provisioning Request
          </CoimButton>
          <CoimButton
            type="button"
            variant="outlined"
            onclick={() => {
              $form.notes = "";
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
