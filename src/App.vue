<template>
  <div class="app">
    <nav class="navbar">
      <h1>{{ $t('app.title') }}</h1>
      <div class="nav-buttons">
        <button @click="currentView = 'home'" :class="{ active: currentView === 'home' }">
          {{ $t('app.home') }}
        </button>
        <button @click="currentView = 'settings'" :class="{ active: currentView === 'settings' }">
          {{ $t('app.settings') }}
        </button>
      </div>
    </nav>

    <div class="content">
      <div v-if="currentView === 'home'" class="home-view">
        <h2>{{ $t('home.welcome') }}</h2>
        <p>{{ $t('home.description') }}</p>
        <button @click="greet">{{ $t('home.greet') }}</button>
        <p v-if="greetMsg">{{ greetMsg }}</p>
      </div>

      <Settings v-if="currentView === 'settings'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Settings from './components/Settings.vue'

const currentView = ref('home')
const greetMsg = ref('')

async function greet() {
  greetMsg.value = 'Hello from Tauri!'
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.navbar {
  background: rgba(100, 108, 255, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(100, 108, 255, 0.3);
}

.navbar h1 {
  font-size: 1.5rem;
  margin: 0;
}

.nav-buttons {
  display: flex;
  gap: 0.5rem;
}

.nav-buttons button {
  background-color: transparent;
  color: white;
  padding: 0.5rem 1rem;
  border: 1px solid #646cff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.nav-buttons button:hover {
  background-color: rgba(100, 108, 255, 0.2);
}

.nav-buttons button.active {
  background-color: #646cff;
  border-color: #646cff;
}

.content {
  flex: 1;
  overflow-y: auto;
}

.home-view {
  text-align: center;
  padding: 2rem;
}

.home-view h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.home-view button {
  background-color: #646cff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.home-view button:hover {
  background-color: #535bf2;
}
</style>