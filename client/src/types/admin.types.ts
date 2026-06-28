export interface TaskStatusCounts {
  todo: number;
  "in-progress": number;
  completed: number;
  total: number;
}

export interface AdminUserSummary {
  id: string;
  displayName: string;
  username: string;
  emailMasked: string;
  role: "user" | "admin";
  joinedAt: string;
  taskStats: TaskStatusCounts;
}

export interface AdminSystemTotals {
  users: number;
  admins: number;
  tasks: number;
  todo: number;
  inProgress: number;
  completed: number;
}

export interface AdminDashboardData {
  systemTotals: AdminSystemTotals;
  users: AdminUserSummary[];
}
