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

    const solvedCount = await prisma.post.count({
      where: { solvedBy: req.userId },
    });

    res.json({ ...user, solvedCount });
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

export const getBonus = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { lastBonusClaimed: true }
    });

    if (user.lastBonusClaimed) {
      const now = new Date();
      const lastClaim = new Date(user.lastBonusClaimed);
      const diffMs = now - lastClaim;
      const diffHrs = diffMs / (1000 * 60 * 60);

      if (diffHrs < 24) {
        const remainingHrs = Math.ceil(24 - diffHrs);
        return res.status(400).json({ 
          message: `Daily bonus already claimed. Try again in ${remainingHrs} hours.` 
        });
      }
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: req.userId },
        data: {
          coins: { increment: 50 },
          lastBonusClaimed: new Date()
        }
      })
    ]);

    res.json({ message: "Bonus of 50 coins awarded!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
