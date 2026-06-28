import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Clock,
  RefreshCw,
  Shield,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../api/axios";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import { adminService } from "../services/admin.service";
import type { AdminDashboardData } from "../types/admin.types";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <span className="text-blue-600">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminService.getDashboard();
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load admin dashboard"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-blue-600">
            <Shield className="h-5 w-5" aria-hidden />
            <span className="text-sm font-medium">Admin</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            System overview
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            User counts and task status summaries only — no passwords, tokens, or
            task content.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void fetchDashboard()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </section>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader size="lg" label="Loading admin data..." />
        </div>
      )}

      {!isLoading && error && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
          <AlertCircle className="h-10 w-10 text-red-600" aria-hidden />
          <div>
            <h3 className="font-semibold text-red-800">Could not load dashboard</h3>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => void fetchDashboard()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && data && (
        <>
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total users"
              value={data.systemTotals.users}
              icon={<Users className="h-5 w-5" />}
            />
            <StatCard
              label="Total tasks"
              value={data.systemTotals.tasks}
              icon={<Circle className="h-5 w-5" />}
            />
            <StatCard
              label="Completed"
              value={data.systemTotals.completed}
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
            <StatCard
              label="In progress"
              value={data.systemTotals.inProgress}
              icon={<Clock className="h-5 w-5" />}
            />
          </section>

          <section className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <strong>Privacy:</strong> Emails are masked. Task titles, descriptions,
            and credentials are never exposed on this dashboard.
          </section>

          {data.users.length === 0 ? (
            <EmptyState
              title="No users yet"
              description="Registered users will appear here with aggregated task statistics."
            />
          ) : (
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-700">User</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Email</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Role</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Joined</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">
                        Total
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">
                        To do
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">
                        In progress
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">
                        Done
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.users.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900">{row.displayName}</p>
                          <p className="text-xs text-slate-500">@{row.username}</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-600">
                          {row.emailMasked}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              row.role === "admin"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {row.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {formatDate(row.joinedAt)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">
                          {row.taskStats.total}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600">
                          {row.taskStats.todo}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600">
                          {row.taskStats["in-progress"]}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600">
                          {row.taskStats.completed}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-slate-200 bg-slate-50 font-medium">
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-slate-700">
                        System totals
                      </td>
                      <td className="px-4 py-3 text-right text-slate-900">
                        {data.systemTotals.tasks}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700">
                        {data.systemTotals.todo}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700">
                        {data.systemTotals.inProgress}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700">
                        {data.systemTotals.completed}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
