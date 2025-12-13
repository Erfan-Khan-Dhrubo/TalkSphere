import mongoose from "mongoose";
import Report from "../models/reportModel.js";
import PostModel from "../models/postModel.js";

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

