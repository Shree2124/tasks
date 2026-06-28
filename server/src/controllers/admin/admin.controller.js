import { User } from "../../models/user/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.util.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { maskEmail, toDisplayName } from "../../utils/privacy.util.js";

const EMPTY_STATUS_COUNTS = {
  todo: 0,
  "in-progress": 0,
  completed: 0,
  total: 0,
};

const countTasksByStatus = (tasks = []) => {
  const counts = { ...EMPTY_STATUS_COUNTS };
  for (const task of tasks) {
    const status = task?.status;
    if (status && Object.prototype.hasOwnProperty.call(counts, status)) {
      counts[status] += 1;
    }
    counts.total += 1;
  }
  return counts;
};

const getAdminDashboard = asyncHandler(async (_req, res) => {
  const users = await User.find()
    .select("firstName lastName username email createdAt role tasks")
    .populate({ path: "tasks", select: "status" })
    .sort({ createdAt: -1 })
    .lean();

  const usersSummary = users.map((user) => {
    const taskStats = countTasksByStatus(user.tasks);
    return {
      id: user._id,
      displayName: toDisplayName(user),
      username: user.username,
      emailMasked: maskEmail(user.email),
      role: user.role,
      joinedAt: user.createdAt,
      taskStats,
    };
  });

  const systemTotals = usersSummary.reduce(
    (acc, row) => {
      acc.users += 1;
      acc.tasks += row.taskStats.total;
      acc.todo += row.taskStats.todo;
      acc.inProgress += row.taskStats["in-progress"];
      acc.completed += row.taskStats.completed;
      if (row.role === "admin") acc.admins += 1;
      return acc;
    },
    { users: 0, admins: 0, tasks: 0, todo: 0, inProgress: 0, completed: 0 }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        systemTotals,
        users: usersSummary,
      },
      "Admin dashboard data fetched successfully"
    )
  );
});

export { getAdminDashboard };
