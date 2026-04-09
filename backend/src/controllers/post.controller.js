import prisma from "../db.js";
import { generateTags } from "../services/ai.service.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, type, tags: manualTags, priority } = req.body;

    let tags = manualTags;

    // ✨ Fallback to Auto Tagging if no tags provided
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      const tagsStr = await generateTags(`${title} ${content}`);
      tags = tagsStr.split(",").map((t) => t.trim().toLowerCase());
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        type,
        userId: req.userId,
        tags,
        priority: priority || "NORMAL",
      },
    });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        _count: {
          select: { comments: true, upvotes: true },
        },
      },
      orderBy: [
        { isBoosted: "desc" },
        { createdAt: "desc" },
      ],
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: req.userId,
      },
      include: {
        user: true,
        _count: {
          select: { comments: true, upvotes: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const upvotePost = async (req, res) => {
  try {
    const { id } = req.params; // postId
    const existing = await prisma.upvote.findUnique({
      where: {
        userId_postId: {
          userId: req.userId,
          postId: id,
        },
      },
    });

    if (existing) {
      await prisma.upvote.delete({
        where: { id: existing.id },
      });
      res.json({ message: "Upvote removed", upvoted: false });
    } else {
      await prisma.upvote.create({
        data: {
          userId: req.userId,
          postId: id,
        },
      });

      const post = await prisma.post.findUnique({ where: { id }});
      if (post && post.userId !== req.userId) {
        await prisma.notification.create({
          data: {
            userId: post.userId,
            actorId: req.userId,
            type: "UPVOTE",
            postId: id,
            message: "upvoted your post",
          }
        });
      }

      res.json({ message: "Upvote added", upvoted: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== req.userId) {
      return res.status(403).json({ message: "Forbidden: Not your post" });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAIPreviewTags = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title && !content) {
      return res.status(400).json({ message: "Title or content required" });
    }

    const tagsStr = await generateTags(`${title} ${content}`);
    const tags = tagsStr.split(",").map((t) => t.trim().toLowerCase());
    res.json({ tags });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const boostPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.userId !== req.userId) return res.status(403).json({ message: "Forbidden: Not your post" });
    if (post.isBoosted) return res.status(400).json({ message: "Already boosted" });

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (user.coins < 100) return res.status(400).json({ message: "Not enough coins. Needs 100." });

    await prisma.$transaction([
      prisma.user.update({ where: { id: req.userId }, data: { coins: { decrement: 100 } } }),
      prisma.post.update({ where: { id }, data: { isBoosted: true } })
    ]);

    res.json({ message: "Post boosted successfully!", isBoosted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUnansweredDoubts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        type: 'DOUBT',
        isSolved: false
      },
      include: {
        user: true,
        _count: {
          select: { comments: true, upvotes: true },
        },
      },
      orderBy: [
        { isBoosted: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};