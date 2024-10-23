import express from "express";
import {
  deleteUser,
  getUserPosts,
  login,
  signup,
  subscribeUser,
  updateUser,
} from "../controller/user.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users/:userId/posts", verifyToken, getUserPosts);
router.post("/users/signup", signup);
router.post("/users/login", login);
router.delete("/users", verifyToken, deleteUser);
router.put("/users", verifyToken, updateUser);
router.post("/users/:userId/subscribe", verifyToken, subscribeUser);

export default router;
