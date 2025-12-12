import userModel from "../models/userModel.js";

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
