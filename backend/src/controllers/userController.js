import userModel from "../models/userModel.js";
import PostModel from "../models/postModel.js";

// Creating User
export async function createUser(req, res) {
  try {
    const {
      name,
      email,
      profilePic,
      coverPic,
      role,
      savedPosts,
      totalPosts,
      totalUpVote,
      totalDownVote,
      isBanned,
      createdAt,
    } = req.body;

    const note = new userModel({
      name,
      email,
      profilePic,
      coverPic,
      role,
      savedPosts,
      totalPosts,
      totalUpVote,
      totalDownVote,
      isBanned,
      createdAt,
    });
    const saveNote = await note.save();

    res.status(201).json(saveNote);
  } catch (error) {
    console.error("error in createNotes controller", error);
    res.status(500).json({ message: "internal server error" });
  }
}

// Find user by email
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Find user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Image URL
export const updateUserImage = async (req, res) => {
  try {
    const email = req.params.email;
    const { imageUrl, type } = req.body; // type: "profile" or "cover"

    if (!email || !imageUrl || !type) {
      return res
        .status(400)
        .json({ error: "Email, imageUrl, and type are required" });
    }

    const updateField =
      type === "profile"
        ? { profilePic: imageUrl }
        : type === "cover"
        ? { coverPic: imageUrl }
        : null;

    if (!updateField) {
      return res
        .status(400)
        .json({ error: "Type must be either 'profile' or 'cover'" });
    }

    // Find user and update, return full updated user
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      updateField,
      {
        new: true, // return the updated document
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: `${type} image updated successfully`,
      user: updatedUser, // send the full updated user object
    });
  } catch (err) {
    console.error("Update image error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// toggle fav
export const toggleSavePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isSaved = user.savedPosts.includes(postId);

    if (isSaved) {
      user.savedPosts = user.savedPosts.filter(
        (id) => id.toString() !== postId
      );
    } else {
      user.savedPosts.push(postId);
    }

    await user.save();

    res.status(200).json({
      message: isSaved
        ? "Post removed from saved posts"
        : "Post added to saved posts",
      savedPosts: user.savedPosts,
    });
  } catch (error) {
    console.error("Error in toggleSavePost:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users with activity summary (calculated dynamically)
export const getAllUsers = async (req, res) => {
  try {
    // Get all users
    const users = await userModel
      .find()
      .select("name email role isBanned profilePic createdAt");

    // Get all posts to calculate post counts and votes
    const allPosts = await PostModel.find().select("userId upVotes downVotes");

    // Calculate activity for each user
    const usersWithActivity = await Promise.all(
      users.map(async (user) => {
        const userId = user._id;

        // Count posts by this user
        const totalPosts = allPosts.filter(
          (post) => post.userId.toString() === userId.toString()
        ).length;

        // Calculate total upvotes received (from posts owned by this user)
        const userPosts = allPosts.filter(
          (post) => post.userId.toString() === userId.toString()
        );
        const totalUpvotes = userPosts.reduce(
          (sum, post) => sum + (post.upVotes?.length || 0),
          0
        );

        // Calculate total downvotes received (from posts owned by this user)
        const totalDownvotes = userPosts.reduce(
          (sum, post) => sum + (post.downVotes?.length || 0),
          0
        );

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePic: user.profilePic,
          isBanned: user.isBanned,
          createdAt: user.createdAt,
          totalPosts,
          totalUpvotes,
          totalDownvotes,
        };
      })
    );

    res.status(200).json(usersWithActivity);
  } catch (error) {
    console.error("Error fetching users with activity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
