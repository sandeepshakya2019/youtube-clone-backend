import { jwt } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accesstoken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError("400", "Authrization failed");
    }
    const decodeInfo = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodeInfo?._id).select(
      "-password -refreshToken "
    );

    if (!user) {
      throw new ApiError("400", "No User found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError("401", error.message || "Invalid access token");
  }
});
