<template>
  <div class="h-screen flex flex-col overflow-hidden">

    <!-- Navigation -->
    <div class="navbar bg-base-300/50 backdrop-blur-md border-b border-primary/30 flex-shrink-0">
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
          @click="currentView = 'vehicles'"
          :class="['btn btn-sm', currentView === 'vehicles' ? 'btn-primary' : 'btn-ghost']"
        >
          {{ $t('app.vehicles') }}
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