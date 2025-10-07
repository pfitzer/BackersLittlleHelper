<script setup>
import { useI18n } from 'vue-i18n'
import {onMounted, ref} from "vue";
import {fetch} from "@tauri-apps/plugin-http";

const { t: $t } = useI18n()

const loading = ref(false)
const error = ref(null)
const commLinks = ref([])
const selectedItem = ref(null)

async function fetchCommLinksJson() {
  try {
    loading.value = true
    error.value = null

    const url = "https://leonick.se/feeds/rsi/json"

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'BackersLittleHelper/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Read as text and manually parse to handle escape sequences
    const text = await response.text()

    // Fix the invalid escape sequences in the JSON
    // The JSON contains \& which is not a valid JSON escape sequence
    const cleanText = text.replace(/\\&/g, '&')

    const data = JSON.parse(cleanText)

    if (data && data.items) {
      commLinks.value = data.items.slice(0, 10)
      console.log('Loaded', commLinks.value.length, 'comm-link items')
    } else {
      throw new Error('Invalid response format')
    }
  } catch (e) {
    console.error('Fetch error:', e)
    error.value = $t('home.errorLoadingNews')
  } finally {
    loading.value = false
  }
}

function openModal(item) {
  selectedItem.value = item
}

function closeModal() {
  selectedItem.value = null
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function decodeHtml(html) {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

onMounted(async () => {
  await Promise.all([
    fetchCommLinksJson()
  ])
})


</script>

<template>
  <div class="max-w-6xl mx-auto h-full overflow-y-auto p-6">
    <h2 class="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      {{ $t('commlink.title') }}
    </h2>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-400">{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-400">{{ error }}</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="item in commLinks"
        :key="item.id"
        class="card rsi-border rsi-corners backdrop-blur-md shadow-xl hover:shadow-2xl transition-all"
        style="background: rgba(0, 11, 17, 0.85);"
      >
        <div class="card-body">
          <h3 class="card-title mb-2" style="color: #3b82f6;">{{ item.title }}</h3>
          <p class="text-sm opacity-70 mb-4">{{ formatDate(item.date_published) }}</p>
          <p class="text-sm line-clamp-3 mb-4">{{ item.summary }}</p>

          <div class="card-actions justify-end mt-4">
            <button
              @click="openModal(item)"
              class="rsi-nav-btn font-mono uppercase tracking-wide"
            >
              {{ $t('common.readMore') }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="selectedItem" class="modal modal-open" @click.self="closeModal">
      <div class="modal-box max-w-4xl rsi-border rsi-corners backdrop-blur-md animate-modal-in" style="background: rgba(0, 11, 17, 0.95);">
        <button
          @click="closeModal"
          class="btn btn-sm btn-circle absolute right-2 top-2 rsi-nav-btn"
        >✕</button>

        <h3 class="font-bold text-3xl mb-2" style="color: #3b82f6;">{{ selectedItem.title }}</h3>
        <p class="text-sm opacity-70 mb-6">{{ formatDate(selectedItem.date_published) }}</p>

        <div class="prose prose-invert max-w-none overflow-y-auto max-h-[60vh]" v-html="decodeHtml(selectedItem.content_html)"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.modal {
  animation: modal-fade-in 0.3s ease-out;
}

.animate-modal-in {
  animation: modal-slide-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes modal-fade-in {
  from {
    background-color: rgba(0, 0, 0, 0);
  }
  to {
    background-color: rgba(0, 0, 0, 0.5);
  }
}

@keyframes modal-slide-in {
  from {
    transform: scale(0.7) translateY(-50px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* Glow effect on modal */
.modal-box {
  box-shadow: 0 0 40px rgba(59, 130, 246, 0.3);
}

/* Custom scrollbar for modal content */
.modal-box .prose::-webkit-scrollbar {
  width: 8px;
}

.modal-box .prose::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.modal-box .prose::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 4px;
}

.modal-box .prose::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.7);
}
</style>