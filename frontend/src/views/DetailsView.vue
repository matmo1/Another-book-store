<template>
  <div class="container">
    <div class="card" v-if="book" style="max-width: 500px; margin: 2rem auto;">
      <h1 style="margin-bottom: 0.5rem; text-align: left;">{{ book.title }}</h1>
      <h3 style="margin-top: 0; color: var(--text-muted); font-weight: normal;">By {{ book.author }}</h3>
      
      <p class="price" style="font-size: 1.5rem; margin-top: 1.5rem;">${{ book.price }}</p>
      <p><strong>Description:</strong> {{ book.description || 'No description provided.' }}</p>
      
      <router-link to="/">
        <button class="secondary" style="margin-top: 1.5rem;">Back to Store</button>
      </router-link>
    </div>
    <div v-else class="container">Loading book details...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const book = ref(null)

onMounted(async () => {
  const res = await fetch(`/api/books/${route.params.id}`)
  if (res.ok) {
    book.value = await res.json()
  } else {
    alert("Book not found")
  }
})
</script>