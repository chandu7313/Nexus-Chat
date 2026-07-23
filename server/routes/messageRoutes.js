import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getAllUsers, getMessages, sendMessage, deleteMessage } from "../controllers/messageController.js";

const router = express.Router();

router.use(protectRoute);

router.get("/users", getAllUsers);
router.get("/:chatId", getMessages);
router.post("/send/:chatId", sendMessage);
router.delete("/:id", deleteMessage);

export default router;