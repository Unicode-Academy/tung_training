<template>
  <div class="flex justify-between items-center h-[500px] w-[1200px] mx-auto">
    <div class="w-1/2">
      <h1 class="text-4xl mb-5 font-medium">
        Tính năng họp và gọi video dành cho tất cả mọi người
      </h1>
      <p class="text-2xl">Kết nối, cộng tác và ăn mừng ở mọi nơi với</p>
      <div class="mt-5 flex gap-5">
        <button
          class="inline-block bg-blue-600 text-white py-2 px-5 rounded-full cursor-pointer"
          @click="handleCreateMeet"
        >
          Cuộc gọi mới
        </button>
        <input
          type="text"
          class="outline-none py-2 px-5 rounded-xl border border-gray-400"
          placeholder="Nhập mã hoặc đường liên kết"
        />
        <button class="font-medium cursor-pointer text-gray-400">
          Tham gia
        </button>
      </div>
    </div>
    <div class="w-1/2 flex justify-end items-center">
      <img
        src="https://www.gstatic.com/meet/user_edu_get_a_link_light_90698cd7b4ca04d3005c962a3756c42d.svg"
        alt=""
      />
    </div>
  </div>
</template>
<script setup>
import { useClerk, useUser } from "@clerk/vue";

const clerk = useClerk();
const { isSignedIn, isLoaded } = useUser();
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "vue-router";
const router = useRouter();
const handleCreateMeet = () => {
  if (isLoaded.value) {
    if (isSignedIn.value) {
      const uuid = uuidv4();
      // router.push({
      //   name: "meet",
      //   params: { id: uuid },
      //   query: { type: "create" },
      // });
      window.location.href = `/${uuid}?type=create`;
    } else {
      clerk.value.openSignIn();
    }
  }
};
</script>
