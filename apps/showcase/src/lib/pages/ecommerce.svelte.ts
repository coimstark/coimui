export interface EcommerceProduct {
  id: string;
  sku: string;
  name: string;
  category: "Hardware" | "Lighting" | "Workspace";
  price: number;
  stock: number;
  rating: number;
  status: "In Stock" | "Low Stock" | "Draft";
  image: string;
  summary: string;
  specs: { label: string; value: string }[];
  reviews: { id: string; author: string; rating: number; comment: string; date: string }[];
}

export interface EcommerceOrder {
  id: string;
  customer: string;
  email: string;
  itemsCount: number;
  total: number;
  status: "Fulfilled" | "Processing" | "Shipped";
  date: string;
  shippingAddress: string;
  lineItems: { name: string; sku: string; qty: number; unitPrice: number }[];
}

const initialProducts: EcommerceProduct[] = [
  {
    id: "prod-1",
    sku: "COIM-AUD-01",
    name: "Reference Studio Monitors",
    category: "Hardware",
    price: 490,
    stock: 42,
    rating: 4.9,
    status: "In Stock",
    image: "/images/products/product-1.jpg",
    summary: "Near-field acoustic monitors tuned cleanly for neutral studio playback.",
    specs: [
      { label: "Drivers", value: "5.25 in Woven Kevlar" },
      { label: "Connectivity", value: "Balanced XLR & USB-C" },
      { label: "Weight", value: "4.6 kg / unit" },
    ],
    reviews: [
      { id: "r1", author: "Laura Ellis", rating: 5, comment: "Flat midrange response right out of the box.", date: "Nov 18, 2026" },
    ],
  },
  {
    id: "prod-2",
    sku: "COIM-LMP-02",
    name: "Anodized Desk Task Lamp",
    category: "Lighting",
    price: 185,
    stock: 9,
    rating: 4.7,
    status: "Low Stock",
    image: "/images/products/product-2.jpg",
    summary: "Flicker-free 97 CRI task light with stepless warm-to-cool temperature dial.",
    specs: [
      { label: "Luminous Flux", value: "950 lm" },
      { label: "Color Index", value: "97+ CRI" },
      { label: "Finish", value: "Brushed Slate Aluminum" },
    ],
    reviews: [],
  },
  {
    id: "prod-3",
    sku: "COIM-WRK-03",
    name: "Modular Ceramic Tray Set",
    category: "Workspace",
    price: 78,
    stock: 114,
    rating: 4.8,
    status: "In Stock",
    image: "/images/products/product-3.jpg",
    summary: "Weighted kiln-glazed desk organizers with felt protective undersides.",
    specs: [
      { label: "Pieces", value: "4 interlocking trays" },
      { label: "Material", value: "Stoneware ceramic" },
    ],
    reviews: [],
  },
  {
    id: "prod-4",
    sku: "COIM-WRK-04",
    name: "Ergonomic Wrist Console",
    category: "Workspace",
    price: 112,
    stock: 0,
    rating: 4.5,
    status: "Draft",
    image: "/images/products/product-4.jpg",
    summary: "Contoured hardwood and memory-foam palm rest for compact mechanical keyboards.",
    specs: [
      { label: "Width", value: "360 mm (75% / TKL)" },
      { label: "Surface", value: "Oiled American Walnut" },
    ],
    reviews: [],
  },
];

const initialOrders: EcommerceOrder[] = [
  {
    id: "ORD-8821",
    customer: "Northstar Labs",
    email: "ap@northstar.example",
    itemsCount: 3,
    total: 1165,
    status: "Shipped",
    date: "2026-11-21",
    shippingAddress: "240 Market Street, Suite 1400, San Francisco, CA",
    lineItems: [
      { name: "Reference Studio Monitors", sku: "COIM-AUD-01", qty: 2, unitPrice: 490 },
      { name: "Anodized Desk Task Lamp", sku: "COIM-LMP-02", qty: 1, unitPrice: 185 },
    ],
  },
  {
    id: "ORD-8822",
    customer: "Aurelia Retail",
    email: "ops@aurelia.example",
    itemsCount: 4,
    total: 526,
    status: "Processing",
    date: "2026-11-22",
    shippingAddress: "88 King William St, London EC4N",
    lineItems: [
      { name: "Anodized Desk Task Lamp", sku: "COIM-LMP-02", qty: 2, unitPrice: 185 },
      { name: "Modular Ceramic Tray Set", sku: "COIM-WRK-03", qty: 2, unitPrice: 78 },
    ],
  },
  {
    id: "ORD-8823",
    customer: "Velox Logistics",
    email: "billing@velox.example",
    itemsCount: 5,
    total: 390,
    status: "Fulfilled",
    date: "2026-11-19",
    shippingAddress: "10 Anson Rd #12-01, Singapore 079903",
    lineItems: [
      { name: "Modular Ceramic Tray Set", sku: "COIM-WRK-03", qty: 5, unitPrice: 78 },
    ],
  },
];

class EcommerceStore {
  products = $state<EcommerceProduct[]>(initialProducts);
  orders = $state<EcommerceOrder[]>(initialOrders);
  selectedProductId = $state<string>("prod-1");
  selectedOrderId = $state<string>("ORD-8821");

  get selectedProduct(): EcommerceProduct {
    return this.products.find((p) => p.id === this.selectedProductId) ?? this.products[0];
  }

  get selectedOrder(): EcommerceOrder {
    return this.orders.find((o) => o.id === this.selectedOrderId) ?? this.orders[0];
  }

  selectProduct(id: string) {
    this.selectedProductId = id;
  }

  selectOrder(id: string) {
    this.selectedOrderId = id;
  }

  updatePrice(id: string, nextPrice: number) {
    if (!Number.isFinite(nextPrice) || nextPrice < 0) return;
    this.products = this.products.map((p) => (p.id === id ? { ...p, price: nextPrice } : p));
  }

  addReview(productId: string, author: string, rating: number, comment: string) {
    if (!comment.trim()) return;
    this.products = this.products.map((p) =>
      p.id === productId
        ? {
            ...p,
            reviews: [
              {
                id: `rev-${Date.now()}`,
                author: author.trim() || "Workspace Reviewer",
                rating,
                comment: comment.trim(),
                date: new Date().toLocaleDateString(),
              },
              ...p.reviews,
            ],
          }
        : p,
    );
  }

  updateOrderStatus(orderId: string, status: EcommerceOrder["status"]) {
    this.orders = this.orders.map((o) => (o.id === orderId ? { ...o, status } : o));
  }
}

export const ecommerceStore = new EcommerceStore();
