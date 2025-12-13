import { db } from "../libs/db.js"; // your Prisma client

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // JWT middleware should set req.user

    // 1️⃣ Fetch user basic info
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Stats
    const totalProblemsCreated = await db.problem.count({ where: { userId } });
    const totalSolved = await db.problemSolved.count({ where: { userId } });
    const totalSubmissions = await db.submission.count({ where: { userId } });
    const totalPlaylists = await db.playlist.count({ where: { userId } });

    // 3️⃣ Difficulty-wise solved problems
    const solvedProblems = await db.problem.findMany({
      where: {
        solvedBy: { some: { userId } },
      },
      select: { difficulty: true },
    });

    const difficultyCount = {
      EASY: solvedProblems.filter((p) => p.difficulty === "EASY").length,
      MEDIUM: solvedProblems.filter((p) => p.difficulty === "MEDIUM").length,
      HARD: solvedProblems.filter((p) => p.difficulty === "HARD").length,
    };

    // 4️⃣ Recent submissions
    const recentSubmissions = await db.submission.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        language: true,
        time: true,
        memory: true,
        createdAt: true,
        problemId: true,
        problem: { select: { title: true, difficulty: true } },
      },
    });

    // 5️⃣ Playlists
    const playlists = await db.playlist.findMany({
      where: { userId },
      include: {
        problems: {
          select: {
            problem: {
              select: {
                id: true,
                title: true,
                difficulty: true,
              },
            },
          },
        },
      },
    });

    // 6️⃣ Calculate Success Rate
    const successRate =
      totalSubmissions > 0 ? Math.round((totalSolved / totalSubmissions) * 100) + "%" : "0%";

    // 7️⃣ Calculate Strike (consecutive days with submissions)
    const allSubmissions = await db.submission.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    let strike = 0;
    if (allSubmissions.length > 0) {
      const today = new Date();
      let count = 0;

      for (let i = 0; i < allSubmissions.length; i++) {
        const submissionDate = new Date(allSubmissions[i].createdAt);
        const diffDays = Math.floor(
          (today - submissionDate) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === count) {
          count++;
        } else {
          break;
        }
      }

      strike = count;
    }
    const strikeText = `${strike} day${strike > 1 ? "s" : ""}`;

    // 8️⃣ Calculate Rank (by totalSolved)
    const allUsers = await db.user.findMany({
      include: {
        problemSolved: true,
      },
    });

    const sortedUsers = allUsers
      .map((u) => ({
        id: u.id,
        totalSolved: u.problemSolved.length,
      }))
      .sort((a, b) => b.totalSolved - a.totalSolved);

    const rankIndex = sortedUsers.findIndex((u) => u.id === userId);
    const rank = rankIndex >= 0 ? `#${rankIndex + 1}` : "-";

    // ✅ Send response
    return res.json({
      user,
      stats: {
        totalProblemsCreated,
        totalSolved,
        totalSubmissions,
        totalPlaylists,
        strike: strikeText,
        successRate,
        rank,
      },
      difficultyCount,
      recentSubmissions,
      playlists,
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
