<template>
  <div class="container" style="max-width: 450px; margin-top: 3rem;">
    <div class="card">
      <h2 style="text-align: center; color: var(--primary); border: none;">Welcome Back</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Username</label>
          <input v-model="username" type="text" required placeholder="Enter your username" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required placeholder="Enter your password" />
        </div>
        <button type="submit" style="margin-top: 1rem;">Log In</button>
      </form>
      <div style="text-align: center; margin-top: 1.5rem;">
        <router-link to="/register">Don't have an account? Register here</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')

const handleLogin = async () => {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username.value, password: password.value })
  })
  
  if (res.ok) {
    window.location.href = '/'
  } else {
    alert("Invalid username or password")
  }
}
</script>