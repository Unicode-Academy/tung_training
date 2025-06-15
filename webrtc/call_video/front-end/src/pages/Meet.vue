<template>
  <h1 v-if="!isLoaded">Loading...</h1>
  <section
    v-else
    :class="{
      'h-screen': true,
      'bg-[black]': !showPopupName,
      'p-5': true,
    }"
  >
    <div v-if="showPopupName">
      <form @submit.prevent="handleSaveName">
        <input
          type="text"
          v-model="displayName"
          placeholder="Nhập tên của bạn"
          class="outline-none py-2 px-5 rounded-xl border border-gray-400 me-3"
        />
        <button
          class="font-medium cursor-pointer text-gray-400 border border-gray-400 py-2 px-5"
        >
          Xác nhận
        </button>
      </form>
    </div>
    <template v-else>
      <div class="h-[90%] relative">
        <video
          class="w-full h-full bg-[#580202] rounded-[20px]"
          ref="localVideoRef"
          autoplay
          muted
        ></video>
        <div
          class="absolute top-0 left-0 w-full h-full bg-[#580202] flex justify-center items-center"
          v-if="!video"
        >
          <span class="text-white text-5xl font-bold">{{
            getShortName(user?.firstName)
          }}</span>
        </div>
        <span v-if="isLoaded" class="absolute bottom-3 left-3 text-white">{{
          user?.firstName
        }}</span>

        <div
          v-if="clients.length"
          class="absolute bottom-0 right-0 bg-amber-800 w-[300px] h-[200px]"
        >
          <video
            ref="remoteVideoRef"
            autoplay
            muted
            width="100%"
            height="100%"
          ></video>
        </div>
      </div>
      <div class="h-[10%] flex justify-between items-center text-white">
        <div class="w-[25%]">
          <span class="mr-3">{{ moment().format("HH:mm") }}</span>
          |
          <span class="ml-3">{{ $route.params.id }}</span>
        </div>
        <div class="flex gap-5 text-2xl">
          <span class="cursor-pointer" @click="toggleMicro">
            <i v-if="audio" class="fa fa-microphone" aria-hidden="true"></i>
            <i v-else class="fa fa-microphone-slash" aria-hidden="true"></i>
          </span>
          <span class="cursor-pointer" @click="toggleCamera">
            <i v-if="video" class="fa fa-camera" aria-hidden="true"></i>
            <i v-else class="fa fa-video-camera" aria-hidden="true"></i>
          </span>
          <span class="cursor-pointer">
            <i class="fa fa-desktop" aria-hidden="true"></i>
          </span>
          <span class="cursor-pointer">
            <i class="fa fa-stop" aria-hidden="true"></i>
          </span>
        </div>
        <div class="text-2xl cursor-pointer w-[25%] text-end">
          <i class="fa fa-user" aria-hidden="true"></i>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { useUser } from "@clerk/vue";
import moment from "moment";
import { onMounted, ref, useTemplateRef, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getShortName } from "../utils/utils";
import { state, socket } from "../configs/socket";
import { rtcConfig } from "../configs/rtc";
const { user, isLoaded, isSignedIn } = useUser();
const localVideoRef = ref();
const remoteVideoRef = ref();
const route = useRoute();
const router = useRouter();
const video = ref(true);
const audio = ref(true);
const showPopupName = ref(false);
const displayName = ref("");
const guest = ref({});
const clients = ref([]);

let localStream;
let peerConnection;

const handleSaveName = async () => {
  guest.value.firstName = displayName.value;
  guest.value.id = "guest_" + Date.now();
  showPopupName.value = false;
  await startMedia();
};

const startMedia = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  if (localVideoRef.value) {
    localVideoRef.value.srcObject = localStream;
  }
};
const toggleCamera = () => {
  localStream.getVideoTracks().forEach((track) => {
    track.enabled = !track.enabled;
    video.value = track.enabled;
  });
};
const toggleMicro = () => {
  localStream.getAudioTracks().forEach((track) => {
    track.enabled = !track.enabled;
    audio.value = track.enabled;
  });
};
onMounted(async () => {
  await startMedia();
});
watch([user, guest.value], () => {
  if (route.query.type === "create") {
    socket.emit("create-meet", {
      roomId: route.params.id,
      user: {
        id: user.value.id,
        name: user.value.firstName,
      },
    });
  } else {
    if (!user.value && !guest.value.id) {
      showPopupName.value = true;
    }
    const client = {};
    if (guest.value.id) {
      client.id = guest.value.id;
      client.name = guest.value.firstName;
    } else if (user.value) {
      client.id = user.value?.id;
      client.name = user.value?.firstName;
    }
    if (Object.keys(client).length) {
      socket.emit("join-meet", {
        roomId: route.params.id,
        user: client,
      });
    }
  }

  socket.on("created-meet", (data) => {
    // console.log(data);
    router.push({
      name: "meet",
      params: { id: route.params.id },
    });
  });

  socket.on("joined-meet", async (data) => {
    if (data[data.length - 1]) {
      alert(`${data[data.length - 1].name} joined the meet`);
      clients.value.push(data[data.length - 1]);
      const clientSocketId = data[data.length - 1].socketId;

      peerConnection = new RTCPeerConnection(rtcConfig);

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

        //Gửi socket sang B
        socket.emit("candidate", {
          socketId: clientSocketId,
          message,
        });
      });

      //Đọc các track từ localStream và add vào peer --> Để B nhận được
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      //Lắng nghe track từ đối phương (B) gửi
      peerConnection.addEventListener("track", (event) => {
        //Gán track vào thẻ video để hiển thị
        remoteVideoRef.value.srcObject = event.streams[0];
      });

      //Tạo offer
      const offer = await peerConnection.createOffer();

      //Thêm mô tả vào peer
      await peerConnection.setLocalDescription(offer);

      //Gửi offer qua socket
      socket.emit("offer", {
        socketId: clientSocketId,
        offer,
      });
    }
  });

  socket.on("leave-meet", (data) => {
    if (data.name) {
      alert(`${data.name} left the meet`);
      clients.value = clients.value.filter((item) => item.id !== data.id);
    }
  });

  socket.on("offer", async (data) => {
    if (peerConnection) {
      return;
    }
    peerConnection = new RTCPeerConnection(rtcConfig);

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    //Lắng nghe track từ đối phương (B) gửi
    peerConnection.addEventListener("track", (event) => {
      // console.log(event.streams);
      //Gán track vào thẻ video để hiển thị
      remoteVideoRef.srcObject = event.streams[0];
    });

    await peerConnection.setRemoteDescription(data.offer); //set remote offer cho peer connection

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
      //Gửi socket sang A
      socket.emit("candidate", {
        message,
      });
    });

    //Tạo answer
    const answer = await peerConnection.createAnswer();

    //Gửi socket answer cho A
    socket.emit("answer", {
      answer,
    });

    await peerConnection.setLocalDescription(answer);
  });

  socket.on("answer", async ({ answer }) => {
    if (!peerConnection) {
      return;
    }
    await peerConnection.setRemoteDescription(answer);
  });

  socket.on("candidate", async (candidate) => {
    if (!peerConnection) {
      return;
    }
    if (!candidate.candidate) {
      await peerConnection.addIceCandidate(null);
    } else {
      await peerConnection.addIceCandidate(candidate);
    }
  });
});
</script>
