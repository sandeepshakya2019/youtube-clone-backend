import { Router } from "express";
import {
  defaultRoute,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, verifyJWTatLogin } from "../middlewares/auth.middleware.js";

const route = Router();

route.get("/", defaultRoute);
route.post("/login", verifyJWTatLogin, loginUser);
route.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
route.post("/logout", verifyJWT, logoutUser);
route.post("/refreshtoken", refreshAccessToken);

export default route;
