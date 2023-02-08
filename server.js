const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const PORT = process.env.PORT || config.get("serverPort");
const config = require("./config");

app.use("/src", express.static(path.resolve(__dirname, "src")));
app.use("/public", express.static(path.resolve(__dirname, "public")));
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

let rooms = [];

io.on("connection", (socket) => {
  let playerIndex = -1;
  let currentRoom = null;
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    currentRoom = roomId;

    if (!rooms[roomId]) {
      rooms[roomId] = {
        connections: [null, null],
        players: [],
      };
    }

    for (const i in rooms[roomId].connections) {
      if (rooms[roomId].connections[i] === null) {
        playerIndex = i;
        break;
      }
    }
    rooms[roomId].connections[playerIndex] = false;
    socket.on("username", function (username) {
      console.log("Username: " + username);
      rooms[currentRoom].players.push({
        id: socket.id,
        username: username,
      });
      io.in(currentRoom).emit("players", rooms[currentRoom].players);
    });

    socket.emit("player-number", playerIndex);

    console.log(`Player ${playerIndex} joined room ${currentRoom}`);

    if (playerIndex === -1) return;

    socket.broadcast.in(currentRoom).emit("player-connection", playerIndex);
    socket.on("chat-message", function (data) {
      io.emit("chat-message", data);
    });
    socket.on("disconnect", () => {
      console.log(
        `Player ${playerIndex} disconnected from room ${currentRoom}`
      );
      rooms[currentRoom].connections[playerIndex] = null;
      socket.broadcast.in(currentRoom).emit("player-connection", playerIndex);
      for (var i = 0; i < rooms[currentRoom].players.length; i++) {
        if (rooms[currentRoom].players[i].id == socket.id) {
          rooms[currentRoom].players.splice(i, 1);
        }
      }
      socket.broadcast.emit("player-disconnected", roomId);
      io.in(currentRoom).emit("players", rooms[currentRoom].players);
    });

    socket.on("player-ready", () => {
      socket.broadcast.in(currentRoom).emit("enemy-ready", playerIndex);
      rooms[currentRoom].connections[playerIndex] = true;
    });

    socket.on("check-players", () => {
      const players = [];
      for (const i in rooms[currentRoom].connections) {
        rooms[currentRoom].connections[i] === null
          ? players.push({ connected: false, ready: false })
          : players.push({
              connected: true,
              ready: rooms[currentRoom].connections[i],
            });
      }
      socket.emit("check-players", players);
    });

    socket.on("fire", (id) => {
      console.log(`Shot fired from ${playerIndex}`, id);
      socket.broadcast.emit("fire", id);
    });

    socket.on("fire-reply", (square) => {
      console.log(square);
      socket.broadcast.emit("fire-reply", square);
    });
  });
});

http.listen(PORT, function () {
  console.log(`listening on *:${PORT}`);
});
