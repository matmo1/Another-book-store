<template>
  <div style="padding: 2rem;">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Username: </label>
        <input v-model="username" type="text" required />
      </div>
      <button type="submit" style="margin-top: 1rem;">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')

const handleLogin = async () => {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username.value })
  })
  
  if (res.ok) {
    // Reload the page to remount the header and apply the fetched auth state
    window.location.href = '/'
  } else {
    alert("Login failed")
  }
}
</script>