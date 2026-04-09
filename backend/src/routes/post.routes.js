import express from "express";
import {
  createPost,
  getAllPosts,
  getMyPosts,
  upvotePost,
  deletePost,
  getAIPreviewTags,
  boostPost,
  getUnansweredDoubts,
} from "../controllers/post.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getAllPosts);
router.get("/me", authMiddleware, getMyPosts);
router.get("/unanswered", authMiddleware, getUnansweredDoubts);
router.post("/:id/upvote", authMiddleware, upvotePost);
router.post("/:id/boost", authMiddleware, boostPost);
router.delete("/:id", authMiddleware, deletePost);
router.post("/generate-tags", authMiddleware, getAIPreviewTags);

export default router;