<template>
  <section class="h-screen bg-[black] p-5">
    <div class="h-[90%] relative">
      <video class="w-full h-full bg-[#580202] rounded-[20px]"></video>
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
        <span class="cursor-pointer">
          <i class="fa fa-microphone" aria-hidden="true"></i>
        </span>
        <span class="cursor-pointer">
          <i class="fa fa-camera" aria-hidden="true"></i>
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
import { useRouter } from "vue-router";
const { user, isLoaded, isSignedIn } = useUser();
</script>
