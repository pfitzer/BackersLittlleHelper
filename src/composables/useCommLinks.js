import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetch } from '@tauri-apps/plugin-http'

export function useCommLinks() {
  const { t: $t } = useI18n()

  const commLinks = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchCommLinks(limit = 10) {
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
        commLinks.value = data.items.slice(0, limit)
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

  return {
    commLinks,
    loading,
    error,
    fetchCommLinks
  }
}