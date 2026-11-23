<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimDialog,
    CoimDialogActions,
    CoimDialogContent,
    CoimDialogTitle,
    CoimStack,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import { CiCalendar, CiPlus } from "@coimui/svelte/icons";
  import { CoimEventCalendar } from "@coimui/svelte/plugins";
  import { calendarStore, type ShowcaseCalendarEvent } from "#lib/apps/calendar.svelte.ts";

  let category = $state<"All" | "Engineering" | "Design" | "Release">("All");
  let view = $state<"dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek">("dayGridMonth");
  let selectedEvent = $state<ShowcaseCalendarEvent | null>(null);

  const visibleEvents = $derived(
    category === "All"
      ? calendarStore.events
      : calendarStore.events.filter((e) => e.category === category),
  );
</script>

<svelte:head>
  <title>CoimUI Showcase — Calendar · Home</title>
</svelte:head>

<CoimStack spacing={5}>
  <div class="flex flex-wrap items-start justify-between gap-4">
    <div>
      <CoimBreadcrumbs
        items={[
          { label: "Applications", href: "/apps" },
          { label: "Calendar", href: "/apps/calendar" },
          { label: "Schedule Home" },
        ]}
      />
      <CoimTypography variant="h1" class="mt-2">Team Schedule Workspace</CoimTypography>
      <p class="text-text-secondary mt-1 text-sm">
        Filter team schedules by category, switch calendar views, inspect event details, or add a new event.
      </p>
    </div>

    <div class="flex flex-wrap gap-2">
      <CoimButton href="/apps/calendar" variant="outlined" size="small">
        {#snippet startIcon()}
          <CiCalendar size={16} />
        {/snippet}
        Overview View
      </CoimButton>
      <CoimButton href="/apps/calendar/add-event" variant="contained" size="small">
        {#snippet startIcon()}
          <CiPlus size={16} />
        {/snippet}
        Add Event
      </CoimButton>
    </div>
  </div>

  <div class="flex flex-wrap items-center justify-between gap-3">
    <div class="flex flex-wrap gap-2">
      {#each (["All", "Engineering", "Design", "Release"] as const) as cat (cat)}
        <CoimButton
          size="small"
          variant={category === cat ? "contained" : "outlined"}
          onclick={() => (category = cat)}
        >
          {cat}
        </CoimButton>
      {/each}
    </div>

    <div class="flex flex-wrap gap-1.5">
      {#each ([
        { id: "dayGridMonth", label: "Month" },
        { id: "timeGridWeek", label: "Week" },
        { id: "timeGridDay", label: "Day" },
        { id: "listWeek", label: "List" },
      ] as const) as mode (mode.id)}
        <CoimButton
          size="tiny"
          variant={view === mode.id ? "pastel" : "outlined"}
          onclick={() => (view = mode.id)}
        >
          {mode.label}
        </CoimButton>
      {/each}
    </div>
  </div>

  <CoimCard>
    <CoimCardHeader title="Interactive Schedule" subheader={`${visibleEvents.length} visible event(s)`} />
    <CoimCardContent>
      <CoimEventCalendar
        events={visibleEvents}
        bind:view
        date="2026-11-23"
        onEventClick={(eventId) => {
          selectedEvent = calendarStore.events.find((e) => e.id === eventId) ?? null;
        }}
      />
    </CoimCardContent>
  </CoimCard>
</CoimStack>

<CoimDialog
  open={Boolean(selectedEvent)}
  onClose={() => (selectedEvent = null)}
  maxWidth="sm"
  fullWidth
>
  {#if selectedEvent}
    <CoimDialogTitle>{selectedEvent.title}</CoimDialogTitle>
    <CoimDialogContent>
      <CoimStack spacing={2}>
        <CoimChip label={selectedEvent.category} color="primary" size="small" variant="pastel" />
        <p class="text-sm"><strong>Start:</strong> {selectedEvent.start}</p>
        <p class="text-sm"><strong>End:</strong> {selectedEvent.end}</p>
        <p class="text-sm"><strong>Location:</strong> {selectedEvent.location ?? "Workspace"}</p>
        <p class="text-sm"><strong>Participants:</strong> {selectedEvent.participants.join(", ")}</p>
        <p class="text-sm"><strong>Reminder:</strong> {selectedEvent.notifyMinutes} minutes prior</p>
      </CoimStack>
    </CoimDialogContent>
    <CoimDialogActions>
      <CoimButton
        variant="text"
        color="error"
        onclick={() => {
          calendarStore.deleteEvent(selectedEvent!.id);
          selectedEvent = null;
          toast.info("Deleted event");
        }}
      >
        Remove Event
      </CoimButton>
      <CoimButton variant="contained" onclick={() => (selectedEvent = null)}>Close</CoimButton>
    </CoimDialogActions>
  {/if}
</CoimDialog>
