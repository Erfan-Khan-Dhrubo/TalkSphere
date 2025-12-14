import PostModel from "../models/postModel.js";
import mongoose from "mongoose";

// Create Post
export async function createPost(req, res) {
  try {
    const { userId, author, title, content, image, userImage } = req.body;

    const post = new PostModel({
      userId,
      author,
      title,
      content,
      image,
      userImage,
      upVotes: [],
      downVotes: [],
      commentCount: 0,
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error in createPost controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get All Posts
export async function getAllPosts(req, res) {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Get Post by ID
export async function getPostById(req, res) {
  try {
    const { id } = req.params;
    const post = await PostModel.findById(id)
      .populate("userId", "name profilePic")
      .lean();

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.commentCount = post.comments?.length || 0;
    post.author = post.userId?.name || "Unknown";
    post.userImage = post.userId?.profilePic || "";

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Update a Post
export async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const { title, content, image } = req.body;

    const post = await PostModel.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (image !== undefined) post.image = image;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Delete a Post
export async function deletePost(req, res) {
  try {
    const { id } = req.params;

    const post = await PostModel.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await PostModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Upvote a Post
export async function toggleUpvote(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await PostModel.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.upVotes.includes(userId)) {
      // remove upvote
      post.upVotes = post.upVotes.filter((uid) => uid.toString() !== userId);
    } else {
      // add upvote
      post.upVotes.push(userId);
      // remove from downVotes if exists
      post.downVotes = post.downVotes.filter(
        (uid) => uid.toString() !== userId
      );
    }

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error toggling upvote:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Downvote a Post
export async function toggleDownvote(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await PostModel.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.downVotes.includes(userId)) {
      // remove downvote
      post.downVotes = post.downVotes.filter(
        (uid) => uid.toString() !== userId
      );
    } else {
      // add downvote
      post.downVotes.push(userId);
      // remove from upVotes if exists
      post.upVotes = post.upVotes.filter((uid) => uid.toString() !== userId);
    }

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error toggling downvote:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Upvote a post
export async function upvotePost(req, res) {
  try {
    const { id } = req.params; // post ID
    const { userId } = req.body; // user ID

    const post = await PostModel.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const alreadyUpvoted = post.upVotes.some((uid) => uid.equals(userObjectId));
    const alreadyDownvoted = post.downVotes.some((uid) =>
      uid.equals(userObjectId)
    );

    if (alreadyUpvoted) {
      // Cancel upvote
      post.upVotes = post.upVotes.filter((uid) => !uid.equals(userObjectId));
    } else {
      // Add upvote and remove downvote if exists
      post.upVotes.push(userObjectId);
      if (alreadyDownvoted) {
        post.downVotes = post.downVotes.filter(
          (uid) => !uid.equals(userObjectId)
        );
      }
    }

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error upvoting post:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Downvote a post
export async function downvotePost(req, res) {
  try {
    const { id } = req.params; // post ID
    const { userId } = req.body; // user ID

    const post = await PostModel.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const alreadyDownvoted = post.downVotes.some((uid) =>
      uid.equals(userObjectId)
    );
    const alreadyUpvoted = post.upVotes.some((uid) => uid.equals(userObjectId));

    if (alreadyDownvoted) {
      // Cancel downvote
      post.downVotes = post.downVotes.filter(
        (uid) => !uid.equals(userObjectId)
      );
    } else {
      // Add downvote and remove upvote if exists
      post.downVotes.push(userObjectId);
      if (alreadyUpvoted) {
        post.upVotes = post.upVotes.filter((uid) => !uid.equals(userObjectId));
      }
    }

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error downvoting post:", err);
    res.status(500).json({ message: "Server error" });
  }
}
