import express from "express";
import {
  getProfile,
  leaderboard,
  getHint,
  getQuiz,
  getBonus,
} from "../controllers/game.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.get("/leaderboard", leaderboard);
router.post("/hint", getHint);
router.post("/quiz", getQuiz);
router.post("/bonus", authMiddleware, getBonus);

export default router;
