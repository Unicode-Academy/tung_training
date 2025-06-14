<template>
  <header class="flex justify-between items-center py-5 w-[1200px] mx-auto">
    <div>
      <RouterLink to="/">
        <img src="../assets/logo.png" alt="logo" class="w-[124px]" />
      </RouterLink>
    </div>
    <div>
      <span v-if="!isLoaded">Loading...</span>
      <template v-else>
        <button
          href="#"
          class="text-white bg-amber-700 inline-block py-1 px-4 rounded-full"
          @click="clerk.openSignIn"
          v-if="!isSignedIn"
        >
          Đăng nhập
        </button>
        <ul class="flex gap-5" v-else>
          <li>Chào bạn: {{ user?.firstName }}</li>
          <li>
            <span class="cursor-pointer text-[red]" @click="clerk.signOut"
              >Đăng xuất</span
            >
          </li>
        </ul>
      </template>
    </div>
  </header>
</template>
<script setup>
import { useClerk } from "@clerk/vue";
import { useUser } from "@clerk/vue";
const clerk = useClerk();
const { user, isLoaded, isSignedIn } = useUser();
</script>
