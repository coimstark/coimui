<script lang="ts">
  import {
    CoimAvatar,
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimList,
    CoimListItem,
    CoimListItemText,
    CoimStack,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — Member Profile</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Pages", href: "/" }, { label: "Profile" }]} />
    <CoimTypography variant="h1" class="mt-2">Member Profile</CoimTypography>
  </div>

  <CoimCard>
    <CoimCardContent class="flex flex-wrap items-center justify-between gap-4 p-6">
      <div class="flex items-center gap-4">
        <CoimAvatar initials="LE" alt="Laura Ellis" size="large" color="primary" />
        <div>
          <CoimTypography variant="h2" class="text-xl">Laura Ellis</CoimTypography>
          <p class="text-text-secondary text-sm">Staff Design Systems Architect · Release Lead</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <CoimChip label="Admin" size="small" color="primary" variant="pastel" />
            <CoimChip label="Verified MFA" size="small" color="success" variant="pastel" />
          </div>
        </div>
      </div>
      <CoimButton variant="contained" onclick={() => toast.info("Profile exported cleanly")}>
        Export Activity Summary
      </CoimButton>
    </CoimCardContent>
  </CoimCard>

  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, md: 6 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="Workspace Ownership" />
        <CoimCardContent>
          <CoimList>
            <CoimListItem>
              <CoimListItemText primary="@coimui/svelte" secondary="Primary maintainer · Publish rights" />
            </CoimListItem>
            <CoimListItem>
              <CoimListItemText primary="@coimui/showcase" secondary="Documentation & visual parity gatekeeper" />
            </CoimListItem>
          </CoimList>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>
    <CoimGrid size={{ xs: 12, md: 6 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="Security & Sessions" />
        <CoimCardContent>
          <CoimList>
            <CoimListItem>
              <CoimListItemText primary="macOS Workstation · Singapore" secondary="Active session · WebAuthn verified" />
            </CoimListItem>
            <CoimListItem>
              <CoimListItemText primary="CI Release Automation Token" secondary="Scoped to read-only audit artifacts" />
            </CoimListItem>
          </CoimList>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>
  </CoimGrid>
</CoimStack>
