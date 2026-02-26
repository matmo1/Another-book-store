<template>
  <div class="container">
    <h1>📦 Shop Inventory Manager</h1>

    <div class="grid-container">
      <div class="card">
        <h2>Add New Product</h2>
        <form @submit.prevent="addItem">
          <div class="form-group">
            <label>Product Name</label>
            <input type="text" v-model="newItem.name" required placeholder="e.g. Gaming Mouse">
          </div>
          <div class="form-group">
            <label>Price ($)</label>
            <input type="number" step="0.01" v-model="newItem.price" required placeholder="0.00">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newItem.description" rows="2" placeholder="Short description..."></textarea>
          </div>
          <button type="submit">Add Product</button>
        </form>
      </div>

      <div class="card">
        <h2>Find by ID</h2>
        <div class="form-group">
          <label>Enter Product ID</label>
          <input type="number" v-model="searchId" placeholder="e.g. 1">
        </div>
        <button @click="findItem" class="secondary">Search</button>

        <div id="searchResult" v-if="hasSearched">
          <div v-if="isSearching">Searching...</div>
          <div v-else-if="searchError"><span class="not-found">❌ Product not found</span></div>
          <div v-else-if="searchResult">
            <div class="found-item">✅ Found: {{ searchResult.name }}</div>
            <p><strong>Price:</strong> ${{ searchResult.price }}</p>
            <p><strong>Desc:</strong> {{ searchResult.description }}</p>
            <router-link :to="`/details/${searchResult.id}`">Go to Details Page</router-link>
          </div>
        </div>
      </div>
    </div>

    <h2>Current Inventory</h2>
    <div class="item-list">
      <p v-if="items.length === 0">Loading items...</p>
      <div class="item" v-for="item in items" :key="item.id">
        <h3>{{ item.name }} <small>(ID: {{ item.id }})</small></h3>
        <div class="price">${{ item.price }}</div>
        <div class="desc">{{ item.description || 'No description' }}</div>
        
        <button class="delete-btn" @click="deleteItem(item.id)">Delete</button>
        
        <router-link :to="`/details/${item.id}`" style="display:block; margin-top:10px; font-size:0.9em;">
          View Full Details
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const items = ref([])
const newItem = ref({ name: '', price: '', description: '' })

// Search states
const searchId = ref('')
const searchResult = ref(null)
const searchError = ref(false)
const isSearching = ref(false)
const hasSearched = ref(false)

const loadItems = async () => {
  const res = await fetch('/api/items')
  items.value = await res.json()
}

const addItem = async () => {
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem.value)
  })
  if (res.ok) {
    newItem.value = { name: '', price: '', description: '' }
    loadItems()
  } else {
    alert('Error adding item')
  }
}

const deleteItem = async (id) => {
  if(!confirm('Delete this item?')) return;
  const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
  if (res.ok) loadItems();
}

const findItem = async () => {
  if (!searchId.value) {
    alert("Please enter an ID");
    return;
  }
  
  hasSearched.value = true
  isSearching.value = true
  searchResult.value = null
  searchError.value = false

  try {
    const res = await fetch(`/api/items/${searchId.value}`)
    if (res.status === 404) {
      searchError.value = true
    } else {
      searchResult.value = await res.json()
    }
  } catch (err) {
    searchError.value = true
  } finally {
    isSearching.value = false
  }
}

onMounted(loadItems)
</script>