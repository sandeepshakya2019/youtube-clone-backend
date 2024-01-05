import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// process.env.API_KEY;

connectDB()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.on("error", (error) => {
      console.log(`[-] App conection failed: ${error.message}`);
      process.exit(1);
    });
    app.listen(port, () => {
      console.log(`[+] Server running on PORT : ${port}`);
    });
  })
  .catch((error) => {
    console.log("[-] Mongo Connection failed : " + error.message);
    process.exit(1);
  });

// app.on("error", (error) => {
//   console.log(`[-] App conection failed: ${error.message}`);
//   process.exit(1);
// });
// app.listen(process.env.PORT, () => {
//   console.log(`[+] Server running on PORT : ${process.env.PORT}`);
// });
