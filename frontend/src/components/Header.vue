<template>
  <header class="app-header">
    <div class="header-container">
      <nav>
        <router-link to="/" class="logo">✨ Inventory Pro</router-link>
      </nav>
      <div class="user-controls">
        <span v-if="username" class="welcome-text">
          Welcome back, <strong>{{ username }}</strong>
        </span>
        <router-link v-else to="/login">
          <button class="login-btn">Log In</button>
        </router-link>
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
</script>

<style scoped>
.app-header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px); /* Gives a cool glass effect */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #e2e8f0;
}
.header-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  font-size: 1.4rem;
  font-weight: 900;
  color: #6366f1;
  text-decoration: none;
  letter-spacing: -0.5px;
}
.logo:hover { 
  text-decoration: none; 
  color: #4f46e5; 
}
.welcome-text { 
  color: #64748b; 
  background: #f1f5f9;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}
.login-btn { 
  width: auto; 
  padding: 0.5rem 1.5rem; 
  margin: 0; 
  border-radius: 20px; /* Pill shape for login button */
}
</style>