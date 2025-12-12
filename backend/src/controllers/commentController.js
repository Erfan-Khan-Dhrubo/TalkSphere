import Comment from "../models/commentModel.js";
import PostModel from "../models/postModel.js";

// Build nested tree from flat list
const buildCommentTree = (comments) => {
  const map = new Map();
  const roots = [];

  comments.forEach((comment) => {
    const commentObj = { ...comment.toObject(), replies: [] };
    map.set(commentObj._id.toString(), commentObj);
  });

  map.forEach((comment) => {
    if (comment.parentId) {
      const parent = map.get(comment.parentId.toString());
      if (parent) parent.replies.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
};

// Create a top-level comment
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      content: content.trim(),
      postId,
      userId: req.user.id,
      parentId: null,
    });

    await PostModel.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reply to an existing comment
export const replyToComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const parentComment = await Comment.findById(commentId);
    if (!parentComment)
      return res.status(404).json({ message: "Parent comment not found" });

    const reply = await Comment.create({
      content: content.trim(),
      postId: parentComment.postId,
      userId: req.user.id,
      parentId: parentComment._id,
    });

    await PostModel.findByIdAndUpdate(parentComment.postId, {
      $inc: { commentCount: 1 },
    });

    res.status(201).json(reply);
  } catch (error) {
    console.error("Error replying to comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get comments for a post, returned as a tree
export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId })
      .sort({ createdAt: 1 })
      .populate("userId", "name profilePic")
      .lean(false);

    const tree = buildCommentTree(comments);
    res.status(200).json(tree);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Edit a comment (owner only)
export const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    comment.content = content.trim();
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Helper to delete a comment subtree and count removed
const deleteCommentCascade = async (commentId) => {
  let removed = 0;
  const stack = [commentId];

  while (stack.length) {
    const id = stack.pop();
    const children = await Comment.find({ parentId: id }).select("_id");
    stack.push(...children.map((c) => c._id));
    await Comment.findByIdAndDelete(id);
    removed += 1;
  }

  return removed;
};

// Delete a comment (owner only) including its replies
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const removedCount = await deleteCommentCascade(commentId);
    await PostModel.findByIdAndUpdate(comment.postId, {
      $inc: { commentCount: -removedCount },
    });

    res.status(200).json({ message: "Comment deleted", removed: removedCount });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Upvote a comment
export const upvoteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const hasLiked = comment.likedBy?.some(
      (uid) => uid.toString() === userId.toString()
    );
    const hasDisliked = comment.dislikedBy?.some(
      (uid) => uid.toString() === userId.toString()
    );

    if (hasLiked) {
      // withdraw like
      comment.likedBy = comment.likedBy.filter(
        (uid) => uid.toString() !== userId.toString()
      );
    } else {
      // add like
      comment.likedBy.push(userId);
      if (hasDisliked) {
        comment.dislikedBy = comment.dislikedBy.filter(
          (uid) => uid.toString() !== userId.toString()
        );
      }
    }

    comment.likes = comment.likedBy.length;
    comment.dislikes = comment.dislikedBy.length;

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    console.error("Error upvoting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Downvote a comment
export const downvoteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const hasDisliked = comment.dislikedBy?.some(
      (uid) => uid.toString() === userId.toString()
    );
    const hasLiked = comment.likedBy?.some(
      (uid) => uid.toString() === userId.toString()
    );

    if (hasDisliked) {
      // withdraw dislike
      comment.dislikedBy = comment.dislikedBy.filter(
        (uid) => uid.toString() !== userId.toString()
      );
    } else {
      // add dislike
      comment.dislikedBy.push(userId);
      if (hasLiked) {
        comment.likedBy = comment.likedBy.filter(
          (uid) => uid.toString() !== userId.toString()
        );
      }
    }

    comment.likes = comment.likedBy.length;
    comment.dislikes = comment.dislikedBy.length;

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    console.error("Error downvoting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

