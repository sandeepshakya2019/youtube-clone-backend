import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config();

connectDB()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.on("error", (error) => {
      console.log(`[-] App conection failed: ${error.message}`);
    });
    app.listen(port, () => {
      console.log(`[+] Server running on PORT : ${port}`);
    });
  })
  .catch((error) => {
    console.log("[-] Mongo Connection failed : " + error.message);
    process.exit(1);
  });
