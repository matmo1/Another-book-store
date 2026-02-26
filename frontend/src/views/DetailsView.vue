<template>
  <div style="padding: 2rem;" v-if="item">
    <h1>{{ item.name }}</h1>
    <p><strong>Price:</strong> ${{ item.price }}</p>
    <p><strong>Description:</strong> {{ item.description }}</p>
    <router-link to="/">Back to Home</router-link>
  </div>
  <div v-else>Loading...</div>
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