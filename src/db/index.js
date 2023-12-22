import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export default async function connectDB() {
  try {
    const url = process.env.MONGODB_URL + "/" + DB_NAME;
    const dbres = await mongoose.connect(url);
    console.log(`[+] Mongo Conected on HOST : ${dbres.connection.host}`);
    return true;
  } catch (error) {
    console.log("[-] Mongo Connection failed : " + error.message);
    process.exit(1);
  }
}
