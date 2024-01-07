import { Router } from "express";
import {
  defaultRoute,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const route = Router();

route.get("/", defaultRoute);
route.post("/login", loginUser);
route.post("/logout", verifyJWT, logoutUser);
route.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

export default route;
