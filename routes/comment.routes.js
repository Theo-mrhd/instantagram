import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../controller/comment.controller.js";

const router = express.Router();

router.post("/comments/:postId", verifyToken, createComment);
router.put("/comments/:commentId", verifyToken, updateComment);
router.delete("/comments/:commentId", verifyToken, deleteComment);

export default router;
