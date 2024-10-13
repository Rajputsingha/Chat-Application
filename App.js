const express = require("express");
const path = require("path");
const app = express();
const port = 8080;
app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(port, () => {
  console.log("listening to the port: 8080");
});
const io = require("socket.io")(server);
let socketConnected = new Set();
io.on("connection", onConnecter);

function onConnecter(socket) {
  console.log(socket.id);
  socketConnected.add(socket.id);
  io.emit("clients-total", socketConnected.size);
  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
    socketConnected.delete(socket.id);
    io.emit("clients-total", socketConnected.size);
  });
  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
}
