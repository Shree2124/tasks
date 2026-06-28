import { Router } from "express";
import {
  createUser,
  loginUser,
  getCurrentUser,
  refreshAccessToken,
  logoutUser,
} from "../../controllers/user/auth.controller.js";
import { verifyJWT } from "../../middlewares/auth/auth.middleware.js";

const router = Router();

router.route("/register").post(createUser);
router.route("/login").post(loginUser);

// refresh access token
router.route("/refresh-token").post(refreshAccessToken);


// protected routs
router.use(verifyJWT);

router.route("/get-user").post(getCurrentUser)
router.route("/logout").post(logoutUser)

export default router;
