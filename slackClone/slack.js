const express = require('express');
const app = express();
const socketio = require('socket.io')
const namespaces = require("./data/namespaces");
const Room = require('./classes/Room');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer)

app.get("/change-ns", (req, res) => {
  console.log("running");
  namespaces[0].addRoom(new Room(0, "Deleted Articles", 0));
  io.of(namespaces[0].endpoint).emit("nsChange", namespaces[0]);
  res.json(namespaces[0]);
})

io.on('connection', (socket) => {
  socket.emit("welcome", "Welcome to the server!")
  socket.on("clientConnect", (data) => {
    console.log(socket.id, "has connected")
    socket.emit("nsList", namespaces)
  })
})

namespaces.forEach((namespace => {
  io.of(namespace.endpoint).on("connection", (socket) => {
    socket.on("joinRoom", async (roomTitle, ackCallback) => {

      const rooms = socket.rooms;
      let i = 0;
      rooms.forEach(room => {
        if (i !== 0) {
          socket.leave(room);
        }
        i += 1;
      })

      socket.join(roomTitle);
      const sockets = await io.of(namespace.endpoint).in(roomTitle).fetchSockets();
      const socketCount = sockets.length;
      ackCallback({
        numUsers: socketCount
      });
    })

    socket.on("newMessageToRoom", messageObj => {
      console.log(messageObj);
      const currentRoom = [...socket.rooms][1];
      io.of(namespace.endpoint).in(currentRoom).emit("messageToRoom", messageObj);

      const thisNs = namespaces[messageObj.selectedNsId];
      const thisRoom = thisNs.rooms.find(room => room.roomTitle === currentRoom);
      thisRoom.addMessage(messageObj);
    })

  })
}))