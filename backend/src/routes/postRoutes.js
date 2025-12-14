import express from "express";
import {
  createPost,
  deletePost,
  downvotePost,
  getAllPosts,
  getPostById,
  updatePost,
  upvotePost,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);
// Voting endpoints
router.patch("/:id/upvote", upvotePost);
router.patch("/:id/downvote", downvotePost);

export default router;
