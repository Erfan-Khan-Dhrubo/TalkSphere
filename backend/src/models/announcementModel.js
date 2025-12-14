import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    userImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", AnnouncementSchema);

