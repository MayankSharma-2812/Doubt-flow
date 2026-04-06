import express from "express";
import {
  getProfile,
  leaderboard,
} from "../controllers/game.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.get("/leaderboard", leaderboard);

export default router;
