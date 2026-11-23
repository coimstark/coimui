<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimCheckbox,
    CoimFormControlLabel,
    CoimGrid,
    CoimSelect,
    CoimStack,
    CoimTextField,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import { calendarStore } from "#lib/apps/calendar.svelte.ts";

  let title = $state("");
  let category = $state<"Engineering" | "Design" | "Release">("Engineering");
  let start = $state("2026-11-27T10:00");
  let end = $state("2026-11-27T11:00");
  let location = $state("Design Sync Room");
  let notifyMinutes = $state("15");
  let inviteLaura = $state(true);
  let inviteMateo = $state(true);
  let inviteSora = $state(false);

  function handleCreate(event: SubmitEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    const participants = [
      inviteLaura ? "Laura Ellis" : null,
      inviteMateo ? "Mateo Khan" : null,
      inviteSora ? "Sora Park" : null,
    ].filter((x): x is string => Boolean(x));

    calendarStore.addEvent({
      title: title.trim(),
      category,
      start: start.length === 16 ? `${start}:00` : start,
      end: end.length === 16 ? `${end}:00` : end,
      location: location.trim(),
      participants: participants.length ? participants : ["Laura Ellis"],
      notifyMinutes: Number(notifyMinutes) || 15,
    });
    toast.success(`Scheduled "${title.trim()}"`);
    void goto("/apps/calendar/home");
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — Calendar · Add Event</title>
</svelte:head>

<CoimStack spacing={5}>
  <div>
    <CoimBreadcrumbs
      items={[
        { label: "Applications", href: "/apps" },
        { label: "Calendar", href: "/apps/calendar/home" },
        { label: "Add Event" },
      ]}
    />
    <CoimTypography variant="h1" class="mt-2">Schedule New Event</CoimTypography>
    <p class="text-text-secondary mt-1 text-sm">
      Configure event details, invited teammates, and notification lead times.
    </p>
  </div>

  <form onsubmit={handleCreate}>
    <CoimGrid container spacing={4}>
      <CoimGrid size={{ xs: 12, lg: 7 }}>
        <CoimCard>
          <CoimCardHeader title="Event Details" />
          <CoimCardContent>
            <CoimStack spacing={3}>
              <CoimTextField label="Event Title" placeholder="e.g. Accessibility Sign-Off" bind:value={title} required fullWidth />
              <CoimSelect
                label="Category"
                value={category}
                onValueChange={(v) => {
                  if (v === "Engineering" || v === "Design" || v === "Release") category = v;
                }}
                options={[
                  { value: "Engineering", label: "Engineering" },
                  { value: "Design", label: "Design" },
                  { value: "Release", label: "Release" },
                ]}
                fullWidth
              />
              <CoimGrid container spacing={3}>
                <CoimGrid size={{ xs: 12, sm: 6 }}>
                  <CoimTextField label="Start Time" type="datetime-local" bind:value={start} required fullWidth />
                </CoimGrid>
                <CoimGrid size={{ xs: 12, sm: 6 }}>
                  <CoimTextField label="End Time" type="datetime-local" bind:value={end} required fullWidth />
                </CoimGrid>
              </CoimGrid>
              <CoimTextField label="Location or Channel" bind:value={location} fullWidth />
            </CoimStack>
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>

      <CoimGrid size={{ xs: 12, lg: 5 }}>
        <CoimStack spacing={4}>
          <CoimCard>
            <CoimCardHeader title="Participants" />
            <CoimCardContent>
              <CoimStack spacing={1.5}>
                <CoimFormControlLabel label="Laura Ellis (Engineering)">
                  <CoimCheckbox bind:checked={inviteLaura} />
                </CoimFormControlLabel>
                <CoimFormControlLabel label="Mateo Khan (Release)">
                  <CoimCheckbox bind:checked={inviteMateo} />
                </CoimFormControlLabel>
                <CoimFormControlLabel label="Sora Park (Design)">
                  <CoimCheckbox bind:checked={inviteSora} />
                </CoimFormControlLabel>
              </CoimStack>
            </CoimCardContent>
          </CoimCard>

          <CoimCard>
            <CoimCardHeader title="Notification Rules" />
            <CoimCardContent>
              <CoimStack spacing={3}>
                <CoimSelect
                  label="Reminder Lead Time"
                  value={notifyMinutes}
                  onValueChange={(v) => {
                    if (typeof v === "string") notifyMinutes = v;
                  }}
                  options={[
                    { value: "5", label: "5 minutes before" },
                    { value: "15", label: "15 minutes before" },
                    { value: "30", label: "30 minutes before" },
                    { value: "60", label: "1 hour before" },
                  ]}
                  fullWidth
                />
                <div class="flex gap-2">
                  <CoimButton type="submit" variant="contained" fullWidth>Save Event</CoimButton>
                  <CoimButton href="/apps/calendar/home" variant="outlined">Cancel</CoimButton>
                </div>
              </CoimStack>
            </CoimCardContent>
          </CoimCard>
        </CoimStack>
      </CoimGrid>
    </CoimGrid>
  </form>
</CoimStack>
