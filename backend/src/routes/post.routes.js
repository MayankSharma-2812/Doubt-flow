import express from "express";
import {
  createPost,
  getAllPosts,
  getMyPosts,
  upvotePost,
} from "../controllers/post.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getAllPosts);
router.get("/me", authMiddleware, getMyPosts);
router.post("/:id/upvote", authMiddleware, upvotePost);

export default router;