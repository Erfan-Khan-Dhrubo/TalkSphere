import express from "express";
import {
  createAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

const router = express.Router();

// Create announcement (no auth middleware)
router.post("/", createAnnouncement);

// Get all announcements (no auth middleware)
router.get("/", getAllAnnouncements);

// Delete announcement (no auth middleware)
router.delete("/:id", deleteAnnouncement);

export default router;

