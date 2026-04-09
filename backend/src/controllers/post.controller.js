import prisma from "../db.js";
import { generateTags } from "../services/ai.service.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, type, tags: manualTags } = req.body;

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
      orderBy: {
        createdAt: "desc",
      },
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