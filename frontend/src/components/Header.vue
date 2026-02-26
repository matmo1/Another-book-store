<template>
  <header class="app-header">
    <div class="header-container">
      <nav>
        <router-link to="/" class="logo">✨ Inventory Pro</router-link>
      </nav>
      <div class="user-controls">
        <div v-if="username" style="display: flex; align-items: center; gap: 1rem;">
          <span class="welcome-text">
            Welcome, <strong>{{ username }}</strong>
          </span>
          <button @click="handleLogout" class="login-btn" style="background: var(--danger);">Log Out</button>
        </div>
        <div v-else style="display: flex; gap: 0.5rem;">
          <router-link to="/login">
            <button class="login-btn secondary">Log In</button>
          </router-link>
        </div>
      </div>
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

// NEW LOGOUT FUNCTION
const handleLogout = async () => {
  await fetch('/api/logout', { method: 'POST' })
  window.location.href = '/login' // Force a refresh to clear auth state
}
</script>