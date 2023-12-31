import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

export const defaultRoute = asyncHandler(async (req, res) => {
  const user = await User.find();
  console.log(user);
  res.status(201).json(new ApiResponse(200, "Uder get success", user));
});

function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  alert("You have entered an invalid email address!");
  return false;
}

export const registerUser = asyncHandler(async (req, res) => {
  // req.body by express
  const { fullName, email, userName, password } = req.body;

  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Please fill all details");
  }

  if (!ValidateEmail) {
    throw new ApiError(400, "Email address is not valid");
  }

  const checkUser = await User.findOne({
    $or: [{ email: email }, { userName: userName }],
  });

  if (checkUser) {
    throw new ApiError(400, "User Already exist");
  }

  const avatarLocalPath = req?.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req?.files?.coverImage?.[0]?.path;

  // req.files by multer

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required (Cloudinary Error)");
  }

  const newUser = User({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const savedUser = await newUser.save();
  console.log("Saved User", savedUser);

  if (!savedUser) {
    throw new ApiError(500, "Some thing went wrong while registering user");
  } else {
    delete savedUser.password;
    delete savedUser.refreshToken;

    res
      .status(201)
      .json(new ApiResponse(201, "User registered successfully", savedUser));
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    throw new ApiError(400, "Please enter all details");
  }

  if (!ValidateEmail(email)) {
    throw new ApiError(400, "Email is not valid");
  }

  const user = await User.findOne({ email: email });

  if (user) {
    let check = await user.isPasswordCheck(password, user.password);
    if (check) {
      const accesstoken = await user.genrateAccessToken();
      const refreshtoken = await user.genrateRefreshToken();
      user.refreshToken = refreshtoken;

      await user.save({ validateBeforeSave: false });

      const options = {
        httpOnly: true,
        secure: true,
      };

      res
        .status(200)
        .cookie("accessToken", accesstoken, options)
        .cookie("refreshToken", refreshtoken, options)
        .json(new ApiResponse(201, "User login successfully", user));
    } else {
      throw new ApiError(400, "Password is not valid");
    }
  } else {
    throw new ApiError(400, "User is not valid");
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(201, "User logout successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, "Unauthroize requeste");
  }

  const decodeToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodeToken?._id);
  if (!user) {
    throw new ApiError(400, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(400, "Refresh token is expired");
  }

  const accesstoken = await user.genrateAccessToken();
  const refreshtoken = await user.genrateRefreshToken();
  user.refreshToken = refreshtoken;

  await user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accesstoken, options)
    .cookie("refreshToken", refreshtoken, options)
    .json(new ApiResponse(201, "Access token refreshed", user));
});
