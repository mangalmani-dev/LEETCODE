import express from "express"
import { check, login, logout, register } from "../controllers/auth.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { googleAuthCallback, googleAuthRedirect } from "../controllers/googleAuth.controller.js"

const authRoutes= express.Router()

authRoutes.post("/register",register)

authRoutes.post("/login",login)

authRoutes.post("/logout",authMiddleware,logout)

authRoutes.get("/check",authMiddleware,check)


// google oauth
authRoutes.get("/google", googleAuthRedirect);
authRoutes.get("/google/callback", googleAuthCallback);

export default authRoutes

