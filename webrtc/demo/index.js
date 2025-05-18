const startBtn = document.querySelector(".start-btn");
const myVideoEl = document.querySelector("#my-video");
const screenBtn = document.querySelector(".screen-btn");
const screenVideoEl = document.querySelector("#screen-video");
const callBtn = document.querySelector(".call-btn");
const remoteVideoEl = document.querySelector("#remote-video");
//A: Mình, B: Đối phương
//Bước 1: Lấy media của thằng A
//- Video
//- Audio
//- Screen
let localStream = null;
let localSreen = null;
startBtn.addEventListener("click", async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  myVideoEl.srcObject = localStream;
});
screenBtn.addEventListener("click", async () => {
  localSreen = await navigator.mediaDevices.getDisplayMedia({
    video: {
      cursor: "always",
    },
    audio: false,
  });
  screenVideoEl.srcObject = localScreen;
});

//Bước 2: Khởi tạo kết nối Peer
/*
A sẽ khởi tạo 1 kết nối Peer mới
A sẽ add các track từ local media (video, audio, screen) vào peer

B sẽ nhận được các track
B sẽ add các track của B vào peer

A sẽ nhận được các track của B thông qua sự kiện ontrack
*/

const rtcConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};
let peerConnection;
const signaling = new BroadcastChannel("webrtc"); //Giả lập server trung gian
callBtn.addEventListener("click", async () => {
  peerConnection = new RTCPeerConnection(rtcConfig);
  if (!localStream) {
    // return alert("Start trước đi");
  }

  //ICE
  peerConnection.addEventListener("icecandidate", (event) => {
    const message = {
      type: "candidate",
      candidate: null,
    };
    if (event.candidate) {
      message.candidate = event.candidate.candidate;
      message.sdpMid = event.candidate.sdpMid;
      message.sdpMLineIndex = event.candidate.sdpMLineIndex;
    }
    signaling.postMessage(message); //Gửi ICE sang B
  });

  //Đọc các track từ localStream và add vào peer --> Để B nhận được
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  //Lắng nghe track từ đối phương (B) gửi
  peerConnection.addEventListener("track", (event) => {
    console.log(event.streams);

    //Gán track vào thẻ video để hiển thị
    remoteVideoEl.srcObject = event.streams[0];
  });

  //Tạo offer
  const offer = await peerConnection.createOffer();

  //Thêm mô tả vào peer
  await peerConnection.setLocalDescription(offer);

  //Gửi qua signaling server
  signaling.postMessage({ type: "offer", sdp: offer.sdp });
});

//Khi B nhận được offer từ A
// - Tạo kết nối peer mới
// - add track của B vào peer
// - Lắng nghe track từ A
// - Tạo answer --> Gửi sang A

const handleOffer = async (offer) => {
  if (peerConnection) {
    return;
  }
  peerConnection = new RTCPeerConnection(rtcConfig);

  if (!localStream) {
    // return alert("Start trước đi");
  }
  //Đọc các track từ localStream và add vào peer --> Để B nhận được
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  //Lắng nghe track từ đối phương (B) gửi
  peerConnection.addEventListener("track", (event) => {
    // console.log(event.streams);
    //Gán track vào thẻ video để hiển thị
    remoteVideoEl.srcObject = event.streams[0];
  });

  await peerConnection.setRemoteDescription(offer); //set remote offer cho peer connection

  //ICE
  peerConnection.addEventListener("icecandidate", (event) => {
    const message = {
      type: "candidate",
      candidate: null,
    };
    if (event.candidate) {
      message.candidate = event.candidate.candidate;
      message.sdpMid = event.candidate.sdpMid;
      message.sdpMLineIndex = event.candidate.sdpMLineIndex;
    }
    signaling.postMessage(message); //Gửi ICE sang A
  });

  //Tạo answer
  const answer = await peerConnection.createAnswer();

  //Gửi answer cho A
  signaling.postMessage({ type: "answer", sdp: answer.sdp });

  await peerConnection.setLocalDescription(answer);

  //   console.log(offer);
};

const handleAnswer = async (answer) => {
  if (!peerConnection) {
    return;
  }
  await peerConnection.setRemoteDescription(answer);
  //   console.log(answer);
};

const handleCandidate = async (candidate) => {
  if (!peerConnection) {
    return;
  }
  if (!candidate.candidate) {
    await peerConnection.addIceCandidate(null);
  } else {
    await peerConnection.addIceCandidate(candidate);
  }
};

signaling.addEventListener("message", async (event) => {
  if (event.data.type === "offer") {
    handleOffer(event.data);
  }

  if (event.data.type === "answer") {
    handleAnswer(event.data);
  }

  if (event.data.type === "candidate") {
    handleCandidate(event.data);
  }
});
