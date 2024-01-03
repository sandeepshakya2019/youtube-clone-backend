import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import route from "./routes/user.route.js";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Json data limit (which is coming from backend)
app.use(express.json({ limit: "30kb" }));
// to parse the url in same format
app.use(express.urlencoded({ extended: true, limit: "30kb" }));
// use the public folder as public
app.use(express.static("public"));
/// to set or access cookies from browser
app.use(cookieParser());

app.use("/api/user", route);

export { app };
