import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: null,
    },

    userImage: {
      type: String,
      default: null,
    },

    // Voting System
    upVotes: {
      type: Number,
      default: 0,
    },

    downVotes: {
      type: Number,
      default: 0,
    },

    // To display number of comments quickly
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
