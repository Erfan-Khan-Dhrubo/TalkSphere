import Announcement from "../models/announcementModel.js";
import userModel from "../models/userModel.js";

// Create an announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { userId, title, content, author, userImage } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // Check if user is admin
    if (userId) {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Only admins can create announcements" });
      }
    } else {
      return res.status(400).json({ message: "User ID is required" });
    }

    const announcement = new Announcement({
      userId,
      title: title.trim(),
      content: content.trim(),
      author: author || "Admin",
      userImage: userImage || null,
    });

    const savedAnnouncement = await announcement.save();
    res.status(201).json(savedAnnouncement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all announcements
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .lean();

    // Populate user info
    const announcementsWithUser = await Promise.all(
      announcements.map(async (announcement) => {
        try {
          const user = await userModel.findById(announcement.userId).select("name profilePic").lean();
          return {
            ...announcement,
            author: user?.name || announcement.author,
            userImage: user?.profilePic || announcement.userImage || null,
          };
        } catch (err) {
          // If user not found, return announcement as is
          return {
            ...announcement,
            author: announcement.author || "Unknown",
            userImage: announcement.userImage || null,
          };
        }
      })
    );

    res.status(200).json(announcementsWithUser);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete an announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // Get userId from request body

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Check if user is admin
    if (userId) {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Only admins can delete announcements" });
      }
    } else {
      return res.status(400).json({ message: "User ID is required" });
    }

    await Announcement.findByIdAndDelete(id);
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

