export interface UserFriend {
  id: string;
  name: string;
  role: string;
  avatar: string;
  connected: boolean;
  mutuals: number;
}

export interface UserPermission {
  id: string;
  scope: string;
  description: string;
  read: boolean;
  write: boolean;
  admin: boolean;
}

export interface UserProject {
  id: string;
  name: string;
  status: "Active" | "Completed" | "Planned";
  progress: number;
  role: string;
  updated: string;
}

export interface SocialPost {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  liked: boolean;
}

class UserProfileStore {
  friends = $state<UserFriend[]>([
    { id: "fr-1", name: "Mateo Khan", role: "Release Architect", avatar: "/images/avatars/avatar-2.jpg", connected: true, mutuals: 14 },
    { id: "fr-2", name: "Sora Park", role: "Principal Designer", avatar: "/images/avatars/avatar-4.jpg", connected: true, mutuals: 11 },
    { id: "fr-3", name: "Nadia Volkov", role: "Accessibility Lead", avatar: "/images/avatars/avatar-6.jpg", connected: false, mutuals: 7 },
    { id: "fr-4", name: "Kenji Sato", role: "Frontend Engineer", avatar: "/images/avatars/avatar-7.jpg", connected: true, mutuals: 9 },
  ]);

  permissions = $state<UserPermission[]>([
    { id: "prm-1", scope: "Design Tokens & Themes", description: "Modify workspace palettes, radii, and elevation presets.", read: true, write: true, admin: true },
    { id: "prm-2", scope: "DataGrid & Financial Exports", description: "Configure pivot matrices, bulk row edits, and XLSX exports.", read: true, write: true, admin: false },
    { id: "prm-3", scope: "API Keys & Gateway Secrets", description: "Issue, rotate, and revoke client tokens.", read: true, write: false, admin: false },
    { id: "prm-4", scope: "Organization Memberships", description: "Invite collaborators and assign role boundaries.", read: true, write: true, admin: false },
  ]);

  projects = $state<UserProject[]>([
    { id: "up-1", name: "CoimUI v1.0 Design System", status: "Active", progress: 92, role: "Maintainer", updated: "Nov 23, 2026" },
    { id: "up-2", name: "Enterprise DataGrid Pivot Engine", status: "Completed", progress: 100, role: "Architect", updated: "Nov 22, 2026" },
    { id: "up-3", name: "RTL & Arabic Localization Pack", status: "Completed", progress: 100, role: "Reviewer", updated: "Nov 19, 2026" },
    { id: "up-4", name: "Automated Visual Parity Suite", status: "Planned", progress: 45, role: "Contributor", updated: "Nov 20, 2026" },
  ]);

  posts = $state<SocialPost[]>([
    {
      id: "sp-1",
      author: "Laura Ellis",
      avatar: "/images/avatars/avatar-3.jpg",
      time: "1 hour ago",
      content: "Shipped collapsible column groups, full-row editing, and the drag-and-drop Pivot Field Configurator for CoimDataGrid.",
      likes: 18,
      liked: false,
    },
    {
      id: "sp-2",
      author: "Sora Park",
      avatar: "/images/avatars/avatar-4.jpg",
      time: "Yesterday",
      content: "Verified WCAG 2.1 AA contrast ratios across Light and Dark modes for Purple, Blue, Green, and Orange presets.",
      likes: 27,
      liked: true,
    },
  ]);

  toggleFriend(id: string) {
    this.friends = this.friends.map((f) => (f.id === id ? { ...f, connected: !f.connected } : f));
  }

  togglePermission(id: string, field: "read" | "write" | "admin") {
    this.permissions = this.permissions.map((p) => (p.id === id ? { ...p, [field]: !p[field] } : p));
  }

  addPost(content: string) {
    const trimmed = content.trim();
    if (!trimmed) return;
    this.posts = [
      {
        id: `sp-${Date.now()}`,
        author: "Laura Ellis",
        avatar: "/images/avatars/avatar-3.jpg",
        time: "Just now",
        content: trimmed,
        likes: 0,
        liked: false,
      },
      ...this.posts,
    ];
  }

  toggleLike(id: string) {
    this.posts = this.posts.map((p) =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p,
    );
  }
}

export const userProfileStore = new UserProfileStore();
