import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetch } from '@tauri-apps/plugin-http'
import { useApiCache } from './useApiCache'

export function useCommLinks() {
  const { t: $t } = useI18n()
  const { fetchWithCache } = useApiCache()

  const commLinks = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchCommLinks(limit = 10) {
    try {
      loading.value = true
      error.value = null

      const url = "https://leonick.se/feeds/rsi/json"
      const cacheKey = `commlinks_${limit}`
      const ONE_WEEK_MS = 60 * 60 * 1000

      // Use cached data or fetch fresh data
      const data = await fetchWithCache(cacheKey, ONE_WEEK_MS, async () => {
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

        return JSON.parse(cleanText)
      })

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