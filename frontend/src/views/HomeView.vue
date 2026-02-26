<template>
  <div class="container">
    <h1>📚 Book Store Manager</h1>

    <div class="grid-container">
      <div class="card">
        <h2>Add New Book</h2>
        <form @submit.prevent="addBook">
          <div class="form-group">
            <label>Book Title</label>
            <input type="text" v-model="newBook.title" required placeholder="e.g. The Great Gatsby">
          </div>
          <div class="form-group">
            <label>Author</label>
            <input type="text" v-model="newBook.author" required placeholder="e.g. F. Scott Fitzgerald">
          </div>
          <div class="form-group">
            <label>Price ($)</label>
            <input type="number" step="0.01" v-model="newBook.price" required placeholder="0.00">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newBook.description" rows="2" placeholder="Short description..."></textarea>
          </div>
          <button type="submit">Add Book</button>
        </form>
      </div>

      <div class="card">
        <h2>Find by ID</h2>
        <div class="form-group">
          <label>Enter Book ID</label>
          <input type="number" v-model="searchId" placeholder="e.g. 1">
        </div>
        <button @click="findBook" class="secondary">Search</button>

        <div id="searchResult" v-if="hasSearched">
          <div v-if="isSearching">Searching...</div>
          <div v-else-if="searchError"><span class="not-found">❌ Book not found</span></div>
          <div v-else-if="searchResult">
            <div class="found-item">✅ Found: {{ searchResult.title }}</div>
            <p><strong>Author:</strong> {{ searchResult.author }}</p>
            <p><strong>Price:</strong> ${{ searchResult.price }}</p>
            <router-link :to="`/details/${searchResult.id}`">Go to Details Page</router-link>
          </div>
        </div>
      </div>
    </div>

    <h2>Current Inventory</h2>
    <div class="item-list">
      <p v-if="books.length === 0">No books found. Add some above!</p>
      <div class="item" v-for="book in books" :key="book.id">
        <h3>{{ book.title }} <small>(ID: {{ book.id }})</small></h3>
        <p style="margin: 0; color: var(--text-muted); font-weight: 600;">By {{ book.author }}</p>
        <div class="price">${{ book.price }}</div>
        <div class="desc">{{ book.description || 'No description' }}</div>
        
        <button class="delete-btn" @click="deleteBook(book.id)">Delete</button>
        
        <router-link :to="`/details/${book.id}`" style="display:block; margin-top:10px; font-size:0.9em;">
          View Full Details
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const books = ref([])
const newBook = ref({ title: '', author: '', price: '', description: '' })

// Search states
const searchId = ref('')
const searchResult = ref(null)
const searchError = ref(false)
const isSearching = ref(false)
const hasSearched = ref(false)

const loadBooks = async () => {
  const res = await fetch('/api/books')
  if (res.ok) {
    books.value = await res.json()
  }
}

const addBook = async () => {
  const res = await fetch('/api/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBook.value)
  })
  if (res.ok) {
    newBook.value = { title: '', author: '', price: '', description: '' }
    loadBooks()
  } else {
    alert('Error adding book')
  }
}

const deleteBook = async (id) => {
  if(!confirm('Delete this book?')) return;
  const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
  if (res.ok) loadBooks();
}

const findBook = async () => {
  if (!searchId.value) {
    alert("Please enter an ID");
    return;
  }
  
  hasSearched.value = true
  isSearching.value = true
  searchResult.value = null
  searchError.value = false

  try {
    const res = await fetch(`/api/books/${searchId.value}`)
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

onMounted(loadBooks)
</script>