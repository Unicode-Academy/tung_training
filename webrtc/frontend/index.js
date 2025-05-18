//Kết nối socket
import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
const socket = io("http://localhost:3000");

//Khi người dùng bấm nút Start
const startBtn = document.querySelector("#start-btn");
const myVideo = document.querySelector("#my-video");
const roomInput = document.querySelector("#room-input");
const createBtn = document.querySelector("#create-btn");
const msgEl = document.querySelector(".msg");
const peerVideoEl = document.querySelector("#peer-video");
const joinBtn = document.querySelector("#join-btn");
let peerConnection = null;
startBtn.addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  myVideo.srcObject = stream;
  createBtn.disabled = false;
  startBtn.disabled = true;
});
createBtn.addEventListener("click", () => {
  const room = roomInput.value;
  socket.emit("create-room", room);
  //Thông báo
  msgEl.innerText = `Đang tạo room...`;
});
joinBtn.addEventListener("click", () => {
  const room = roomInput.value;
  socket.emit("join-room", room);
});

//Lắng nghe phản hồi của socket
socket.on("created", (room) => {
  createBtn.disabled = true;
  msgEl.innerText = `Đã tạo room ${room}`;
});
socket.on("full", (room) => {
  msgEl.innerHTML = `Room ${room} đã tồn tại`;
});
socket.on("joined", (room) => {
  msgEl.innerText = `Đã tham gia room ${room}`;
  joinBtn.disabled = true;
  socket.emit("ready", room);
});

const configuration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(configuration);

  peerConnection.ontrack = (event) => {
    console.log(event);
  };

  //Lắng nghe trạng thái kết nối
  peerConnection.onciceonnectionstatechange = () => {
    console.log(peerConnection.iceConnectionState);
  };

  peerConnection.onicecandidate = (event) => {
    console.log(event);
  };
};

socket.on("ready", () => {
  //Khởi tạo kết nối Peer
  if (!peerConnection) {
    createPeerConnection();
  }
});
