import {
  Calendar,
  Check,
  Circle,
  Pencil,
  Trash2,
} from "lucide-react";
import type { Task } from "../types/todo.types";

interface TodoCardProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  isToggling?: boolean;
  isDeleting?: boolean;
}

const priorityStyles: Record<Task["priority"], string> = {
  low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  high: "bg-red-50 text-red-700 ring-red-200",
};

const statusLabels: Record<Task["status"], string> = {
  todo: "To do",
  "in-progress": "In progress",
  completed: "Done",
};

export default function TodoCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  isToggling,
  isDeleting,
}: TodoCardProps) {
  const isCompleted = task.status === "completed";

  const formattedDue = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <article
      className={`rounded-xl border bg-white p-4 shadow-sm transition hover:border-blue-300 sm:p-5 ${
        isCompleted ? "border-slate-200 opacity-80" : "border-slate-200"
      }`}
    >
      <div className="flex gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => onToggle(task)}
          disabled={isToggling || isDeleting}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition disabled:cursor-not-allowed disabled:opacity-50 ${
            isCompleted
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-slate-300 text-transparent hover:border-blue-600 hover:text-blue-600"
          }`}
        >
          {isCompleted ? (
            <Check className="h-4 w-4" aria-hidden />
          ) : (
            <Circle className="h-4 w-4 text-slate-300" aria-hidden />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3
              className={`text-base font-semibold leading-snug ${
                isCompleted ? "text-slate-400 line-through" : "text-slate-900"
              }`}
            >
              {task.title}
            </h3>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => onEdit(task)}
                disabled={isDeleting}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                aria-label="Edit task"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(task)}
                disabled={isDeleting}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {task.description && (
            <p
              className={`mt-1.5 text-sm leading-relaxed ${
                isCompleted ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${priorityStyles[task.priority]}`}
            >
              {task.priority}
            </span>
            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
              {statusLabels[task.status]}
            </span>
            {task.category && (
              <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700">
                {task.category}
              </span>
            )}
            {formattedDue && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Calendar className="h-3 w-3" aria-hidden />
                {formattedDue}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
