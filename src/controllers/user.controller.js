import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
    return new ApiError(400, "Please fill all details");
  }

  if (!ValidateEmail) {
    return new ApiError(400, "Email address is not valid");
  }
  console.log(User.findOne({ email: email }));
  console.log(
    User.findOne({ $or: [{ email: email }, { userName: userName }] })
  );

  if (User.findOne({ $or: [{ email: email }, { userName: userName }] })) {
    return new ApiError(400, "User Already exist");
  }

  // req.files by multer
  console.log("Files by multer", req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    return new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    console.log("Cludinary erraor");
    return new ApiError(400, "Avatar is required");
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
    return new ApiError(500, "Some thing went wrong while registering user");
  } else {
    delete savedUser.password;
    delete savedUser.refreshToken;

    res.status(201).json(new ApiResponse(201, "User registered successfully"));
  }
});
