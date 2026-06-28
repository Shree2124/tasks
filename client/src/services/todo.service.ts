import { api } from "../api/axios";
import type { ApiResponse } from "../types/api.types";
import type {
  CreateTaskPayload,
  Task,
  UpdateTaskPayload,
} from "../types/todo.types";

export const todoService = {
  async getTasks(): Promise<Task[]> {
    const { data } = await api.get<ApiResponse<Task[]>>("/user/get-tasks");
    return data.data ?? [];
  },

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    const { data } = await api.post<ApiResponse<Task>>("/user/add-task", payload);
    return data.data;
  },

  async updateTask(taskId: string, payload: UpdateTaskPayload): Promise<Task> {
    const { data } = await api.put<ApiResponse<Task>>(
      `/user/update-task/${taskId}`,
      payload
    );
    return data.data;
  },

  async markComplete(taskId: string): Promise<Task> {
    const { data } = await api.patch<ApiResponse<Task>>(
      `/user/complete-task/${taskId}`
    );
    return data.data;
  },

  async deleteTask(taskId: string): Promise<void> {
    await api.delete(`/user/delete-task/${taskId}`);
  },
};
