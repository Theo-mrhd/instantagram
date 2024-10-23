import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  allPost,
  createPost,
  deletePost,
  getCommentsByPost,
  getMyPosts,
  getSubscribedPosts,
  updatePost,
} from "../controller/post.controller.js";

const router = express.Router();

router.get("/posts", verifyToken, allPost);
router.get("/posts/subscribed", verifyToken, getSubscribedPosts);
router.get("/posts/:postId/comments", verifyToken, getCommentsByPost);
router.get("/my-posts", verifyToken, getMyPosts);
router.post("/posts", verifyToken, createPost);
router.put("/posts/:postId", verifyToken, updatePost);
router.delete("/posts/:postId", verifyToken, deletePost);

export default router;
