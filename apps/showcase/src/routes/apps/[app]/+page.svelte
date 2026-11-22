<script lang="ts">
  import { page } from "$app/state";
  import {
    CoimAvatar,
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimDrawer,
    CoimGrid,
    CoimList,
    CoimListItemButton,
    CoimListItemText,
    CoimPaper,
    CoimStack,
    CoimTextField,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import { CoimDataGrid, type CoimDataGridColumn } from "@coimui/svelte/data-grid";
  import {
    CoimEventCalendar,
    CoimSortableList,
    printElement,
    type CoimCalendarEvent,
    type CoimSortableItem,
  } from "@coimui/svelte/plugins";

  const appSlug = $derived(page.params.app ?? "kanban");

  const titles: Record<string, string> = {
    kanban: "Kanban Board",
    calendar: "Team Calendar",
    chat: "Workspace Messaging",
    invoices: "Billing & Invoices",
    mail: "Unified Inbox",
  };

  const activeTitle = $derived(titles[appSlug] ?? "Workspace App");

  // Kanban state
  let backlogTasks = $state<CoimSortableItem[]>([
    { id: "k-1", label: "Audit keyboard focus rings", description: "UI Accessibility" },
    { id: "k-2", label: "Document subpath styles imports", description: "Docs" },
  ]);
  let inProgressTasks = $state<CoimSortableItem[]>([
    { id: "k-3", label: "Run Playwright WCAG suite", description: "QA Gate" },
  ]);
  let newCardLabel = $state("");

  function addBacklogCard() {
    const trimmed = newCardLabel.trim();
    if (!trimmed) return;
    backlogTasks = [
      { id: `k-${Date.now()}`, label: trimmed, description: "Added" },
      ...backlogTasks,
    ];
    newCardLabel = "";
    toast.success("Card added to Backlog");
  }

  // Calendar state
  const scheduleEvents: CoimCalendarEvent[] = [
    { id: "c-1", title: "Weekly Architecture Sync", start: "2026-11-22T09:30:00", end: "2026-11-22T10:30:00" },
    { id: "c-2", title: "Release v1.0.0 Cut", start: "2026-11-25T13:00:00", end: "2026-11-25T15:00:00" },
  ];

  // Chat state
  const threads = [
    { id: "eng", name: "Platform Engineering", snippet: "All TS 7.0.2 checks passed on main." },
    { id: "design", name: "Design Systems", snippet: "Orange and Purple dark tokens aligned." },
  ];
  let selectedThread = $state("eng");
  let messagesByThread = $state<Record<string, { id: string; author: string; time: string; text: string }[]>>({
    eng: [
      { id: "m1", author: "Laura Ellis", time: "09:14", text: "Consumer minimal build bundle size checked cleanly." },
      { id: "m2", author: "Mateo Khan", time: "09:18", text: "Let's finalize Playwright verification across viewports." },
    ],
    design: [
      { id: "d1", author: "Sora Park", time: "10:02", text: "Verified dark mode contrast ratios for Orange and Purple presets." },
      { id: "d2", author: "Laura Ellis", time: "10:15", text: "ButtonGroup and ToggleButton framing now consistent across themes." },
    ],
  });
  const activeThreadMeta = $derived(threads.find((t) => t.id === selectedThread) ?? threads[0]);
  const activeMessages = $derived(messagesByThread[selectedThread] ?? []);
  let chatDraft = $state("");

  function sendChatMessage() {
    const text = chatDraft.trim();
    if (!text) return;
    const current = messagesByThread[selectedThread] ?? [];
    messagesByThread = {
      ...messagesByThread,
      [selectedThread]: [...current, { id: `m-${Date.now()}`, author: "You", time: "Now", text }],
    };
    chatDraft = "";
  }

  function moveKanbanTask(id: string, direction: "forward" | "back") {
    if (direction === "forward") {
      const target = backlogTasks.find((t) => t.id === id);
      if (!target) return;
      backlogTasks = backlogTasks.filter((t) => t.id !== id);
      inProgressTasks = [target, ...inProgressTasks];
      toast.info(`Moved "${target.label}" to In Progress`);
    } else {
      const target = inProgressTasks.find((t) => t.id === id);
      if (!target) return;
      inProgressTasks = inProgressTasks.filter((t) => t.id !== id);
      backlogTasks = [target, ...backlogTasks];
      toast.info(`Moved "${target.label}" back to Backlog`);
    }
  }

  // Invoices state
  interface InvoiceRow extends Record<string, unknown> {
    id: string;
    client: string;
    issued: string;
    total: number;
    status: string;
  }
  const invoiceRows: InvoiceRow[] = [
    { id: "INV-2026-081", client: "Northstar Labs", issued: "2026-11-01", total: 14800, status: "Paid" },
    { id: "INV-2026-082", client: "Vesper Robotics", issued: "2026-11-08", total: 4200, status: "Pending" },
    { id: "INV-2026-083", client: "Kestrel Bio", issued: "2026-11-15", total: 21900, status: "Paid" },
  ];
  const invoiceCols: CoimDataGridColumn<InvoiceRow>[] = [
    { id: "id", field: "id", headerName: "Invoice #", width: 150 },
    { id: "client", field: "client", headerName: "Client", width: 200 },
    { id: "issued", field: "issued", headerName: "Issued", width: 130 },
    {
      id: "total",
      field: "total",
      headerName: "Total",
      type: "number",
      align: "right",
      width: 120,
      valueFormatter: (v) => `$${Number(v ?? 0).toLocaleString()}`,
    },
    { id: "status", field: "status", headerName: "Status", width: 110 },
  ];
  let invoicePrintEl = $state<HTMLElement | null>(null);

  // Mail state
  let mailItems = $state([
    { id: "mail-1", folder: "inbox" as const, sender: "Security Bot", subject: "Dependabot weekly digest: 0 high severity advisories", body: "All workspace dependencies resolved cleanly against frozen lockfile." },
    { id: "mail-2", folder: "inbox" as const, sender: "Design Ops", subject: "Urbanist & Mulish font assets verified", body: "Fontsource local assets bundle reliably with zero external CDN requests." },
    { id: "mail-3", folder: "sent" as const, sender: "Release Team", subject: "CoimUI v1.0.0 candidate staged", body: "Ready for final smoke test run." },
  ]);
  let mailFolder = $state<"inbox" | "sent">("inbox");
  let selectedMailId = $state("mail-1");
  let composeOpen = $state(false);
  let composeRecipient = $state("");
  let composeSubject = $state("");
  let composeBody = $state("");
  const visibleMails = $derived(mailItems.filter((m) => m.folder === mailFolder));
  const selectedMail = $derived(mailItems.find((m) => m.id === selectedMailId) ?? visibleMails[0] ?? mailItems[0]);

  function sendComposedMail() {
    const recipient = composeRecipient.trim() || "team@coimui.dev";
    const subject = composeSubject.trim() || "Release Update";
    const body = composeBody.trim() || "Sent from CoimUI Workspace Inbox.";
    const createdId = `mail-${Date.now()}`;
    mailItems = [
      { id: createdId, folder: "sent", sender: `To: ${recipient}`, subject, body },
      ...mailItems,
    ];
    mailFolder = "sent";
    selectedMailId = createdId;
    composeRecipient = "";
    composeSubject = "";
    composeBody = "";
    composeOpen = false;
    toast.success("Message dispatched to Sent");
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — {activeTitle}</title>
</svelte:head>

<CoimStack spacing={6}>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div>
      <CoimBreadcrumbs items={[{ label: "Applications", href: "/apps/kanban" }, { label: activeTitle }]} />
      <CoimTypography variant="h1" class="mt-2">{activeTitle}</CoimTypography>
    </div>

    <div class="flex flex-wrap gap-2">
      {#each Object.entries(titles) as [slug, label] (slug)}
        <CoimButton
          size="small"
          variant={appSlug === slug ? "contained" : "outlined"}
          href={`/apps/${slug}`}
        >
          {label}
        </CoimButton>
      {/each}
    </div>
  </div>

  {#if appSlug === "kanban"}
    <CoimCard>
      <CoimCardHeader title="Sprint Release Board" subheader="Keyboard & pointer reorderable task columns" />
      <CoimCardContent>
        <div class="mb-4 flex flex-wrap items-end gap-3">
          <div class="w-full max-w-sm">
            <CoimTextField label="New Task Card" bind:value={newCardLabel} placeholder="e.g. Verify dark mode contrast" fullWidth />
          </div>
          <CoimButton variant="contained" onclick={addBacklogCard}>Add Card</CoimButton>
        </div>

        <CoimGrid container spacing={4}>
          <CoimGrid size={{ xs: 12, md: 6 }}>
            <CoimPaper variant="outlined" class="p-4">
              <CoimTypography variant="h2" class="mb-3 text-base">Backlog ({backlogTasks.length})</CoimTypography>
              <CoimSortableList bind:items={backlogTasks} ariaLabel="Backlog tasks" />
              {#if backlogTasks.length > 0}
                <div class="mt-3 flex flex-wrap gap-2">
                  {#each backlogTasks as t (t.id)}
                    <CoimButton size="tiny" variant="outlined" onclick={() => moveKanbanTask(t.id, "forward")}>
                      Start "{t.label}" →
                    </CoimButton>
                  {/each}
                </div>
              {/if}
            </CoimPaper>
          </CoimGrid>
          <CoimGrid size={{ xs: 12, md: 6 }}>
            <CoimPaper variant="outlined" class="p-4">
              <CoimTypography variant="h2" class="mb-3 text-base">In Progress ({inProgressTasks.length})</CoimTypography>
              <CoimSortableList bind:items={inProgressTasks} ariaLabel="In progress tasks" />
              {#if inProgressTasks.length > 0}
                <div class="mt-3 flex flex-wrap gap-2">
                  {#each inProgressTasks as t (t.id)}
                    <CoimButton size="tiny" variant="outlined" onclick={() => moveKanbanTask(t.id, "back")}>
                      ← Return "{t.label}"
                    </CoimButton>
                  {/each}
                </div>
              {/if}
            </CoimPaper>
          </CoimGrid>
        </CoimGrid>
      </CoimCardContent>
    </CoimCard>
  {:else if appSlug === "calendar"}
    <CoimCard>
      <CoimCardHeader title="Release & Review Schedule" subheader="Interactive month, week, day, and list calendar views" />
      <CoimCardContent>
        <CoimEventCalendar events={scheduleEvents} date="2026-11-22" />
      </CoimCardContent>
    </CoimCard>
  {:else if appSlug === "chat"}
    <CoimGrid container spacing={4}>
      <CoimGrid size={{ xs: 12, md: 4 }}>
        <CoimCard>
          <CoimCardHeader title="Channels" />
          <CoimCardContent class="p-0">
            <CoimList>
              {#each threads as thread (thread.id)}
                <CoimListItemButton
                  selected={selectedThread === thread.id}
                  onclick={() => (selectedThread = thread.id)}
                >
                  <CoimAvatar initials={thread.name.slice(0, 2).toUpperCase()} class="mr-3" />
                  <CoimListItemText primary={thread.name} secondary={thread.snippet} />
                </CoimListItemButton>
              {/each}
            </CoimList>
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
      <CoimGrid size={{ xs: 12, md: 8 }}>
        <CoimCard>
          <CoimCardHeader title={`# ${activeThreadMeta.name}`} subheader={activeThreadMeta.snippet} />
          <CoimCardContent>
            <div class="mb-4 space-y-3">
              {#each activeMessages as msg (msg.id)}
                <CoimPaper variant="outlined" class="p-3">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-semibold">{msg.author}</span>
                    <span class="text-text-secondary">{msg.time}</span>
                  </div>
                  <p class="mt-1 text-sm">{msg.text}</p>
                </CoimPaper>
              {/each}
            </div>
            <div class="flex items-end gap-2">
              <div class="flex-1">
                <CoimTextField
                  label="Message"
                  bind:value={chatDraft}
                  placeholder="Write an update (press Enter to send)"
                  fullWidth
                  inputProps={{
                    onkeydown: (e: KeyboardEvent) => {
                      if (e.key === "Enter" && !e.isComposing) {
                        e.preventDefault();
                        sendChatMessage();
                      }
                    },
                  }}
                />
              </div>
              <CoimButton variant="contained" onclick={sendChatMessage}>Send</CoimButton>
            </div>
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
    </CoimGrid>
  {:else if appSlug === "invoices"}
    <CoimStack spacing={4}>
      <div bind:this={invoicePrintEl}>
        <CoimCard>
          <CoimCardHeader title="Quarterly Invoice Ledger" subheader="Export to CSV/XLSX or print directly" />
          <CoimCardContent>
            <div class="mb-3 flex justify-end">
              <CoimButton
                variant="outlined"
                size="small"
                onclick={() => {
                  if (invoicePrintEl) printElement(invoicePrintEl, { title: "CoimUI Invoices" });
                }}
              >
                Print Ledger
              </CoimButton>
            </div>
            <CoimDataGrid rows={invoiceRows} columns={invoiceCols} enableExport exportFilename="invoices" />
          </CoimCardContent>
        </CoimCard>
      </div>
    </CoimStack>
  {:else}
    <CoimCard>
      <CoimCardHeader title="Workspace Inbox" subheader="Folder switcher, thread reader, and compose drawer">
        {#snippet action()}
          <CoimButton variant="contained" size="small" onclick={() => (composeOpen = true)}>Compose</CoimButton>
        {/snippet}
      </CoimCardHeader>
      <CoimCardContent>
        <div class="mb-4 flex gap-2">
          <CoimButton size="small" variant={mailFolder === "inbox" ? "contained" : "outlined"} onclick={() => (mailFolder = "inbox")}>Inbox</CoimButton>
          <CoimButton size="small" variant={mailFolder === "sent" ? "contained" : "outlined"} onclick={() => (mailFolder = "sent")}>Sent</CoimButton>
        </div>
        <CoimGrid container spacing={4}>
          <CoimGrid size={{ xs: 12, md: 5 }}>
            <CoimList class="border-grey-100 rounded-xl border">
              {#each visibleMails as item (item.id)}
                <CoimListItemButton
                  selected={selectedMail.id === item.id}
                  onclick={() => (selectedMailId = item.id)}
                >
                  <CoimListItemText primary={item.subject} secondary={item.sender} />
                </CoimListItemButton>
              {/each}
            </CoimList>
          </CoimGrid>
          <CoimGrid size={{ xs: 12, md: 7 }}>
            <CoimPaper variant="outlined" class="p-5">
              <CoimChip label={selectedMail.sender} size="small" color="primary" variant="pastel" />
              <CoimTypography variant="h2" class="mt-2 text-lg">{selectedMail.subject}</CoimTypography>
              <p class="text-text-secondary mt-3 text-sm">{selectedMail.body}</p>
            </CoimPaper>
          </CoimGrid>
        </CoimGrid>
      </CoimCardContent>
    </CoimCard>

    <CoimDrawer bind:open={composeOpen} anchor="right" aria-label="Compose message">
      <div class="w-80 max-w-full p-6">
        <h2 class="font-heading text-lg font-bold">New Message</h2>
        <CoimStack spacing={3} class="mt-4">
          <CoimTextField label="Recipient" bind:value={composeRecipient} placeholder="team@coimui.dev" fullWidth />
          <CoimTextField label="Subject" bind:value={composeSubject} placeholder="Release status" fullWidth />
          <CoimTextField label="Message" bind:value={composeBody} multiline rows={4} fullWidth />
          <CoimButton variant="contained" onclick={sendComposedMail}>
            Send Message
          </CoimButton>
        </CoimStack>
      </div>
    </CoimDrawer>
  {/if}
</CoimStack>
