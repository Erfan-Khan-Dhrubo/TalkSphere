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
