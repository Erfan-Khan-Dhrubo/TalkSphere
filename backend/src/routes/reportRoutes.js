import express from "express";
import {
  createPostReport,
  createCommentReport,
  getAllReports,
  resolveReport,
  banUser,
  deletePostModeration,
  deleteCommentModeration,
} from "../controllers/reportController.js";

const router = express.Router();

// Create report for a post (no auth middleware)
router.post("/post/:postId", createPostReport);

// Create report for a comment (no auth middleware)
router.post("/comment/:commentId", createCommentReport);

// Get all reports (no auth middleware)
router.get("/", getAllReports);

// Resolve a report (no auth middleware)
router.patch("/:reportId/resolve", resolveReport);

// Ban a user (no auth middleware)
router.patch("/user/:userId/ban", banUser);

// Delete a post (for moderation, no auth middleware)
router.delete("/post/:postId", deletePostModeration);

// Delete a comment (for moderation, no auth middleware)
router.delete("/comment/:commentId", deleteCommentModeration);

export default router;

