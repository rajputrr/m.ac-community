const express = require("express");
const { Server } = require("socket.io");
var http = require("http");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "https://macommunity.netlify.app", // Replace with your Netlify app URL
    methods: ["GET", "POST"],
  })
);

var server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://macommunity.netlify.app", // Replace with your Netlify app URL
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Socket server started");
  res.end();
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("newMessage", ({ newMessage, room }) => {
    io.in(room).emit("getLatestMessage", newMessage);
  });
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`App started at port ${port}`);
});
