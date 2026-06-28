import mongoose, { model } from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      validate: {
        validator: (value) => value.trim().length > 0,
        message: "Task title cannot be empty",
      },
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: {
      type: Date,
    },

    category: {
      type: String,
      trim: true,
      default: "general",
    },
  },
  { timestamps: true }
);

export const Task = model("Task", TaskSchema);
