import express from "express"

import { authMiddleware } from "../middleware/auth.middleware.js";
import { getProfile } from "../controllers/profile.controller.js";

const profileRoutes=express.Router()

profileRoutes.get("/me",authMiddleware,getProfile)


export default profileRoutes



