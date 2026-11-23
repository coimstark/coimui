import type { EntryGenerator } from "./$types";

export const entries: EntryGenerator = () => [
  { app: "kanban" },
  { app: "calendar" },
  { app: "chat" },
  { app: "invoices" },
  { app: "mail" },
];
