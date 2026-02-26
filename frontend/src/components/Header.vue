<template>
  <header style="display: flex; justify-content: space-between; padding: 1rem; background: #eee;">
    <nav>
      <router-link to="/">Home</router-link>
    </nav>
    <div>
      <span v-if="username">Welcome, {{ username }}!</span>
      <router-link v-else to="/login">
        <button>Login</button>
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const username = ref(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/is-logged')
    const data = await res.json()
    if (data.username) {
      username.value = data.username
    }
  } catch (error) {
    console.error("Failed to fetch login status", error)
  }
})
</script>