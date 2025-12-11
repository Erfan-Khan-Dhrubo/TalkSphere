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

// // ===============================
// // Get Post by ID
// // ===============================
// export async function getPostById(req, res) {
//   try {
//     const { id } = req.params;

//     const post = await PostModel.findById(id);

//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     res.status(200).json(post);
//   } catch (error) {
//     console.error("Error fetching post:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// }

// // ===============================
// // Update Post
// // ===============================
// export async function updatePost(req, res) {
//   try {
//     const { id } = req.params;
//     const { title, content, image } = req.body;

//     const updatedPost = await PostModel.findByIdAndUpdate(
//       id,
//       { title, content, image },
//       { new: true }
//     );

//     if (!updatedPost) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     res.status(200).json(updatedPost);
//   } catch (error) {
//     console.error("Error updating post:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// }

// // ===============================
// // Delete Post
// // ===============================
// export async function deletePost(req, res) {
//   try {
//     const { id } = req.params;

//     const deletedPost = await PostModel.findByIdAndDelete(id);

//     if (!deletedPost) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     res.status(200).json({ message: "Post deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting post:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// }

// // ===============================
// // Get All Posts From a User
// // ===============================
// export async function getPostsByUser(req, res) {
//   try {
//     const { userId } = req.params;

//     const posts = await PostModel.find({ userId });

//     res.status(200).json(posts);
//   } catch (error) {
//     console.error("Error fetching user's posts:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// }
