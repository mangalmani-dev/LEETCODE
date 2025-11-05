import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

// Middleware to authenticate users
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized - Invalid or expired token",
      });
    }

    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in authenticating user:", error);
    res.status(500).json({ message: "Error in authentication middleware" });
  }
};

// Middleware to check if user is admin
export const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - No user found in request" });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access denied - Admins only",
      });
    }

    next();
  } catch (error) {
    console.error("Error in admin role middleware:", error);
    res.status(500).json({ message: "Error checking admin role" });
  }
};
