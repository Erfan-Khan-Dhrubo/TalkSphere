import express from "express";
import {
  createUser,
  getUserByEmail,
  toggleSavePost,
  updateUserImage,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/email/:email", getUserByEmail);
router.patch("/updateImage/:email", updateUserImage);
router.post("/save-post", toggleSavePost);

export default router;
