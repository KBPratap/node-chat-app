const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");

const port = process.env.PORT || 3300;
const publicPath = path.join(__dirname, "../public");

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and room name are required.");
    }
    socket.join(params.room);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    // socket.leave(room-name)

    // io.emit --> io.to(room-name).emit
    // socket.broadcast.emit --> socket.broadcast.to(room-name).emit
    // socket.emit
    socket.emit(
      "newMessage",
      generateMessage("admin", "welcome to the chat app")
    );

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));

    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage("admin", `${params.name} has joined`)
      );

    callback();
  });

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
    let user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io
        .to(user.room)
        .emit("newMessage", generateMessage("admin", `${user.name} has left.`));
    }
    console.log("client was disconnected");
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
