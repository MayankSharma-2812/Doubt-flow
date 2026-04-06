import prisma from "../db.js";
import { addCoins, updateStreak } from "./game.controller.js";

export const addComment = async (req, res) => {
  try {
    const { content, postId } = req.body;

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: req.userId,
      },
    });

    await addCoins(req.userId, 10);
    await updateStreak(req.userId);

    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAsSolved = async (req, res) => {
  try {
    const { postId, userId } = req.body;

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        isSolved: true,
        solvedBy: userId,
      },
    });

    await addCoins(userId, 20);

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
