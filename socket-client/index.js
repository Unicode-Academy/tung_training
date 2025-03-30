import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
const socketURL = `ws://localhost:8080/chat`;
const socket = io(socketURL, {
  extraHeaders: {
    "x-user": localStorage.getItem("user"),
  },
});
// const btn = document.querySelector(".btn");
// btn.addEventListener("click", () => {
//   socket.emit("send-message", "Hello message from client");
// });
// const btn2 = document.querySelector(".btn2");
// btn2.addEventListener("click", () => {
//   socket.emit("send-message2", "Hello message from client 2");
// });

// socket.on("new-message", (event) => {
//   console.log(event);
// });

// const form = document.querySelector("form");
// const joinBtn = document.querySelector(".join-btn");
// joinBtn.addEventListener("click", () => {
//   socket.emit("join-room", "room-1");
// });
// let isSendRoom = false;
// socket.on("joined-room", (event) => {
//   console.log(event);
//   isSendRoom = true;
// });

// form.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const userEl = form.querySelector(".user");
//   const messageEl = form.querySelector(".message");
//   const message = messageEl.value;

//   if (!isSendRoom) {
//     const userTo = userEl.value;

//     socket.emit("send-message", { userTo, message });
//     return;
//   }

//   //Gửi tin nhắn vào room 1
//   socket.emit("send-room", {
//     message,
//     room: "room-1",
//   });
// });

// socket.on("new-message", (event) => {
//   console.log(event);
// });

//Socket notification
const socketNotification = io.connect("ws://localhost:8080/notification", {
  extraHeaders: {
    Authorization: `Bearer ahihi`,
  },
});
socketNotification.on("new-message", (event) => {
  console.log(event);
});
socketNotification.emit("send-message", "OK chưa?");
