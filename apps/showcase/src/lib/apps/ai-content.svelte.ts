export interface AiContentAsset {
  id: string;
  title: string;
  kind: "image" | "video" | "upscale";
  src: string;
  aspect: string;
  modelName: string;
  favorite: boolean;
  createdAt: string;
  prompt: string;
}

export interface AiContentModel {
  id: string;
  name: string;
  modality: "Image" | "Video" | "Upscale";
  version: string;
  summary: string;
  thumbnail: string;
  runs: string;
  latency: string;
  tags: string[];
  changelog: { version: string; date: string; notes: string }[];
}

export interface AiContentApiKey {
  id: string;
  label: string;
  prefix: string;
  createdAt: string;
  active: boolean;
}

const STORAGE_KEY = "coimui-showcase-ai-content-v1";

const initialAssets: AiContentAsset[] = [
  {
    id: "ac-1",
    title: "Ceramic Desk Series",
    kind: "image",
    src: "/images/models/model-1.jpg",
    aspect: "4:3",
    modelName: "Vision Studio v2",
    favorite: true,
    createdAt: "2026-11-20",
    prompt: "Editorial product lighting over warm limestone surface",
  },
  {
    id: "ac-2",
    title: "Minimalist Workstation",
    kind: "image",
    src: "/images/models/model-2.jpg",
    aspect: "16:9",
    modelName: "Vision Studio v2",
    favorite: false,
    createdAt: "2026-11-19",
    prompt: "Daylight architectural studio desk with brushed aluminum fixtures",
  },
  {
    id: "ac-3",
    title: "Botanical Atrium Render",
    kind: "upscale",
    src: "/images/models/model-3.jpg",
    aspect: "1:1",
    modelName: "Clarity 4x",
    favorite: true,
    createdAt: "2026-11-18",
    prompt: "4x texture enhancement on glasshouse foliage",
  },
  {
    id: "ac-4",
    title: "Hardware Motion Loop",
    kind: "video",
    src: "/images/models/model-4.jpg",
    aspect: "16:9",
    modelName: "Motion Frame Pro",
    favorite: false,
    createdAt: "2026-11-17",
    prompt: "Smooth dolly pan across matte wireless audio kit",
  },
];

const initialModels: AiContentModel[] = [
  {
    id: "mdl-vision",
    name: "Vision Studio v2",
    modality: "Image",
    version: "2.4.0",
    summary: "Photorealistic studio composition with deterministic seed locking and clean typography masking.",
    thumbnail: "/images/models/model-5.jpg",
    runs: "48.2k",
    latency: "4.1s",
    tags: ["Editorial", "Product", "High-Res"],
    changelog: [
      { version: "2.4.0", date: "2026-11-14", notes: "Added 21:9 wide banner preset support." },
      { version: "2.3.1", date: "2026-10-22", notes: "Refined color calibration under dark lighting." },
    ],
  },
  {
    id: "mdl-motion",
    name: "Motion Frame Pro",
    modality: "Video",
    version: "1.8.0",
    summary: "Keyframe-consistent short product loops with configurable frame pacing.",
    thumbnail: "/images/models/model-6.jpg",
    runs: "19.6k",
    latency: "14.2s",
    tags: ["24fps", "Product Reel", "Loop"],
    changelog: [
      { version: "1.8.0", date: "2026-11-08", notes: "Added camera orbit curve controls." },
    ],
  },
  {
    id: "mdl-clarity",
    name: "Clarity 4x",
    modality: "Upscale",
    version: "3.0.1",
    summary: "Edge-preserving super-resolution up to 4x native raster dimensions.",
    thumbnail: "/images/models/model-7.jpg",
    runs: "62.9k",
    latency: "2.3s",
    tags: ["De-noise", "4x Scale", "Sharpen"],
    changelog: [
      { version: "3.0.1", date: "2026-11-01", notes: "Reduced halos around fine product edges." },
    ],
  },
];

class AiContentStore {
  assets = $state<AiContentAsset[]>(initialAssets);
  models = $state<AiContentModel[]>(initialModels);
  selectedModelId = $state<string>("mdl-vision");
  uploads = $state<{ id: string; name: string; size: number; uploadedAt: string }[]>([
    { id: "up-1", name: "studio-reference-kit.png", size: 428190, uploadedAt: "2026-11-21" },
  ]);
  apiKeys = $state<AiContentApiKey[]>([
    { id: "ck-1", label: "Media Pipeline Webhook", prefix: "coim_med_21b4", createdAt: "2026-11-10", active: true },
  ]);
  providerEndpoint = $state("");
  providerModel = $state("");
  hydrated = $state(false);

  get isProviderConfigured(): boolean {
    return Boolean(this.providerEndpoint.trim() && this.providerModel.trim());
  }

  get selectedModel(): AiContentModel {
    return this.models.find((m) => m.id === this.selectedModelId) ?? this.models[0];
  }

  hydrate() {
    if (this.hydrated || typeof window === "undefined") return;
    this.hydrated = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<{
        assets: AiContentAsset[];
        providerEndpoint: string;
        providerModel: string;
        apiKeys: AiContentApiKey[];
      }>;
      if (parsed.assets?.length) this.assets = parsed.assets;
      if (parsed.providerEndpoint) this.providerEndpoint = parsed.providerEndpoint;
      if (parsed.providerModel) this.providerModel = parsed.providerModel;
      if (parsed.apiKeys) this.apiKeys = parsed.apiKeys;
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
          assets: this.assets,
          providerEndpoint: this.providerEndpoint,
          providerModel: this.providerModel,
          apiKeys: this.apiKeys,
        }),
      );
    } catch {
      // Ignore storage error
    }
  }

  toggleFavorite(id: string) {
    this.assets = this.assets.map((a) => (a.id === id ? { ...a, favorite: !a.favorite } : a));
    this.persist();
  }

  deleteAsset(id: string) {
    this.assets = this.assets.filter((a) => a.id !== id);
    this.persist();
  }

  selectModel(id: string) {
    this.selectedModelId = id;
  }

  addUploadFiles(files: File[]) {
    const added = files.map((f, idx) => ({
      id: `up-${Date.now()}-${idx}`,
      name: f.name,
      size: f.size,
      uploadedAt: new Date().toISOString().slice(0, 10),
    }));
    this.uploads = [...added, ...this.uploads];
  }

  removeUpload(id: string) {
    this.uploads = this.uploads.filter((u) => u.id !== id);
  }

  configureProvider(endpoint: string, model: string) {
    this.providerEndpoint = endpoint.trim();
    this.providerModel = model.trim();
    this.persist();
  }

  createApiKey(label: string) {
    const key: AiContentApiKey = {
      id: `ck-${Date.now()}`,
      label: label.trim() || "Studio Client Key",
      prefix: `coim_med_${Math.random().toString(36).slice(2, 6)}`,
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
}

export const aiContentStore = new AiContentStore();
