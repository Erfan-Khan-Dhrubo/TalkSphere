import userModel from "../models/userModel.js";

// Creating User
export async function createUser(req, res) {
  try {
    const {
      name,
      email,
      profilePic,
      role,
      savedPosts,
      totalPosts,
      totalUpVote,
      totalDownVote,
      isBanned,
      createdAt,
    } = req.body;

    // Create a new note
    const note = new userModel({
      name,
      email,
      profilePic,
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
