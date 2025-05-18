<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <input type="text" placeholder="Name..." v-model="loginForm.form.name" />
      <span v-if="loginForm.errors.name">{{ loginForm.errors.name }}</span>
    </div>
    <div>
      <input
        type="email"
        placeholder="Email..."
        v-model="loginForm.form.email"
      />
      <span v-if="loginForm.errors.email">{{ loginForm.errors.email }}</span>
    </div>
    <button>Submit</button>
  </form>
  <h2>Todo List</h2>
  <ul>
    <li v-for="todo in todoList" :key="todo.id">{{ todo.title }}</li>
  </ul>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from "vue";
const todoList = ref([]);
const loginForm = reactive({
  form: {
    name: "",
    email: "",
  },
  errors: {
    name: "",
    email: "",
  },
});
const handleSubmit = () => {
  console.log(`ok`);
  const { name, email } = loginForm.form;
  if (!name) {
    loginForm.errors.name = "Name is required";
  }
  if (!email) {
    loginForm.errors.email = "Email is required";
  }
};

const getTodoList = async () => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos`);
  const data = await response.json();
  todoList.value = data;
};

onMounted(getTodoList);

// watch([todoList], () => {
//   console.log(todoList.value);
// });
</script>
