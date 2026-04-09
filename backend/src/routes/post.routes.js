import express from "express";
import {
  createPost,
  getAllPosts,
  getMyPosts,
  upvotePost,
  deletePost,
} from "../controllers/post.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getAllPosts);
router.get("/me", authMiddleware, getMyPosts);
router.post("/:id/upvote", authMiddleware, upvotePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;