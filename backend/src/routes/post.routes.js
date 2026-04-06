import express from "express";
import {
  createPost,
  getAllPosts,
  getMyPosts,
} from "../controllers/post.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", getAllPosts);
router.get("/me", authMiddleware, getMyPosts);

export default router;