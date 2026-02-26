<template>
  <Header />
  <router-view></router-view>
</template>

<script setup>
import Header from './components/Header.vue'
</script>

<style>
/* --- MODERN APP THEME --- */
:root {
  --bg-color: #f8fafc;
  --text-main: #1e293b;
  --text-muted: #64748b;
  --primary: #6366f1; /* Indigo */
  --primary-hover: #4f46e5;
  --secondary: #0ea5e9; /* Sky Blue */
  --secondary-hover: #0284c7;
  --danger: #ef4444; /* Red */
  --danger-hover: #dc2626;
  --card-bg: #ffffff;
  --border: #e2e8f0;
}

body {
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-main);
  margin: 0;
  padding: 0 0 3rem 0;
  line-height: 1.6;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* Typography */
h1, h2, h3 { color: var(--text-main); font-weight: 800; }
h1 { font-size: 2.5rem; margin-bottom: 2rem; text-align: center; color: var(--primary); letter-spacing: -0.5px; }
h2 { font-size: 1.4rem; margin-bottom: 1.2rem; border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; }

/* Layout */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

/* Modern Cards */
.card {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}

/* Forms & Inputs */
.form-group { margin-bottom: 1.2rem; }
label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-muted); font-size: 0.9rem; }
input, textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  box-sizing: border-box;
  font-family: inherit;
  transition: all 0.2s;
  background-color: var(--bg-color);
}
input:focus, textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  background-color: #fff;
}

/* Buttons */
button {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
}
button:hover { background: var(--primary-hover); transform: translateY(-2px); box-shadow: 0 4px 6px rgba(99, 102, 241, 0.4); }
button:active { transform: translateY(0); }

button.secondary { background: var(--secondary); box-shadow: 0 2px 4px rgba(14, 165, 233, 0.3); }
button.secondary:hover { background: var(--secondary-hover); box-shadow: 0 4px 6px rgba(14, 165, 233, 0.4); }

/* Search Results */
#searchResult { margin-top: 1.5rem; padding: 1.2rem; border-radius: 8px; background: #f0fdf4; border: 1px solid #bbf7d0; }
.found-item { color: #166534; font-weight: 800; font-size: 1.1rem; margin-bottom: 0.5rem; }
.not-found { color: var(--danger); font-weight: 700; display: block; padding: 1rem; background: #fef2f2; border-radius: 8px; border: 1px solid #fecaca; }

/* Product List Grid */
.item-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}
.item {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  border-top: 5px solid var(--primary);
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  position: relative;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}
.item:hover { transform: translateY(-5px); box-shadow: 0 12px 20px -5px rgba(0,0,0,0.1); }
.item h3 { margin: 0 0 0.5rem 0; font-size: 1.25rem; color: var(--text-main); padding-right: 3rem; }
.item small { color: var(--text-muted); font-size: 0.8rem; font-weight: 500;}
.price { font-weight: 800; color: var(--primary); font-size: 1.5rem; margin-top: 0.5rem; }
.desc { color: var(--text-muted); font-size: 0.95rem; margin: 0.75rem 0 1.5rem 0; flex-grow: 1; }

.delete-btn {
  background: var(--danger);
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  width: auto;
  box-shadow: none;
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  border-radius: 6px;
}
.delete-btn:hover { background: var(--danger-hover); box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3); }

/* Global Links */
a { color: var(--primary); text-decoration: none; font-weight: 600; transition: color 0.2s; }
a:hover { color: var(--primary-hover); text-decoration: underline; }
</style>