import { Task } from "../../models/task/task.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.util.js";
import { ApiResponse } from "../../utils/ApiResponse.util.js";
import { User } from "../../models/user/user.model.js";

const assertTaskOwnership = async (userId, taskId) => {
  const user = await User.findOne({
    _id: userId,
    tasks: taskId,
  });

  if (!user) {
    throw new ApiError(403, "You are not allowed to access this task");
  }
};

const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate, category } = req.body;

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new ApiError(400, "Task title cannot be empty");
  }

  const task = await Task.create({
    title: title.trim(),
    description,
    priority,
    dueDate,
    category,
  });

  await User.findByIdAndUpdate(req.user._id, {
    $push: { tasks: task._id },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const getMyTasks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "tasks",
    options: { sort: { createdAt: -1 } },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user.tasks, "Tasks fetched successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  await assertTaskOwnership(req.user._id, taskId);

  const task = await Task.findByIdAndDelete(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { tasks: taskId },
  });

  return res.status(200).json(new ApiResponse(200, null, "Task deleted"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, priority, dueDate, category } = req.body;

  await assertTaskOwnership(req.user._id, taskId);

  const existingTask = await Task.findById(taskId);

  if (!existingTask) {
    throw new ApiError(404, "Task not found");
  }

  const updates = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      throw new ApiError(400, "Task title cannot be empty");
    }

    updates.title = title.trim();
  }

  if (status === "completed" && existingTask.status === "completed") {
    throw new ApiError(400, "Task is already marked as completed");
  }

  if (description !== undefined) updates.description = description;
  if (status !== undefined) updates.status = status;
  if (priority !== undefined) updates.priority = priority;
  if (dueDate !== undefined) updates.dueDate = dueDate;
  if (category !== undefined) updates.category = category;

  const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const markTaskAsCompleted = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  await assertTaskOwnership(req.user._id, taskId);

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (task.status === "completed") {
    throw new ApiError(400, "Task is already marked as completed");
  }

  task.status = "completed";
  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task marked as completed"));
});

export { createTask, getMyTasks, deleteTask, updateTask, markTaskAsCompleted };
