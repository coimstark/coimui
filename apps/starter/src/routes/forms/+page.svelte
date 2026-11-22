<script lang="ts">
  import { untrack } from "svelte";
  import { superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import {
    CoimAlert,
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimCheckbox,
    CoimFormControlLabel,
    CoimSelect,
    CoimStack,
    CoimSwitch,
    CoimTextField,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import { starterI18n } from "#lib/i18n.svelte.ts";
  import { profileSchema } from "#lib/schemas/profile.ts";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const { form, errors, message, submitting, enhance } = superForm(
    untrack(() => data.form),
    {
      validators: zod4Client(profileSchema),
      onUpdated: ({ form: updated }) => {
        if (updated.valid && updated.message) {
          toast.success(String(updated.message));
        }
      },
    },
  );
</script>

<svelte:head>
  <title>CoimUI Starter — {starterI18n.t("nav-forms")}</title>
</svelte:head>

<CoimStack spacing={6} class="max-w-2xl">
  <div>
    <CoimBreadcrumbs items={[{ label: starterI18n.t("nav-overview"), href: "/" }, { label: starterI18n.t("nav-forms") }]} />
    <CoimTypography variant="h1" class="mt-2">{starterI18n.t("nav-forms")}</CoimTypography>
    <CoimTypography variant="body1" class="text-text-secondary mt-1">
      Progressive-enhancement form backed by Zod 4 and SvelteKit Superforms.
    </CoimTypography>
  </div>

  {#if $message}
    <CoimAlert severity="success" title="Submission Confirmed">
      {$message}
    </CoimAlert>
  {/if}

  <CoimCard>
    <CoimCardHeader title="Member Onboarding" subheader="All inputs link error state via aria-invalid and helper text" />
    <CoimCardContent>
      <form method="POST" use:enhance class="flex flex-col gap-4">
        <CoimTextField
          name="fullName"
          label="Full Name"
          bind:value={$form.fullName}
          error={Boolean($errors.fullName?.length)}
          helperText={$errors.fullName?.[0]}
          required
          fullWidth
        />

        <CoimTextField
          name="email"
          type="email"
          label="Work Email"
          bind:value={$form.email}
          error={Boolean($errors.email?.length)}
          helperText={$errors.email?.[0]}
          required
          fullWidth
        />

        <input type="hidden" name="role" value={$form.role} />
        <CoimSelect
          label="Team Role"
          value={$form.role}
          onValueChange={(next) => {
            $form.role = next as "developer" | "designer" | "manager" | "analyst";
          }}
          options={[
            { value: "developer", label: "Developer" },
            { value: "designer", label: "Product Designer" },
            { value: "manager", label: "Engineering Manager" },
            { value: "analyst", label: "Data Analyst" },
          ]}
          fullWidth
        />

        <input type="hidden" name="weeklyDigest" value={$form.weeklyDigest ? "on" : ""} />
        <CoimFormControlLabel label="Receive weekly workspace digest">
          <CoimSwitch
            checked={$form.weeklyDigest}
            onCheckedChange={(checked) => {
              $form.weeklyDigest = checked;
            }}
          />
        </CoimFormControlLabel>

        <div>
          <input type="hidden" name="acceptTerms" value={$form.acceptTerms ? "on" : ""} />
          <CoimFormControlLabel label="I accept the workspace acceptable-use policy">
            <CoimCheckbox
              checked={$form.acceptTerms}
              onCheckedChange={(checked) => {
                $form.acceptTerms = checked;
              }}
            />
          </CoimFormControlLabel>
          {#if $errors.acceptTerms?.[0]}
            <p role="alert" class="text-error mt-1 text-sm">{$errors.acceptTerms[0]}</p>
          {/if}
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <CoimButton type="submit" variant="contained" loading={$submitting}>
            Save Profile
          </CoimButton>
        </div>
      </form>
    </CoimCardContent>
  </CoimCard>
</CoimStack>
