import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";
import commentRoutes from "./routes/comments.js";
import { registerHandlers } from "./socket/handlers.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.locals.io = io;

// ✅ Fix "Cannot GET /" 
app.get("/", (_, res) => {
  res.json({ message: "Sentiment Wall API is running", status: "ok" });
});

// ✅ Fix Chrome DevTools .well-known 404
app.get("/.well-known/appspecific/com.chrome.devtools.json", (_, res) => {
  res.json({});
});

app.use("/api", commentRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

io.on("connection", (socket) => {
  console.log(`✅ Client connected:    ${socket.id}`);
  registerHandlers(io, socket);
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});