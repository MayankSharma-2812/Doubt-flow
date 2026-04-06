import prisma from "../db.js";

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
