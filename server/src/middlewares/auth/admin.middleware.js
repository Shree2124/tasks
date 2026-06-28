import { ApiError } from "../../utils/ApiError.util.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized request");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }

  next();
});
