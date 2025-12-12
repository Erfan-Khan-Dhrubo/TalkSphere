import express from "express";
import {
  addComment,
  deleteComment,
  downvoteComment,
  editComment,
  getCommentsForPost,
  replyToComment,
  upvoteComment,
} from "../controllers/commentController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:postId", getCommentsForPost);
router.post("/:postId", authenticate, addComment);
router.post("/reply/:commentId", authenticate, replyToComment);
router.put("/:commentId", authenticate, editComment);
router.delete("/:commentId", authenticate, deleteComment);
router.post("/upvote/:commentId", authenticate, upvoteComment);
router.post("/downvote/:commentId", authenticate, downvoteComment);

export default router;

