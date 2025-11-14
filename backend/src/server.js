import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*", // http://localhost:5173
  })
);

app.use(express.json());

connectDB().then(() => {
  // app.listen() starts the server so it can listen for requests.
  app.listen(PORT, () => {
    console.log("Server started on port:", PORT);
  });
});
