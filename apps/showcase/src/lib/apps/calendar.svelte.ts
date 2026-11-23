import type { CoimCalendarEvent } from "@coimui/svelte/plugins";

export interface ShowcaseCalendarEvent extends CoimCalendarEvent {
  category: "Engineering" | "Design" | "Release";
  location?: string;
  participants: string[];
  notifyMinutes: number;
}

const initialEvents: ShowcaseCalendarEvent[] = [
  {
    id: "cal-1",
    title: "Design Token Sync",
    start: "2026-11-23T09:30:00",
    end: "2026-11-23T10:30:00",
    category: "Design",
    location: "Room B / Meet",
    participants: ["Laura Ellis", "Sora Park"],
    notifyMinutes: 15,
  },
  {
    id: "cal-2",
    title: "DataGrid Pivot QA Review",
    start: "2026-11-24T14:00:00",
    end: "2026-11-24T15:00:00",
    category: "Engineering",
    location: "Core Channel",
    participants: ["Laura Ellis", "Mateo Khan"],
    notifyMinutes: 30,
  },
  {
    id: "cal-3",
    title: "Release Gate Walkthrough",
    start: "2026-11-26T11:00:00",
    end: "2026-11-26T12:00:00",
    category: "Release",
    location: "Broadcast Bridge",
    participants: ["Laura Ellis", "Mateo Khan", "Sora Park"],
    notifyMinutes: 60,
  },
];

class CalendarStore {
  events = $state<ShowcaseCalendarEvent[]>(initialEvents);

  addEvent(input: Omit<ShowcaseCalendarEvent, "id">) {
    const created: ShowcaseCalendarEvent = {
      id: `cal-${Date.now()}`,
      ...input,
    };
    this.events = [...this.events, created];
    return created;
  }

  deleteEvent(id: string) {
    this.events = this.events.filter((e) => e.id !== id);
  }
}

export const calendarStore = new CalendarStore();
