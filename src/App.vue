<template>
  <div class="h-screen flex flex-col overflow-hidden relative">

    <!-- Navigation -->
    <div class="navbar backdrop-blur-md border-b border-blue-500/20 flex-shrink-0 rsi-border relative z-10" style="background: rgba(0, 11, 17, 0.85);">
      <div class="flex-1">
        <h1 class="text-2xl font-bold tracking-wider uppercase rsi-glow" style="color: #3b82f6; letter-spacing: 0.1em;">
          {{ $t('app.title') }}
        </h1>
      </div>
      <div class="flex-none gap-1">
        <button
          @click="currentView = 'home'"
          :class="['btn btn-sm font-mono uppercase tracking-wide transition-all', currentView === 'home' ? 'rsi-nav-active' : 'rsi-nav-btn']"
        >
          {{ $t('app.home') }}
        </button>
        <button
          @click="currentView = 'vehicles'"
          :class="['btn btn-sm font-mono uppercase tracking-wide transition-all', currentView === 'vehicles' ? 'rsi-nav-active' : 'rsi-nav-btn']"
        >
          {{ $t('app.vehicles') }}
        </button>
        <button
          @click="currentView = 'settings'"
          :class="['btn btn-sm font-mono uppercase tracking-wide transition-all', currentView === 'settings' ? 'rsi-nav-active' : 'rsi-nav-btn']"
        >
          {{ $t('app.settings') }}
        </button>
        <button
            @click="currentView = 'tools'"
            :class="['btn btn-sm font-mono uppercase tracking-wide transition-all', currentView === 'tools' ? 'rsi-nav-active' : 'rsi-nav-btn']"
        >
          {{ $t('app.tools') }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="container mx-auto px-1 py-1">
        <Home v-if="currentView === 'home'" />
        <Vehicles v-if="currentView === 'vehicles'" />
        <Settings v-if="currentView === 'settings'" />
        <Tools v-if="currentView === 'tools'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Home from './components/Home.vue'
import Settings from './components/Settings.vue'
import Tools from './components/Tools.vue'
import Vehicles from './components/Vehicles.vue'

const currentView = ref('home')

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