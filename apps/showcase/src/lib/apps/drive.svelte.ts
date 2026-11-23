export interface DriveItem {
  id: string;
  name: string;
  kind: "folder" | "image" | "document" | "video";
  parentId: string | null;
  sizeLabel: string;
  sizeBytes: number;
  updatedAt: string;
  owner: string;
  starred: boolean;
  shared: boolean;
  spam: boolean;
  trashed: boolean;
  labels: string[];
  previewSrc?: string;
}

export interface DriveWorkspace {
  id: string;
  name: string;
  members: number;
  storageUsedGb: number;
  storageLimitGb: number;
  role: string;
}

export interface DriveOrganization {
  id: string;
  name: string;
  domain: string;
  seats: number;
  verified: boolean;
}

const STORAGE_KEY = "coimui-showcase-drive-v1";

const initialItems: DriveItem[] = [
  {
    id: "fld-design",
    name: "Design Tokens & Specs",
    kind: "folder",
    parentId: null,
    sizeLabel: "4 items",
    sizeBytes: 0,
    updatedAt: "Nov 22, 2026",
    owner: "Laura Ellis",
    starred: true,
    shared: true,
    spam: false,
    trashed: false,
    labels: ["Design", "Q4"],
  },
  {
    id: "fld-releases",
    name: "Release Artifacts",
    kind: "folder",
    parentId: null,
    sizeLabel: "2 items",
    sizeBytes: 0,
    updatedAt: "Nov 21, 2026",
    owner: "Mateo Khan",
    starred: false,
    shared: true,
    spam: false,
    trashed: false,
    labels: ["Release"],
  },
  {
    id: "fil-screen1",
    name: "Dashboard Layout Spec.jpg",
    kind: "image",
    parentId: "fld-design",
    sizeLabel: "1.4 MB",
    sizeBytes: 1_400_000,
    updatedAt: "Nov 22, 2026",
    owner: "Laura Ellis",
    starred: true,
    shared: true,
    spam: false,
    trashed: false,
    labels: ["Design"],
    previewSrc: "/images/misc/screen-1.jpg",
  },
  {
    id: "fil-product1",
    name: "Hardware Catalog Hero.jpg",
    kind: "image",
    parentId: null,
    sizeLabel: "980 KB",
    sizeBytes: 980_000,
    updatedAt: "Nov 20, 2026",
    owner: "Sora Park",
    starred: true,
    shared: false,
    spam: false,
    trashed: false,
    labels: ["Marketing", "Design"],
    previewSrc: "/images/products/product-1.jpg",
  },
  {
    id: "fil-audit",
    name: "WCAG 2.1 Audit Summary.pdf",
    kind: "document",
    parentId: "fld-design",
    sizeLabel: "640 KB",
    sizeBytes: 640_000,
    updatedAt: "Nov 19, 2026",
    owner: "Laura Ellis",
    starred: false,
    shared: true,
    spam: false,
    trashed: false,
    labels: ["Compliance"],
  },
  {
    id: "fil-demo",
    name: "Product Reel Preview.mp4",
    kind: "video",
    parentId: "fld-releases",
    sizeLabel: "4.8 MB",
    sizeBytes: 4_800_000,
    updatedAt: "Nov 18, 2026",
    owner: "Mateo Khan",
    starred: false,
    shared: false,
    spam: false,
    trashed: false,
    labels: ["Release"],
  },
  {
    id: "fil-spam",
    name: "Unverified External Archive.zip",
    kind: "document",
    parentId: null,
    sizeLabel: "210 KB",
    sizeBytes: 210_000,
    updatedAt: "Nov 15, 2026",
    owner: "Unknown Sender",
    starred: false,
    shared: false,
    spam: true,
    trashed: false,
    labels: [],
  },
  {
    id: "fil-trash",
    name: "Deprecated Draft Wireframes.fig",
    kind: "document",
    parentId: null,
    sizeLabel: "2.1 MB",
    sizeBytes: 2_100_000,
    updatedAt: "Nov 12, 2026",
    owner: "Laura Ellis",
    starred: false,
    shared: false,
    spam: false,
    trashed: true,
    labels: ["Archive"],
  },
];

const initialWorkspaces: DriveWorkspace[] = [
  { id: "ws-1", name: "CoimUI Core Design", members: 14, storageUsedGb: 42, storageLimitGb: 100, role: "Admin" },
  { id: "ws-2", name: "Release Engineering", members: 9, storageUsedGb: 68, storageLimitGb: 120, role: "Editor" },
  { id: "ws-3", name: "Brand & Documentation", members: 6, storageUsedGb: 18, storageLimitGb: 50, role: "Owner" },
];

const initialOrgs: DriveOrganization[] = [
  { id: "org-1", name: "CoimUI Open Systems", domain: "coimui.dev", seats: 35, verified: true },
  { id: "org-2", name: "Northstar Partner Lab", domain: "northstar.example", seats: 12, verified: false },
];

class DriveStore {
  items = $state<DriveItem[]>(initialItems);
  workspaces = $state<DriveWorkspace[]>(initialWorkspaces);
  organizations = $state<DriveOrganization[]>(initialOrgs);
  currentFolderId = $state<string | null>(null);
  hydrated = $state(false);

  hydrate() {
    if (this.hydrated || typeof window === "undefined") return;
    this.hydrated = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<{
        items: DriveItem[];
        workspaces: DriveWorkspace[];
        organizations: DriveOrganization[];
      }>;
      if (parsed.items?.length) this.items = parsed.items;
      if (parsed.workspaces?.length) this.workspaces = parsed.workspaces;
      if (parsed.organizations?.length) this.organizations = parsed.organizations;
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
          items: this.items,
          workspaces: this.workspaces,
          organizations: this.organizations,
        }),
      );
    } catch {
      // Ignore quota errors
    }
  }

  get totalUsedMb(): number {
    const bytes = this.items.filter((i) => !i.trashed).reduce((acc, item) => acc + item.sizeBytes, 0);
    return Math.round((bytes / 1_000_000) * 10) / 10;
  }

  openFolder(folderId: string | null) {
    this.currentFolderId = folderId;
  }

  createFolder(name: string, parentId: string | null = this.currentFolderId) {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const item: DriveItem = {
      id: `fld-${Date.now()}`,
      name: trimmed,
      kind: "folder",
      parentId,
      sizeLabel: "0 items",
      sizeBytes: 0,
      updatedAt: "Just now",
      owner: "Laura Ellis",
      starred: false,
      shared: false,
      spam: false,
      trashed: false,
      labels: [],
    };
    this.items = [item, ...this.items];
    this.persist();
    return item;
  }

  uploadFiles(files: File[], parentId: string | null = this.currentFolderId) {
    const added: DriveItem[] = files.map((file, idx) => ({
      id: `fil-${Date.now()}-${idx}`,
      name: file.name,
      kind: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document",
      parentId,
      sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      sizeBytes: file.size || 1024,
      updatedAt: "Just now",
      owner: "Laura Ellis",
      starred: false,
      shared: false,
      spam: false,
      trashed: false,
      labels: ["Uploaded"],
    }));
    this.items = [...added, ...this.items];
    this.persist();
  }

  renameItem(id: string, nextName: string) {
    const trimmed = nextName.trim();
    if (!trimmed) return;
    this.items = this.items.map((item) =>
      item.id === id ? { ...item, name: trimmed, updatedAt: "Just now" } : item,
    );
    this.persist();
  }

  toggleStar(id: string) {
    this.items = this.items.map((item) =>
      item.id === id ? { ...item, starred: !item.starred } : item,
    );
    this.persist();
  }

  toggleShare(id: string) {
    this.items = this.items.map((item) =>
      item.id === id ? { ...item, shared: !item.shared } : item,
    );
    this.persist();
  }

  toggleLabel(id: string, label: string) {
    this.items = this.items.map((item) => {
      if (item.id !== id) return item;
      const has = item.labels.includes(label);
      return {
        ...item,
        labels: has ? item.labels.filter((l) => l !== label) : [...item.labels, label],
      };
    });
    this.persist();
  }

  moveToSpam(id: string) {
    this.items = this.items.map((item) =>
      item.id === id ? { ...item, spam: true, trashed: false } : item,
    );
    this.persist();
  }

  moveToTrash(id: string) {
    this.items = this.items.map((item) =>
      item.id === id ? { ...item, trashed: true, spam: false } : item,
    );
    this.persist();
  }

  restoreItem(id: string) {
    this.items = this.items.map((item) =>
      item.id === id ? { ...item, trashed: false, spam: false } : item,
    );
    this.persist();
  }

  deletePermanently(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
    this.persist();
  }

  addWorkspace(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    this.workspaces = [
      { id: `ws-${Date.now()}`, name: trimmed, members: 1, storageUsedGb: 0, storageLimitGb: 50, role: "Owner" },
      ...this.workspaces,
    ];
    this.persist();
  }
}

export const driveStore = new DriveStore();
