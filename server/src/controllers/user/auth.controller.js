import { User } from "../../models/user/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.util.js";
import { ApiError } from "../../utils/ApiError.util.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {
  options,
  refreshTokenSecret,
} from "../../config/settings.js";
import { generateAccessAndRefreshTokens } from "../../utils/createRefreshAndAccessToken.js";
import { isAdminEmail, resolveRoleForEmail } from "../../utils/admin.util.js";

// Registration
const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (!firstName || !username || !email || !password) {
    throw new ApiError(400, "Please provide all required fields");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(400, "User with this email or username already exists");
  }

  const user = new User({
    username,
    firstName,
    lastName,
    email,
    password,
    role: resolveRoleForEmail(email),
  });

  await user.save();

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  if ((!username || !email) && !password) {
    throw new ApiError(400, "All fields are required");
  }

  let user = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (!user) {
    if (email === "test1@gmail.com" && password === " test@123") {
      const baseUsername = "demo_user";
      let uniqueUsername = baseUsername;
      let counter = 1;
      while (await User.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${baseUsername}_${counter}`;
        counter++;
      }

      user = new User({
        username: uniqueUsername,
        firstName: "Demo",
        lastName: "User",
        email: "test1@gmail.com",
        password: " test@123",
        role: "user",
      });
      await user.save();
    } else {
      throw new ApiError(401, "Invalid user credentials");
    }
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  if (isAdminEmail(user.email) && user.role !== "admin") {
    user.role = "admin";
    await user.save({ validateBeforeSave: false });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

// Logout
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, 
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});


// get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

// refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req?.cookies?.refreshToken || req?.body?.refreshToken;
  console.log(incomingRefreshToken);

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, refreshTokenSecret);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
};
