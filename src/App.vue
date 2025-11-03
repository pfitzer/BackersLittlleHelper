<template>
  <div class="h-screen flex flex-col overflow-hidden relative">
    <!-- 3D Space Background -->
    <ThreeDBackground />

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
            @click="currentView = 'commlink'"
            :class="['btn btn-sm font-mono uppercase tracking-wide transition-all', currentView === 'commlink' ? 'rsi-nav-active' : 'rsi-nav-btn']"
        >
          {{ $t('app.commlink') }}
        </button>
        <button
            @click="currentView = 'tools'"
            :class="['btn btn-sm font-mono uppercase tracking-wide transition-all', currentView === 'tools' ? 'rsi-nav-active' : 'rsi-nav-btn']"
        >
          {{ $t('app.tools') }}
        </button>
        <button
            @click="currentView = 'settings'"
            :class="['btn btn-sm font-mono uppercase tracking-wide transition-all', currentView === 'settings' ? 'rsi-nav-active' : 'rsi-nav-btn']"
        >
          {{ $t('app.settings') }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto relative z-10">
      <div class="container mx-auto px-1 py-1">
        <Home v-if="currentView === 'home'" @navigate-to="navigateTo" />
        <Vehicles v-if="currentView === 'vehicles'" />
        <Commlink v-if="currentView === 'commlink'" />
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
import Commlink from "./components/Commlink.vue"
import ThreeDBackground from './components/ThreeDBackground.vue'

const currentView = ref('home')

function navigateTo(view) {
  currentView.value = view
}

</script>

<style scoped>

</style>