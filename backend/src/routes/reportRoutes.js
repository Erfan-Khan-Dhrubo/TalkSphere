import express from "express";
import { createPostReport } from "../controllers/reportController.js";

const router = express.Router();

// Create report for a post (no auth middleware)
router.post("/post/:postId", createPostReport);

export default router;

