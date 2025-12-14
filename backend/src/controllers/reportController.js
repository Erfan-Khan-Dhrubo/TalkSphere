import mongoose from "mongoose";
import Report from "../models/reportModel.js";
import PostModel from "../models/postModel.js";
import Comment from "../models/commentModel.js";
import userModel from "../models/userModel.js";

// Create report for a post
export const createPostReport = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reason, description = "" } = req.body || {};

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: "Reason is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }

    const postExists = await PostModel.exists({ _id: postId });
    if (!postExists) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Report.create({
      postId,
      reason: reason.trim(),
      description: description?.trim() || "",
      status: "pending",
    });

    return res
      .status(201)
      .json({ message: "Report submitted successfully" });
  } catch (error) {
    console.error("Error creating report:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Create report for a comment
export const createCommentReport = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reason, description = "" } = req.body || {};

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: "Reason is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid commentId" });
    }

    const commentExists = await Comment.exists({ _id: commentId });
    if (!commentExists) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await Report.create({
      commentId,
      reason: reason.trim(),
      description: description?.trim() || "",
      status: "pending",
    });

    return res
      .status(201)
      .json({ message: "Report submitted successfully" });
  } catch (error) {
    console.error("Error creating comment report:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .lean();

    // Also populate user info for posts and comments
    const reportsWithDetails = await Promise.all(
      reports.map(async (report) => {
        const result = { ...report };
        
        if (report.postId) {
          const post = await PostModel.findById(report.postId)
            .populate("userId", "name profilePic")
            .lean();
          if (post) {
            result.postId = post;
          } else {
            result.postId = { _id: report.postId, deleted: true };
          }
        }
        
        if (report.commentId) {
          const comment = await Comment.findById(report.commentId)
            .populate("userId", "name profilePic")
            .lean();
          if (comment) {
            result.commentId = comment;
          } else {
            result.commentId = { _id: report.commentId, deleted: true };
          }
        }
        
        return result;
      })
    );

    return res.status(200).json(reportsWithDetails);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Resolve a report
export const resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ message: "Invalid reportId" });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = "resolved";
    await report.save();

    return res.status(200).json({ message: "Report resolved successfully" });
  } catch (error) {
    console.error("Error resolving report:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Ban a user
export const banUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = true;
    await user.save();

    return res.status(200).json({ message: "User banned successfully" });
  } catch (error) {
    console.error("Error banning user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a post (for moderation)
export const deletePostModeration = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await PostModel.findByIdAndDelete(postId);
    // Also delete all comments for this post
    await Comment.deleteMany({ postId });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a comment (for moderation)
export const deleteCommentModeration = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid commentId" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Helper to delete comment and all its replies
    const deleteCommentCascade = async (id) => {
      let removed = 0;
      const stack = [id];

      while (stack.length) {
        const currentId = stack.pop();
        const children = await Comment.find({ parentId: currentId }).select("_id");
        stack.push(...children.map((c) => c._id));
        await Comment.findByIdAndDelete(currentId);
        removed += 1;
      }

      return removed;
    };

    const removedCount = await deleteCommentCascade(commentId);
    
    // Update post comment count
    await PostModel.findByIdAndUpdate(comment.postId, {
      $inc: { commentCount: -removedCount },
    });

    return res.status(200).json({ 
      message: "Comment deleted successfully",
      removed: removedCount 
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

