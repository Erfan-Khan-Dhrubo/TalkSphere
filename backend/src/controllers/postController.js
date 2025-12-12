import PostModel from "../models/postModel.js";

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
      upVotes: 0,
      downVotes: 0,
      commentCount: 0,
      userImage,
    });

    const savePost = await post.save();

    res.status(201).json(savePost);
  } catch (error) {
    console.error("Error in createPost controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//Get All Posts
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
      .populate("userId", "name profilePic") // author info
      .lean();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Add dynamic fields (optional)
    post.commentCount = post.comments?.length || 0;
    post.author = post.userId?.name || "Unknown";
    post.userImage = post.userId?.profilePic || "";

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Update a post
export async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const { title, content, image } = req.body;

    // Find the post
    const post = await PostModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update fields if provided
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

// Delete a post
export async function deletePost(req, res) {
  try {
    const { id } = req.params;

    const post = await PostModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete post
    await PostModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error" });
  }
}
