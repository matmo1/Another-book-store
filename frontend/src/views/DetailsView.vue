<template>
  <div class="container">
    <div class="card" v-if="item" style="max-width: 500px; margin: 2rem auto;">
      <h1>{{ item.name }}</h1>
      <p class="price" style="font-size: 1.5rem;">${{ item.price }}</p>
      <p><strong>Description:</strong> {{ item.description || 'No description provided.' }}</p>
      
      <router-link to="/">
        <button class="secondary" style="margin-top: 1rem;">Back to Home</button>
      </router-link>
    </div>
    <div v-else class="container">Loading item details...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const item = ref(null)

onMounted(async () => {
  const res = await fetch(`/api/items/${route.params.id}`)
  item.value = await res.json()
})
</script>