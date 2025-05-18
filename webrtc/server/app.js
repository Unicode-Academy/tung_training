const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socketIo = require("socket.io");
//Thiết lập socket
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
}); //Port 3000

//Tạo object lưu trữ rooms
const rooms = {};
io.on("connection", (socket) => {
  console.log("Người dùng kết nối");
  socket.on("create-room", (room) => {
    //Khởi tạo room
    //Kiểm tra xem phòng đó đã được tạo chưa?
    if (rooms[room]) {
      //Phản hồi về client
      socket.emit("full", room);
      return;
    }
    socket.join(room); //Người tạo room được join
    rooms[room] = [socket.id];
    socket.emit("created", room); //Gửi thông điệp về client
    console.log("Tạo room thành công");
  });

  socket.on("join-room", (room) => {
    //Kiểm tra xem room có tồn tại không?
    if (!rooms[room]) {
      socket.emit("not-found", room);
      return;
    }
    //Kiểm tra xem room có full không?
    if (rooms[room].length >= 2) {
      socket.emit("full", room);
      return;
    }
    //Xử lý join
    socket.join(room);
    rooms[room].push(socket.id);
    socket.emit("joined", room);
  });

  //Xử lý khi người dùng sẵn sàng
  socket.on("ready", (room) => {
    io.to(room).emit("ready");
  });
});

server.listen(3000);
