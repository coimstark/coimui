<script lang="ts">
  import { cn } from "../utilities/utils.js";
  import type { CoimCalendarEvent } from "./types.js";

  type CalendarView = "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek";

  interface Props {
    events: CoimCalendarEvent[];
    view?: CalendarView;
    date?: string;
    editable?: boolean;
    selectable?: boolean;
    onEventClick?: (eventId: string) => void;
    onDateClick?: (dateStr: string) => void;
    ariaLabel?: string;
    class?: string;
  }

  let {
    events = [],
    view = $bindable<CalendarView>("dayGridMonth"),
    date,
    editable = false,
    selectable = false,
    onEventClick,
    onDateClick,
    ariaLabel = "Event calendar",
    class: className = "",
  }: Props = $props();

  let mountEl = $state<HTMLDivElement | null>(null);
  let ecInstance: {
    setOption: (name: string, value: unknown) => void;
    getOption: (name: string) => unknown;
  } | null = null;
  let mounted = $state(false);

  $effect(() => {
    if (typeof window === "undefined" || !mountEl) return;
    let cancelled = false;
    let activeCalendar: unknown = null;
    let destroyFn: ((cal: never) => Promise<void>) | null = null;

    void (async () => {
      await import("@event-calendar/core/index.css");
      const ec = await import("@event-calendar/core");
      if (cancelled || !mountEl) return;
      mountEl.innerHTML = "";

      const plugins = [ec.DayGrid, ec.TimeGrid, ec.List, ec.Interaction];
      const options = {
        view,
        date,
        editable,
        selectable,
        events: events.map((ev) => ({
          id: ev.id,
          title: ev.title,
          start: ev.start,
          end: ev.end,
          allDay: ev.allDay,
          backgroundColor: ev.backgroundColor,
          extendedProps: ev.extendedProps,
        })),
        eventClick: (info: { event: { id: string | number } }) => {
          onEventClick?.(String(info.event.id));
        },
        dateClick: (info: { dateStr: string }) => {
          onDateClick?.(info.dateStr);
        },
      };

      let calendar: unknown = null;
      if (typeof ec.createCalendar === "function") {
        destroyFn = ec.destroyCalendar as unknown as (cal: never) => Promise<void>;
        calendar = ec.createCalendar(mountEl, plugins, options);
      } else if ("Calendar" in ec && ec.Calendar) {
        const { mount, unmount } = await import("svelte");
        if (cancelled || !mountEl) return;
        destroyFn = unmount as unknown as (cal: never) => Promise<void>;
        calendar = mount(ec.Calendar as never, {
          target: mountEl,
          props: { plugins, options } as never,
        });
      }
      activeCalendar = calendar;
      ecInstance = calendar as unknown as typeof ecInstance;
      mounted = true;
    })();

    return () => {
      cancelled = true;
      ecInstance = null;
      mounted = false;
      if (activeCalendar && destroyFn) {
        void destroyFn(activeCalendar as never);
      }
    };
  });

  $effect(() => {
    if (!ecInstance) return;
    ecInstance.setOption("view", view);
  });

  $effect(() => {
    if (!ecInstance) return;
    ecInstance.setOption("events", events);
  });
</script>

<div class={cn("coim-event-calendar", className)} role="region" aria-label={ariaLabel}>
  <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
    <span class="font-heading text-base font-semibold">{ariaLabel}</span>
    <div class="flex items-center gap-1" role="group" aria-label="Calendar view">
      {#each [
        { id: "dayGridMonth", label: "Month" },
        { id: "timeGridWeek", label: "Week" },
        { id: "timeGridDay", label: "Day" },
        { id: "listWeek", label: "List" },
      ] as opt (opt.id)}
        <button
          type="button"
          aria-pressed={view === opt.id}
          class={cn(
            "rounded px-2.5 py-1 text-xs font-medium",
            view === opt.id
              ? "bg-primary text-text-contrast"
              : "bg-grey-25 hover:bg-grey-50 text-text-primary",
          )}
          onclick={() => {
            view = opt.id as CalendarView;
          }}
        >
          {opt.label}
        </button>
      {/each}
    </div>
  </div>

  <div bind:this={mountEl}>
    {#if !mounted && events.length > 0}
      <ul class="space-y-1.5 text-sm">
        {#each events as ev (ev.id)}
          <li class="border-grey-100 rounded border px-3 py-2">
            <span class="font-medium">{ev.title}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
