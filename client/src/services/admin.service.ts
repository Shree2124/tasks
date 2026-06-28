import { api } from "../api/axios";
import type { ApiResponse } from "../types/api.types";
import type { AdminDashboardData } from "../types/admin.types";

export const adminService = {
  async getDashboard(): Promise<AdminDashboardData> {
    const { data } = await api.get<ApiResponse<AdminDashboardData>>(
      "/admin/dashboard"
    );
    return data.data;
  },
};
