<template>
  <div class="max-w-6xl mx-auto h-full overflow-y-auto">
    <div class="hero mb-8">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h2 class="text-5xl font-bold mb-2 text-secondary">
            {{ $t('home.welcome') }}
          </h2>
          <p class="text-lg text-base-content/80">{{ $t('home.description') }}</p>
        </div>
      </div>
    </div>
    <!-- Latest Comm-Links -->
    <div class="mb-4">
      <h3 class="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        {{ $t('home.latestNews') }}
      </h3>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-error shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
      </div>

      <!-- Comm-Links Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
            v-for="commLink in commLinks"
            :key="commLink.id"
            class="card rsi-border rsi-corners backdrop-blur-md shadow-xl hover:shadow-2xl transition-all"
            style="background: rgba(0, 11, 17, 0.85);"
        >
          <figure v-if="commLink.banner" class="relative h-48 overflow-hidden">
            <img
                :src="commLink.banner"
                :alt="commLink.title"
                class="w-full h-full object-cover"
            />
          </figure>
          <div class="card-body">
            <h4 class="card-title" style="color: #3b82f6;">{{ commLink.title }}</h4>
            <p class="text-sm opacity-70">{{ formatDate(commLink.created_at) }}</p>
            <p class="text-sm line-clamp-3" v-if="commLink.excerpt">{{ commLink.excerpt }}</p>
            <div class="card-actions justify-end mt-4">
              <a
                  :href="commLink.rsi_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="rsi-nav-btn font-mono uppercase tracking-wide"
              >
                {{ $t('home.readMore') }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Server Status -->
    <div class="mb-2">
      <h3 class="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        {{ $t('home.serverStatus') }}
      </h3>

      <!-- Loading State -->
      <div v-if="statusLoading" class="flex justify-center items-center py-8">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <!-- Error State -->
      <div v-else-if="statusError" class="alert alert-warning shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ statusError }}</span>
      </div>

      <!-- Status Card -->
      <div v-else-if="serverStatus" class="card rsi-border rsi-corners backdrop-blur-md shadow-xl overflow-hidden" style="background: rgba(0, 11, 17, 0.85);">
        <div class="card-body">
          <div class="flex items-start justify-between">
            <div class="flex-1 overflow-hidden">
              <h4 class="card-title mb-2" style="color: #3b82f6;">{{ serverStatus.title }}</h4>
              <p class="text-sm opacity-70 mb-2">{{ formatDate(serverStatus.pubDate) }}</p>
              <div class="prose prose-sm max-w-none overflow-x-hidden" v-html="serverStatus.description"></div>
            </div>
            <div class="badge badge-lg flex-shrink-0 ml-4" :class="getStatusBadgeClass(serverStatus.title)">
              {{ getStatusText(serverStatus.title) }}
            </div>
          </div>
          <div class="card-actions justify-end mt-4">
            <a
              :href="serverStatus.link"
              target="_blank"
              rel="noopener noreferrer"
              class="rsi-nav-btn font-mono uppercase tracking-wide"
            >
              {{ $t('home.viewDetails') }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetch } from '@tauri-apps/plugin-http'

const { t: $t } = useI18n()

const commLinks = ref([])
const loading = ref(true)
const error = ref(null)

const serverStatus = ref(null)
const statusLoading = ref(true)
const statusError = ref(null)

onMounted(async () => {
  await Promise.all([
    fetchCommLinks(),
    fetchServerStatus()
  ])
})

async function fetchCommLinks() {
  try {
    loading.value = true
    error.value = null

    const response = await fetch('https://api.star-citizen.wiki/api/v2/comm-links?include=&limit=2')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data && data.data) {
      commLinks.value = data.data
    } else {
      throw new Error('Invalid response format')
    }
  } catch {
    error.value = $t('home.errorLoadingNews')
  } finally {
    loading.value = false
  }
}

async function fetchServerStatus() {
  try {
    statusLoading.value = true
    statusError.value = null

    const response = await fetch('https://status.robertsspaceindustries.com/index.xml')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const xmlText = await response.text()
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

    // Get the first item from the RSS feed
    const items = xmlDoc.getElementsByTagName('item')
    if (items.length > 0) {
      const item = items[0]
      serverStatus.value = {
        title: item.getElementsByTagName('title')[0]?.textContent || '',
        description: item.getElementsByTagName('description')[0]?.textContent || '',
        link: item.getElementsByTagName('link')[0]?.textContent || '',
        pubDate: item.getElementsByTagName('pubDate')[0]?.textContent || ''
      }
    } else {
      throw new Error('No status items found')
    }
  } catch {
    statusError.value = $t('home.errorLoadingStatus')
  } finally {
    statusLoading.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return ''

  const date = new Date(dateString)
  const locale = useI18n().locale.value

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function getStatusBadgeClass(title) {
  const lowerTitle = title.toLowerCase()
  if (lowerTitle.includes('operational') || lowerTitle.includes('resolved')) {
    return 'badge-success'
  } else if (lowerTitle.includes('degraded') || lowerTitle.includes('investigating')) {
    return 'badge-warning'
  } else if (lowerTitle.includes('outage') || lowerTitle.includes('down')) {
    return 'badge-error'
  }
  return 'badge-info'
}

function getStatusText(title) {
  const lowerTitle = title.toLowerCase()
  if (lowerTitle.includes('operational') || lowerTitle.includes('resolved')) {
    return $t('home.statusOperational')
  } else if (lowerTitle.includes('degraded') || lowerTitle.includes('investigating')) {
    return $t('home.statusDegraded')
  } else if (lowerTitle.includes('outage') || lowerTitle.includes('down')) {
    return $t('home.statusDown')
  }
  return $t('home.statusUnknown')
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>