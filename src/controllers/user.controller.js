import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const defaultRoute = asyncHandler(async (req, res) => {
  res.status(201).json({
    message: "Get User Success",
    user: [],
  });
});

function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  alert("You have entered an invalid email address!");
  return false;
}

export const loginUser = asyncHandler(async (req, res) => {
  res.status(201).json({
    message: "User login successfully",
    user: [],
  });
});

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

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

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
  console.log(savedUser);

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
