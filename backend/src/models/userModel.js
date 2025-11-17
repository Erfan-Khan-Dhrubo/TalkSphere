import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
  },

  profilePic: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  },

  coverPic: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  },

  role: {
    type: String,
    default: "user",
  },

  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

  totalPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "totalPost" }],

  totalUpVote: [{ type: mongoose.Schema.Types.ObjectId, ref: "totalUpVote" }],

  totalDownVote: [
    { type: mongoose.Schema.Types.ObjectId, ref: "totalDownVote" },
  ],

  isBanned: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
