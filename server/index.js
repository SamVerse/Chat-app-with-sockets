import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

// create a instance of express
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// use cors
app.use(cors());

// create a counter
let userIdCounter = 1;

// create a connection event
io.on("connection", (socket) => {
  const userId = `User ${userIdCounter++}`;
  socket.emit("assignUserId", userId);
  console.log(`${userId} connected`);

  socket.on("message", (message) => {
    console.log("message received:", message);
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log(`${userId} disconnected`);
  });
});

// listen to the port

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
