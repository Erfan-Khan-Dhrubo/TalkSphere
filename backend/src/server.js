import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*", // http://localhost:5173
  })
);

app.use(express.json());

// User API Call
app.use("/api/users", userRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on port:", PORT);
  });
});
