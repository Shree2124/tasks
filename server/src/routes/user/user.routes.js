import { Router } from "express";
import {
  createTask,
  deleteTask,
  getMyTasks,
  markTaskAsCompleted,
  updateTask,
} from "../../controllers/user/user.controller.js";
import { verifyJWT } from "../../middlewares/auth/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/add-task").post(createTask);
router.route("/update-task/:taskId").put(updateTask);
router.route("/complete-task/:taskId").patch(markTaskAsCompleted);
router.route("/get-tasks").get(getMyTasks);
router.route("/delete-task/:taskId").delete(deleteTask);

export default router;
