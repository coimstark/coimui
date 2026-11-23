<script lang="ts">
  import { CoimBreadcrumbs, CoimStack, CoimTypography } from "@coimui/svelte";
  import AccountSettingsPanel from "#lib/components/AccountSettingsPanel.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — Account Settings</title>
</svelte:head>

<CoimStack spacing={5}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Settings" }]} />
    <CoimTypography variant="h1" class="mt-2">Workspace Account Settings</CoimTypography>
    <p class="text-text-secondary mt-1 text-sm">
      Manage public profile info, department metadata, contact details, and alert rules.
    </p>
  </div>

  <AccountSettingsPanel sectionTitle="CoimUI Showcase" />
</CoimStack>
