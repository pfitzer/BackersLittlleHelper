<template>
  <div class="min-h-screen">

    <!-- Navigation -->
    <div class="navbar bg-base-300/50 backdrop-blur-md border-b border-primary/30">
      <div class="flex-1">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {{ $t('app.title') }}
        </h1>
      </div>
      <div class="flex-none gap-2">
        <button
          @click="currentView = 'home'"
          :class="['btn btn-sm', currentView === 'home' ? 'btn-primary' : 'btn-ghost']"
        >
          {{ $t('app.home') }}
        </button>
        <button
          @click="currentView = 'settings'"
          :class="['btn btn-sm', currentView === 'settings' ? 'btn-primary' : 'btn-ghost']"
        >
          {{ $t('app.settings') }}
        </button>
        <button
            @click="currentView = 'tools'"
            :class="['btn btn-sm', currentView === 'tools' ? 'btn-primary' : 'btn-ghost']"
        >
          {{ $t('app.tools') }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-8">
      <div v-if="currentView === 'home'" class="hero min-h-[80vh]">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <h2 class="text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              {{ $t('home.welcome') }}
            </h2>
            <p class="text-lg mb-6 text-base-content/80">{{ $t('home.description') }}</p>
            <button @click="greet" class="btn btn-primary btn-lg gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {{ $t('home.greet') }}
            </button>
            <div v-if="greetMsg" class="alert alert-success mt-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ greetMsg }}</span>
            </div>
          </div>
        </div>
      </div>

      <Settings v-if="currentView === 'settings'" />
      <Tools v-if="currentView === 'tools'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Settings from './components/Settings.vue'
import Tools from './components/Tools.vue'

const currentView = ref('home')
const greetMsg = ref('')

async function greet() {
  greetMsg.value = 'Hello from Tauri!'
}
</script>

<style scoped>
/* Starfield animation */
@keyframes move-twink-back {
  from {background-position: 0 0;}
  to {background-position: -10000px 5000px;}
}

.stars, .twinkling {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: -1;
}

.stars {
  background: #000 url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==') repeat top center;
}

.twinkling {
  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQIW2NkYGD4z8DAwMgABXAGNgGADgMB+1u3CQAAAABJRU5ErkJggg==') repeat top center;
  animation: move-twink-back 200s linear infinite;
  opacity: 0.3;
}
</style>