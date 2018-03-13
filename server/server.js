const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

const { generateMessage, generateLocationMessage } = require("./utils/message");

const port = process.env.PORT || 3300;
const publicPath = path.join(__dirname, "../public");

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");

  socket.emit(
    "newMessage",
    generateMessage("admin", "welcome to the chat app")
  );

  socket.broadcast.emit(
    "newMessage",
    generateMessage("admin", "new user joined")
  );

  socket.on("createMessage", (message, callback) => {
    console.log("createMessage ", message);
    socket.broadcast.emit(
      "newMessage",
      generateMessage(message.from, message.text)
    );
    callback("This is from server");
  });

  socket.on("createLocationMessage", coords => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("admin", coords.latitude, coords.longitude)
    );
  });

  socket.on("disconnect", () => {
    console.log("client was disconnected");
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
