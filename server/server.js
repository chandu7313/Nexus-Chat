import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import User from "./models/User.js";
import { Server } from "socket.io";

const app = express()
const server = http.createServer(app)

export const userSocketMap = {}

export const io = new Server(server, { cors: { origin: "*" } })

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    console.log("user connected: ", userId)
    if (userId) userSocketMap[userId] = socket.id

    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("typing", ({ receiverId }) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing", userId);
        }
    });

    socket.on("stopTyping", ({ receiverId }) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("stopTyping", userId);
        }
    });

    socket.on("disconnect", async () => {
        console.log("User disconnected: ", userId)
        if (userId) {
            await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
            delete userSocketMap[userId]
            io.emit("getOnlineUsers", Object.keys(userSocketMap))
        }
    })

})

app.use(express.json({ limit: '4mb' }))
app.use(cors())

// Routes setup
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter)


// Connect to MongoDB
await connectDB();

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5001;
    server.listen(PORT, () => console.log("Server is running on PORT: " + PORT));
}

// Export server for Vervel
export default server;


