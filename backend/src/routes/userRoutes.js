import express from "express";
import { createUser, getUserByEmail } from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/email/:email", getUserByEmail);

export default router;
