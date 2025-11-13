import express, { Router } from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllListDetails, getPlaylistDetails, removeProbelmFromPlaylist } from "../controllers/playlist.controller.js"

const playlistRoutes=express.Router()

playlistRoutes.get("/",authMiddleware,getAllListDetails)

playlistRoutes.get("/:playlistId",authMiddleware,getPlaylistDetails)

playlistRoutes.post("/create-playlsit",authMiddleware,createPlaylist)

playlistRoutes.post("/:playlistId/add-problem",authMiddleware,addProblemToPlaylist)

playlistRoutes.post("/:playlistId",authMiddleware,deletePlaylist)

playlistRoutes.post("/:playlistId/remove-problem",authMiddleware,removeProbelmFromPlaylist)

export default playlistRoutes