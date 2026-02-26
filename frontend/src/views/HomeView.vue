<template>
  <div style="padding: 2rem;">
    <h1>All Items</h1>
    <ul>
      <li v-for="item in items" :key="item.id" style="margin-bottom: 1rem;">
        <h3>{{ item.name }}</h3>
        <router-link :to="`/details/${item.id}`">View Details</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const items = ref([])

onMounted(async () => {
  const res = await fetch('/api/items')
  items.value = await res.json()
})
</script>