<template>
  <section class="h-screen bg-[black] p-5">
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
  </section>
</template>

<script setup>
import { useUser } from "@clerk/vue";
import moment from "moment";
import { onMounted, ref, useTemplateRef, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getShortName } from "../utils/utils";
import { state, socket } from "../configs/socket";
const { user, isLoaded, isSignedIn } = useUser();
const localVideoRef = ref();
const route = useRoute();
const router = useRouter();
const video = ref(true);
const audio = ref(true);

let localStream;

const startMedia = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });

  localVideoRef.value.srcObject = localStream;
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
watch(user, () => {
  if (route.query.type === "create") {
    socket.emit("create-meet", {
      roomId: route.params.id,
      userId: user.value.id,
    });
  }

  socket.on("create-meet", (data) => {
    console.log(data);
    router.push({
      name: "meet",
      params: { id: route.params.id },
    });
  });
});
</script>
