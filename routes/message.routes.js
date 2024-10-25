import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createMessage,
  deleteMessage,
  getDiscussion,
  getMessages,
} from "../controller/message.controller.js";

const router = express.Router();

router.get("/messages/discussion", verifyToken, getDiscussion);
router.get("/messages/:receiverId", verifyToken, getMessages);
router.post("/messages", verifyToken, createMessage);
router.delete("/message/:messageId", verifyToken, deleteMessage);

export default router;
