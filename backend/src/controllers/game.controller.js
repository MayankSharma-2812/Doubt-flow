import prisma from "../db.js";
import { generateHint, generateQuiz } from "../services/ai.service.js";

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        coins: true,
        streak: true,
      },
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addCoins = async (userId, amount) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      coins: {
        increment: amount,
      },
    },
  });
};

export const updateStreak = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      streak: {
        increment: 1,
      },
    },
  });
};

export const leaderboard = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        coins: "desc",
      },
      select: {
        id: true,
        name: true,
        coins: true,
        streak: true,
      },
      take: 10,
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getHint = async (req, res) => {
  try {
    const { question } = req.body;
    const hint = await generateHint(question);
    res.json({ hint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getQuiz = async (req, res) => {
  try {
    const { topic } = req.body;
    const quiz = await generateQuiz(topic);
    res.json({ quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
