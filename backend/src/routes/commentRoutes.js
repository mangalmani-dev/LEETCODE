import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addComment, deleteComment, getComments } from "../controllers/commentController.js";

const commentRoute=express.Router()

commentRoute.get("/:problemId", getComments);

commentRoute.post("/:problemId", authMiddleware, addComment);

commentRoute.delete("/:commentId", authMiddleware, deleteComment);



export default commentRoute