export interface SupportComment {
  id: string;
  author: string;
  time: string;
  body: string;
}

export interface SupportIssue {
  id: string;
  title: string;
  category: "Billing" | "UI Bug" | "Performance" | "Access";
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  assignee: string;
  reporter: string;
  createdAt: string;
  description: string;
  comments: SupportComment[];
}

const initialIssues: SupportIssue[] = [
  {
    id: "SUP-301",
    title: "Dark mode contrast verification on grouped DataGrid footers",
    category: "UI Bug",
    priority: "Medium",
    status: "In Progress",
    assignee: "Laura Ellis",
    reporter: "Northstar QA",
    createdAt: "2026-11-21",
    description: "Verify summary row contrast meets WCAG 2.1 AA in dark Orange and Purple presets.",
    comments: [
      { id: "sc-1", author: "Laura Ellis", time: "2 hours ago", body: "Confirmed 7.4:1 contrast across both dark presets." },
    ],
  },
  {
    id: "SUP-302",
    title: "Provision enterprise workspace API token limits",
    category: "Access",
    priority: "High",
    status: "Open",
    assignee: "Mateo Khan",
    reporter: "Aurelia Ops",
    createdAt: "2026-11-22",
    description: "Enable multi-prefix token rotation for staging runners.",
    comments: [],
  },
  {
    id: "SUP-303",
    title: "CSV export BOM compatibility for European locales",
    category: "Billing",
    priority: "Low",
    status: "Resolved",
    assignee: "Sora Park",
    reporter: "Velox Finance",
    createdAt: "2026-11-18",
    description: "Confirm UTF-8 decimal separators export cleanly across spreadsheets.",
    comments: [],
  },
];

class SupportStore {
  issues = $state<SupportIssue[]>(initialIssues);
  selectedIssueId = $state<string>("SUP-301");

  get selectedIssue(): SupportIssue {
    return this.issues.find((i) => i.id === this.selectedIssueId) ?? this.issues[0];
  }

  selectIssue(id: string) {
    this.selectedIssueId = id;
  }

  createIssue(input: {
    title: string;
    category: SupportIssue["category"];
    priority: SupportIssue["priority"];
    description: string;
  }) {
    const id = `SUP-${304 + this.issues.length}`;
    const created: SupportIssue = {
      id,
      title: input.title.trim(),
      category: input.category,
      priority: input.priority,
      status: "Open",
      assignee: "Laura Ellis",
      reporter: "Workspace User",
      createdAt: new Date().toISOString().slice(0, 10),
      description: input.description.trim(),
      comments: [],
    };
    this.issues = [created, ...this.issues];
    this.selectedIssueId = id;
    return created;
  }

  updateStatus(id: string, status: SupportIssue["status"]) {
    this.issues = this.issues.map((i) => (i.id === id ? { ...i, status } : i));
  }

  addComment(issueId: string, author: string, body: string) {
    const trimmed = body.trim();
    if (!trimmed) return;
    this.issues = this.issues.map((i) =>
      i.id === issueId
        ? {
            ...i,
            comments: [
              ...i.comments,
              { id: `cmt-${Date.now()}`, author, time: "Just now", body: trimmed },
            ],
          }
        : i,
    );
  }
}

export const supportStore = new SupportStore();
