import express from "express";
import {
  addComment,
  getCommentsByPost,
  markAsSolved,
} from "../controllers/comment.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, addComment);
router.get("/:postId", getCommentsByPost);
router.patch("/solve", authMiddleware, markAsSolved);

export default router;
