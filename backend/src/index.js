import express, { json } from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import problemRoutes from "./routes/problem.routes.js"
import executionRoute from "./routes/executeCode.route.js"
import submissionRoutes from "./routes/submission.routes.js"
import  playlistRoutes from "./routes/playlist.routes.js"
import profileRoutes from "./routes/profile.routes.js"
import commentRoutes from "./routes/commentRoutes.js"
dotenv.config()

const app=express()

app.use(cors({
    origin:"http://localhost:5173",
    credentials :true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/problems",problemRoutes)
app.use("/api/v1/execute-code",executionRoute)
app.use("/api/v1/submission",submissionRoutes)
app.use("/api/v1/playlist",playlistRoutes)
app.use("/api/v1/profile",profileRoutes)
app.use("/api/v1/comments", commentRoutes)

app.listen(process.env.PORT, ()=>{
    console.log("server is running on 8080");
    
})