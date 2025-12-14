import express from "express";
import {
  createUser,
  getUserByEmail,
  getUserById,
  toggleSavePost,
  updateUserImage,
  getAllUsers,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/email/:email", getUserByEmail);
router.get("/:id", getUserById);
router.patch("/updateImage/:email", updateUserImage);
router.post("/save-post", toggleSavePost);

export default router;
