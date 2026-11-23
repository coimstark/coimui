export interface AiProviderConfig {
  label: string;
  endpoint: string;
  model: string;
  apiKey: string;
}

export interface AiChatMessage {
  id: string;
  role: "user" | "system";
  content: string;
  createdAt: string;
}

export interface AiChatThread {
  id: string;
  title: string;
  model: string;
  pinned: boolean;
  updatedAt: string;
  messages: AiChatMessage[];
}

export interface AiChatExtension {
  id: string;
  name: string;
  category: string;
  version: string;
  installed: boolean;
  summary: string;
  rating: string;
  installs: string;
  tags: string[];
  changelog: { version: string; date: string; notes: string }[];
}

export interface AiChatApiKey {
  id: string;
  label: string;
  prefix: string;
  createdAt: string;
  active: boolean;
}

const STORAGE_KEY = "coimui-showcase-ai-chat-v1";

const initialThreads: AiChatThread[] = [
  {
    id: "chat-101",
    title: "Design Token Audit Checklist",
    model: "configured-provider-default",
    pinned: true,
    updatedAt: "Today, 09:40",
    messages: [
      {
        id: "m-1",
        role: "user",
        content: "Summarize the CSS custom properties needed for four accent presets and dark mode.",
        createdAt: "09:40",
      },
      {
        id: "m-2",
        role: "system",
        content: "No inference provider configured. Connect an external provider endpoint in Workspace Settings to run completions.",
        createdAt: "09:40",
      },
    ],
  },
  {
    id: "chat-102",
    title: "DataGrid Export Schema Notes",
    model: "configured-provider-default",
    pinned: false,
    updatedAt: "Yesterday",
    messages: [
      {
        id: "m-3",
        role: "user",
        content: "Draft column metadata validations for CSV and XLSX workbook downloads.",
        createdAt: "16:15",
      },
    ],
  },
  {
    id: "chat-103",
    title: "Svelte 5 Accessibility Review",
    model: "configured-provider-default",
    pinned: false,
    updatedAt: "Nov 20",
    messages: [],
  },
];

const initialExtensions: AiChatExtension[] = [
  {
    id: "ext-schema",
    name: "SQL & Schema Inspector",
    category: "Data",
    version: "1.4.0",
    installed: true,
    summary: "Attaches typed table metadata and column constraints to configured provider requests.",
    rating: "4.9",
    installs: "12.4k",
    tags: ["PostgreSQL", "TypeScript", "Validation"],
    changelog: [
      { version: "1.4.0", date: "2026-11-10", notes: "Added pivot field schema hints." },
      { version: "1.3.2", date: "2026-10-18", notes: "Improved column enum serialization." },
    ],
  },
  {
    id: "ext-a11y",
    name: "WCAG 2.1 Auditor",
    category: "Accessibility",
    version: "2.1.0",
    installed: true,
    summary: "Checks ARIA roles, keyboard focus traps, and contrast tokens before publishing.",
    rating: "4.8",
    installs: "9.8k",
    tags: ["WCAG", "Focus", "Contrast"],
    changelog: [
      { version: "2.1.0", date: "2026-11-04", notes: "Added DataGrid keyboard navigation rules." },
    ],
  },
  {
    id: "ext-docs",
    name: "Component Docs Sync",
    category: "Productivity",
    version: "1.1.0",
    installed: false,
    summary: "Indexes repository component interfaces for configured documentation workflows.",
    rating: "4.7",
    installs: "6.1k",
    tags: ["Markdown", "Snippets"],
    changelog: [
      { version: "1.1.0", date: "2026-10-29", notes: "Supports Svelte 5 snippet signatures." },
    ],
  },
];

const initialKeys: AiChatApiKey[] = [
  {
    id: "key-1",
    label: "Local Browser Staging Key",
    prefix: "coim_stg_88a1",
    createdAt: "2026-11-12",
    active: true,
  },
];

class AiChatStore {
  threads = $state<AiChatThread[]>(initialThreads);
  activeThreadId = $state<string>("chat-101");
  selectedExtensionId = $state<string>("ext-schema");
  extensions = $state<AiChatExtension[]>(initialExtensions);
  apiKeys = $state<AiChatApiKey[]>(initialKeys);
  provider = $state<AiProviderConfig>({
    label: "",
    endpoint: "",
    model: "",
    apiKey: "",
  });
  hydrated = $state(false);

  get isProviderConfigured(): boolean {
    return Boolean(this.provider.endpoint.trim() && this.provider.model.trim());
  }

  get activeThread(): AiChatThread | undefined {
    return this.threads.find((t) => t.id === this.activeThreadId) ?? this.threads[0];
  }

  get selectedExtension(): AiChatExtension {
    return (
      this.extensions.find((e) => e.id === this.selectedExtensionId) ?? this.extensions[0]
    );
  }

  hydrate() {
    if (this.hydrated || typeof window === "undefined") return;
    this.hydrated = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<{
        threads: AiChatThread[];
        activeThreadId: string;
        extensions: AiChatExtension[];
        apiKeys: AiChatApiKey[];
        provider: AiProviderConfig;
      }>;
      if (parsed.threads?.length) this.threads = parsed.threads;
      if (parsed.activeThreadId) this.activeThreadId = parsed.activeThreadId;
      if (parsed.extensions?.length) this.extensions = parsed.extensions;
      if (parsed.apiKeys) this.apiKeys = parsed.apiKeys;
      if (parsed.provider) this.provider = parsed.provider;
    } catch {
      // Ignore corrupt local state
    }
  }

  private persist() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          threads: this.threads,
          activeThreadId: this.activeThreadId,
          extensions: this.extensions,
          apiKeys: this.apiKeys,
          provider: this.provider,
        }),
      );
    } catch {
      // Ignore storage quota issues
    }
  }

  createThread(title = "Untitled Conversation") {
    const id = `chat-${Date.now()}`;
    const created: AiChatThread = {
      id,
      title: title.trim() || "Untitled Conversation",
      model: this.provider.model || "unconfigured",
      pinned: false,
      updatedAt: "Just now",
      messages: [],
    };
    this.threads = [created, ...this.threads];
    this.activeThreadId = id;
    this.persist();
    return created;
  }

  selectThread(id: string) {
    this.activeThreadId = id;
    this.persist();
  }

  renameThread(id: string, title: string) {
    const trimmed = title.trim();
    if (!trimmed) return;
    this.threads = this.threads.map((t) =>
      t.id === id ? { ...t, title: trimmed, updatedAt: "Edited" } : t,
    );
    this.persist();
  }

  togglePin(id: string) {
    this.threads = this.threads.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t));
    this.persist();
  }

  deleteThread(id: string) {
    this.threads = this.threads.filter((t) => t.id !== id);
    if (this.activeThreadId === id) {
      this.activeThreadId = this.threads[0]?.id ?? "";
    }
    this.persist();
  }

  submitPrompt(prompt: string): { sent: boolean; reason?: string } {
    const trimmed = prompt.trim();
    if (!trimmed) return { sent: false, reason: "Enter a message first." };
    let target = this.activeThread;
    if (!target) {
      target = this.createThread(trimmed.slice(0, 36));
    }
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: AiChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: time,
    };
    const nextTitle =
      target.messages.length === 0 && target.title === "Untitled Conversation"
        ? trimmed.slice(0, 40)
        : target.title;

    const systemMsg: AiChatMessage = this.isProviderConfigured
      ? {
          id: `s-${Date.now() + 1}`,
          role: "system",
          content: `Request queued for configured provider (${this.provider.label || this.provider.endpoint}, model: ${this.provider.model}). No offline responses are fabricated in browser mode.`,
          createdAt: time,
        }
      : {
          id: `s-${Date.now() + 1}`,
          role: "system",
          content: "No AI provider is configured. Configure an external provider endpoint before running model inference.",
          createdAt: time,
        };

    this.threads = this.threads.map((t) =>
      t.id === target!.id
        ? {
            ...t,
            title: nextTitle,
            updatedAt: "Just now",
            messages: [...t.messages, userMsg, systemMsg],
          }
        : t,
    );
    this.persist();
    return {
      sent: this.isProviderConfigured,
      reason: this.isProviderConfigured
        ? undefined
        : "Provider not configured: prompt saved locally without fake AI output.",
    };
  }

  saveProviderConfig(next: AiProviderConfig) {
    this.provider = { ...next };
    this.persist();
  }

  clearProviderConfig() {
    this.provider = { label: "", endpoint: "", model: "", apiKey: "" };
    this.persist();
  }

  toggleExtension(id: string) {
    this.extensions = this.extensions.map((ext) =>
      ext.id === id ? { ...ext, installed: !ext.installed } : ext,
    );
    this.persist();
  }

  selectExtension(id: string) {
    this.selectedExtensionId = id;
  }

  createApiKey(label: string) {
    const trimmed = label.trim() || "Workspace Client Key";
    const key: AiChatApiKey = {
      id: `key-${Date.now()}`,
      label: trimmed,
      prefix: `coim_live_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString().slice(0, 10),
      active: true,
    };
    this.apiKeys = [key, ...this.apiKeys];
    this.persist();
    return key;
  }

  revokeApiKey(id: string) {
    this.apiKeys = this.apiKeys.map((k) => (k.id === id ? { ...k, active: false } : k));
    this.persist();
  }

  deleteApiKey(id: string) {
    this.apiKeys = this.apiKeys.filter((k) => k.id !== id);
    this.persist();
  }
}

export const aiChatStore = new AiChatStore();
