import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createMessage,
  getDiscussion,
  getMessages,
} from "../controller/message.controller.js";

const router = express.Router();

router.get("/messages/discussion", verifyToken, getDiscussion);
router.get("/messages/:receiverId", verifyToken, getMessages);
router.post("/messages", verifyToken, createMessage);

export default router;
