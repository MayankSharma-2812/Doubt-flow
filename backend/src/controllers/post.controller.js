import prisma from "../db.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, type } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        type,
        userId: req.userId,
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