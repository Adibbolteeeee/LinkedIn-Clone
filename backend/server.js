import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: "https://linkedin-clone-backend-qafw.onrender.com",
  credentials: true
}));
app.use(express.static("uploads"));
app.use(postRoutes);
app.use(userRoutes);

// ✅ DB connection
async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
  } catch (e) {
    console.log("MongoDB Not Connected", e);
  }
}

await main();

// ✅ Server
app.listen(9090, () => {
  console.log("Server is listening on port 9090");
});