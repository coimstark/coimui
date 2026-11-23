export interface MessageContact {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  online: boolean;
}

export interface DirectMessage {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

export interface MessageThread {
  id: string;
  contactId: string;
  unread: number;
  lastTime: string;
  messages: DirectMessage[];
}

const STORAGE_KEY = "coimui-showcase-messages-v1";

const initialContacts: MessageContact[] = [
  { id: "c-laura", name: "Laura Ellis", role: "Lead Systems Engineer", email: "laura.ellis@coimui.dev", avatar: "/images/avatars/avatar-3.jpg", online: true },
  { id: "c-mateo", name: "Mateo Khan", role: "Release Architect", email: "mateo.khan@coimui.dev", avatar: "/images/avatars/avatar-2.jpg", online: true },
  { id: "c-sora", name: "Sora Park", role: "Principal Designer", email: "sora.park@coimui.dev", avatar: "/images/avatars/avatar-4.jpg", online: false },
];

const initialThreads: MessageThread[] = [
  {
    id: "thr-laura",
    contactId: "c-laura",
    unread: 1,
    lastTime: "10:18",
    messages: [
      { id: "dm-1", sender: "them", text: "Can you verify the DataGrid pivot panel on desktop and mobile?", time: "10:14" },
      { id: "dm-2", sender: "me", text: "Checking Playwright parity baselines right now.", time: "10:18" },
    ],
  },
  {
    id: "thr-mateo",
    contactId: "c-mateo",
    unread: 0,
    lastTime: "09:42",
    messages: [
      { id: "dm-3", sender: "them", text: "Tarball artifact checks finished green.", time: "09:42" },
    ],
  },
];

class MessagesStore {
  contacts = $state<MessageContact[]>(initialContacts);
  threads = $state<MessageThread[]>(initialThreads);
  activeThreadId = $state<string>("thr-laura");
  micMuted = $state(false);
  videoEnabled = $state(true);
  screenSharing = $state(false);
  hydrated = $state(false);

  hydrate() {
    if (this.hydrated || typeof window === "undefined") return;
    this.hydrated = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<{
        contacts: MessageContact[];
        threads: MessageThread[];
        activeThreadId: string;
      }>;
      if (parsed.contacts?.length) this.contacts = parsed.contacts;
      if (parsed.threads?.length) this.threads = parsed.threads;
      if (parsed.activeThreadId) this.activeThreadId = parsed.activeThreadId;
    } catch {
      // Ignore corrupt storage
    }
  }

  private persist() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          contacts: this.contacts,
          threads: this.threads,
          activeThreadId: this.activeThreadId,
        }),
      );
    } catch {
      // Ignore storage errors
    }
  }

  get activeThread(): MessageThread | undefined {
    return this.threads.find((t) => t.id === this.activeThreadId) ?? this.threads[0];
  }

  contactFor(contactId: string): MessageContact | undefined {
    return this.contacts.find((c) => c.id === contactId);
  }

  selectThread(threadId: string) {
    this.activeThreadId = threadId;
    this.threads = this.threads.map((t) => (t.id === threadId ? { ...t, unread: 0 } : t));
    this.persist();
  }

  addContact(name: string, email: string, role = "Team Member") {
    const contact: MessageContact = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || "Team Member",
      email: email.trim(),
      avatar: "/images/avatars/avatar-5.jpg",
      online: true,
    };
    this.contacts = [contact, ...this.contacts];
    this.persist();
    return contact;
  }

  startChat(contactId: string, initialText = "") {
    let existing = this.threads.find((t) => t.contactId === contactId);
    if (!existing) {
      existing = {
        id: `thr-${Date.now()}`,
        contactId,
        unread: 0,
        lastTime: "Now",
        messages: [],
      };
      this.threads = [existing, ...this.threads];
    }
    this.activeThreadId = existing.id;
    if (initialText.trim()) {
      this.sendMessage(initialText);
    } else {
      this.persist();
    }
    return existing;
  }

  sendMessage(text: string) {
    const trimmed = text.trim();
    const target = this.activeThread;
    if (!trimmed || !target) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    this.threads = this.threads.map((t) =>
      t.id === target.id
        ? {
            ...t,
            unread: 0,
            lastTime: time,
            messages: [...t.messages, { id: `dm-${Date.now()}`, sender: "me", text: trimmed, time }],
          }
        : t,
    );
    this.persist();
  }
}

export const messagesStore = new MessagesStore();
