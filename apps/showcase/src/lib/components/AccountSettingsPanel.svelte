<script lang="ts">
  import {
    CoimAvatar,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimGrid,
    CoimSelect,
    CoimStack,
    CoimSwitch,
    CoimTextField,
    toast,
  } from "@coimui/svelte";

  interface Props {
    sectionTitle?: string;
    initialName?: string;
    initialRole?: string;
    initialEmail?: string;
  }

  let {
    sectionTitle = "Workspace Account Settings",
    initialName = "Laura Ellis",
    initialRole = "Staff Design Systems Engineer",
    initialEmail = "laura.ellis@coimui.dev",
  }: Props = $props();

  let displayName = $state("");
  let handle = $state("@laura.ellis");
  let bio = $state("Building composable Svelte 5 interfaces and design tokens for multi-tenant consoles.");
  let organization = $state("CoimUI Design Systems");
  let department = $state("Core Architecture");
  let workRole = $state("");
  let timezone = $state("UTC+07:00");
  let email = $state("");
  let phone = $state("+1 (555) 234-8910");
  let location = $state("Singapore / Remote");
  let emailDigest = $state(true);
  let securityAlerts = $state(true);

  $effect.pre(() => {
    if (!displayName) displayName = initialName;
    if (!workRole) workRole = initialRole;
    if (!email) email = initialEmail;
  });

  function handleSave(event: SubmitEvent) {
    event.preventDefault();
    toast.success(`Saved settings for ${displayName}`);
  }
</script>

<form onsubmit={handleSave}>
  <CoimStack spacing={4}>
    <CoimCard>
      <CoimCardHeader
        title="Public Information"
        subheader={`Identity and visibility preferences for ${sectionTitle}`}
      />
      <CoimCardContent>
        <CoimStack spacing={4}>
          <div class="flex flex-wrap items-center gap-4">
            <CoimAvatar src="/images/avatars/avatar-3.jpg" alt={displayName} size="large" />
            <div>
              <p class="font-semibold">{displayName}</p>
              <p class="text-text-secondary text-sm">{handle} · {organization}</p>
            </div>
          </div>
          <CoimGrid container spacing={3}>
            <CoimGrid size={{ xs: 12, md: 6 }}>
              <CoimTextField label="Display Name" bind:value={displayName} fullWidth required />
            </CoimGrid>
            <CoimGrid size={{ xs: 12, md: 6 }}>
              <CoimTextField label="Handle" bind:value={handle} fullWidth />
            </CoimGrid>
            <CoimGrid size={{ xs: 12 }}>
              <CoimTextField label="Bio" bind:value={bio} multiline rows={3} fullWidth />
            </CoimGrid>
          </CoimGrid>
        </CoimStack>
      </CoimCardContent>
    </CoimCard>

    <CoimCard>
      <CoimCardHeader title="Work &amp; Team" subheader="Department metadata and scheduling timezone" />
      <CoimCardContent>
        <CoimGrid container spacing={3}>
          <CoimGrid size={{ xs: 12, md: 4 }}>
            <CoimTextField label="Organization" bind:value={organization} fullWidth />
          </CoimGrid>
          <CoimGrid size={{ xs: 12, md: 4 }}>
            <CoimTextField label="Department" bind:value={department} fullWidth />
          </CoimGrid>
          <CoimGrid size={{ xs: 12, md: 4 }}>
            <CoimTextField label="Role Title" bind:value={workRole} fullWidth />
          </CoimGrid>
          <CoimGrid size={{ xs: 12, md: 6 }}>
            <CoimSelect
              label="Primary Timezone"
              value={timezone}
              onValueChange={(next) => {
                if (typeof next === "string") timezone = next;
              }}
              options={[
                { value: "UTC+00:00", label: "UTC+00:00 (London)" },
                { value: "UTC-05:00", label: "UTC-05:00 (New York)" },
                { value: "UTC+07:00", label: "UTC+07:00 (Jakarta / Bangkok)" },
                { value: "UTC+09:00", label: "UTC+09:00 (Tokyo)" },
              ]}
              fullWidth
            />
          </CoimGrid>
        </CoimGrid>
      </CoimCardContent>
    </CoimCard>

    <CoimCard>
      <CoimCardHeader title="Contact &amp; Notifications" subheader="Direct channels and alert delivery" />
      <CoimCardContent>
        <CoimStack spacing={3}>
          <CoimGrid container spacing={3}>
            <CoimGrid size={{ xs: 12, md: 4 }}>
              <CoimTextField label="Work Email" type="email" bind:value={email} fullWidth required />
            </CoimGrid>
            <CoimGrid size={{ xs: 12, md: 4 }}>
              <CoimTextField label="Phone Number" bind:value={phone} fullWidth />
            </CoimGrid>
            <CoimGrid size={{ xs: 12, md: 4 }}>
              <CoimTextField label="Location" bind:value={location} fullWidth />
            </CoimGrid>
          </CoimGrid>

          <div class="flex flex-wrap gap-6">
            <CoimSwitch label="Weekly summary email" bind:checked={emailDigest} />
            <CoimSwitch label="Security audit alerts" bind:checked={securityAlerts} />
          </div>

          <div class="flex justify-end">
            <CoimButton type="submit" variant="contained">Save Settings</CoimButton>
          </div>
        </CoimStack>
      </CoimCardContent>
    </CoimCard>
  </CoimStack>
</form>
