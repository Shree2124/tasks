import { Router } from "express";
import { getAdminDashboard } from "../../controllers/admin/admin.controller.js";
import { verifyJWT } from "../../middlewares/auth/auth.middleware.js";
import { verifyAdmin } from "../../middlewares/auth/admin.middleware.js";

const router = Router();

router.use(verifyJWT, verifyAdmin);

router.route("/dashboard").get(getAdminDashboard);

export default router;
