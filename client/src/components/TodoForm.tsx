import { Calendar, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import type { CreateTaskPayload, Task, TaskPriority } from "../types/todo.types";

interface TodoFormProps {
  initialTask?: Task | null;
  onSubmit: (payload: CreateTaskPayload) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

const priorities: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const fieldClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

export default function TodoForm({
  initialTask,
  onSubmit,
  onCancel,
  submitLabel = "Add task",
  isSubmitting = false,
}: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("general");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description ?? "");
      setPriority(initialTask.priority);
      setCategory(initialTask.category ?? "general");
      setDueDate(
        initialTask.dueDate
          ? new Date(initialTask.dueDate).toISOString().slice(0, 10)
          : ""
      );
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategory("general");
      setDueDate("");
    }
    setError("");
  }, [initialTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Title is required");
      return;
    }
    setError("");
    await onSubmit({
      title: trimmed,
      description: description.trim() || undefined,
      priority,
      category: category.trim() || "general",
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    });
    if (!initialTask) {
      setTitle("");
      setDescription("");
      setDueDate("");
      setCategory("general");
      setPriority("medium");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className={fieldClass}
          disabled={isSubmitting}
        />
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Optional details..."
          className={`${fieldClass} resize-none`}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="priority" className="mb-1.5 block text-sm font-medium text-slate-700">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className={fieldClass}
            disabled={isSubmitting}
          >
            {priorities.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700">
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            Due date
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={fieldClass}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700">
            <Tag className="h-3.5 w-3.5" aria-hidden />
            Category
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="general"
            className={fieldClass}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
