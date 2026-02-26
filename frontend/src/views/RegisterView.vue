<template>
  <div class="container" style="max-width: 450px; margin-top: 3rem;">
    <div class="card">
      <h2 style="text-align: center; color: var(--primary); border: none;">Create Account</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Username</label>
          <input v-model="username" type="text" required placeholder="Choose a username" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required placeholder="Create a password" />
        </div>
        <button type="submit" style="margin-top: 1rem;">Register</button>
      </form>
      <div style="text-align: center; margin-top: 1.5rem;">
        <router-link to="/login">Already have an account? Log in here</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

const handleRegister = async () => {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username.value, password: password.value })
  })
  
  if (res.ok) {
    alert("Account created! Please log in.")
    router.push('/login')
  } else {
    const data = await res.json()
    alert(data.error || "Registration failed")
  }
}
</script>