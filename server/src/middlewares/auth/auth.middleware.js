import { User } from "../../models/user/user.model.js";
import { ApiError } from "../../utils/ApiError.util.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log("token", token);

    if (!token) {
      throw new ApiError(401, "Unauthorize request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decodedToken", decodedToken)
    const user = await User.findById(decodedToken?.userId || decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access Token");
    }

    req.user = user;
    console.log("success");

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
