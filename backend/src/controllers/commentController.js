import { db } from "../libs/db.js"; // prisma client

// Get comments for a problem
export const getComments = async (req, res) => {
  try {
    const comments = await db.comment.findMany({
      where: { problemId: req.params.problemId },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a comment
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    const comment = await db.comment.create({
      data: {
        problemId: req.params.problemId,
        userId: req.user.id,
        content,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await db.comment.findUnique({
      where: { id: req.params.commentId },
    });
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.userId !== req.user.id)
      return res.status(403).json({ error: "You can only delete your own comments" });

    await db.comment.delete({ where: { id: req.params.commentId } });
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
