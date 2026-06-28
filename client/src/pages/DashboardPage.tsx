import { AlertCircle, Plus, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "../api/axios";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import TodoCard from "../components/TodoCard";
import TodoForm from "../components/TodoForm";
import { todoService } from "../services/todo.service";
import type { CreateTaskPayload, Task, TaskFilter } from "../types/todo.types";

const filters: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "todo", label: "To do" },
  { value: "in-progress", label: "In progress" },
  { value: "completed", label: "Done" },
];

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await todoService.getTasks();
      setTasks(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load tasks"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesFilter = filter === "all" || task.status === filter;
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        (task.description?.toLowerCase().includes(query) ?? false) ||
        (task.category?.toLowerCase().includes(query) ?? false);
      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, search]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    return { total, completed, active: total - completed };
  }, [tasks]);

  const handleCreate = async (payload: CreateTaskPayload) => {
    setIsSubmitting(true);
    try {
      const created = await todoService.createTask(payload);
      setTasks((prev) => [created, ...prev]);
      setShowForm(false);
      toast.success("Task created");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create task"));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (payload: CreateTaskPayload) => {
    if (!editingTask) return;
    setIsSubmitting(true);
    try {
      const updated = await todoService.updateTask(editingTask._id, payload);
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
      setEditingTask(null);
      toast.success("Task updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update task"));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (task: Task) => {
    setTogglingId(task._id);
    try {
      let updated: Task;
      if (task.status === "completed") {
        updated = await todoService.updateTask(task._id, { status: "todo" });
        toast.success("Task marked as incomplete");
      } else {
        updated = await todoService.markComplete(task._id);
        toast.success("Task completed");
      }
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update task status"));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (task: Task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    setDeletingId(task._id);
    try {
      await todoService.deleteTask(task._id);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
      if (editingTask?._id === task._id) setEditingTask(null);
      toast.success("Task deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete task"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Your tasks</h2>
          <p className="mt-1 text-sm text-slate-600">
            {stats.active} active · {stats.completed} completed · {stats.total} total
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingTask(null);
            setShowForm((v) => !v);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {showForm && !editingTask ? "Hide form" : "New task"}
        </button>
      </section>

      {(showForm || editingTask) && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            {editingTask ? "Edit task" : "Create a new task"}
          </h3>
          <TodoForm
            key={editingTask?._id ?? "new"}
            initialTask={editingTask}
            onSubmit={editingTask ? handleUpdate : handleCreate}
            onCancel={
              editingTask
                ? () => setEditingTask(null)
                : () => setShowForm(false)
            }
            submitLabel={editingTask ? "Save changes" : "Add task"}
            isSubmitting={isSubmitting}
          />
        </section>
      )}

      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                filter === f.value
                  ? "bg-blue-600 text-white"
                  : "border border-slate-300 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader size="lg" label="Loading your tasks..." />
        </div>
      )}

      {!isLoading && error && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
          <AlertCircle className="h-10 w-10 text-red-600" aria-hidden />
          <div>
            <h3 className="font-semibold text-red-800">Could not load tasks</h3>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => void fetchTasks()}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && filteredTasks.length === 0 && (
        <EmptyState
          title={tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
          description={
            tasks.length === 0
              ? "Create your first task to get started and stay on top of your day."
              : "Try a different search or filter to find what you need."
          }
          action={
            tasks.length === 0 ? (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" aria-hidden />
                Add your first task
              </button>
            ) : undefined
          }
        />
      )}

      {!isLoading && !error && filteredTasks.length > 0 && (
        <ul className="grid gap-3 sm:gap-4">
          {filteredTasks.map((task) => (
            <li key={task._id}>
              <TodoCard
                task={task}
                onToggle={handleToggle}
                onEdit={(t) => {
                  setShowForm(false);
                  setEditingTask(t);
                }}
                onDelete={handleDelete}
                isToggling={togglingId === task._id}
                isDeleting={deletingId === task._id}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
