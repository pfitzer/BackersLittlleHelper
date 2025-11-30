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

        // Check if response is empty or incomplete
        if (!text || text.trim().length === 0) {
          throw new Error('Empty response from API')
        }


        // Clean up the response:
        // The API returns JSON that is improperly encoded as a string
        let cleanText = text.trim()

        // The response starts with leading garbage (en-dash) then a quoted JSON string
        // Don't strip the leading quote - we need it to detect double-encoding
        // Only strip non-quote, non-brace characters
        let leadingGarbage = 0
        for (let i = 0; i < cleanText.length; i++) {
          const code = cleanText.charCodeAt(i)
          // Stop at first quote (34), brace (123), or bracket (91)
          if (code === 34 || code === 123 || code === 91) {
            break
          }
          leadingGarbage++
        }

        if (leadingGarbage > 0) {
          cleanText = cleanText.substring(leadingGarbage)
        }

        // Check if the JSON is wrapped in quotes
        // Pattern: "{ ... }" where the quotes are part of the encoding, not the JSON
        const startsWithQuotedJson = cleanText.charCodeAt(0) === 34 && // " quote
                                      (cleanText.charCodeAt(1) === 123 || cleanText.charCodeAt(1) === 91) && // { or [
                                      (cleanText.endsWith('}"') || cleanText.endsWith(']"'))

        if (startsWithQuotedJson) {
          // Remove outer quotes
          cleanText = cleanText.slice(1, -1)
        }

        // Fix invalid escape sequences and malformed content
        // The API returns malformed JSON with various issues

        // 1. Fix literal control characters in HTML content values FIRST
        // The API has literal newlines/tabs in the HTML content which breaks JSON
        // We need to escape these, but ONLY in content_html values, not in the JSON structure
        // Use char codes to avoid confusion with escape sequences
        cleanText = cleanText.replace(/"content_html":\s*"([\s\S]*?)(?="[\s,\n\r]*[}\]])/g, (match, htmlContent) => {
          // Escape literal control characters (actual bytes, not escape sequences)
          const escaped = htmlContent
            .replace(/\x0A/g, '\\n')   // Escape literal newline (LF) char code 10
            .replace(/\x0D/g, '\\r')   // Escape literal carriage return (CR) char code 13
            .replace(/\x09/g, '\\t')   // Escape literal tab char code 9
          return `"content_html": "${escaped}`
        })

        // 2. Fix HTML entities that are improperly escaped
        cleanText = cleanText.replace(/\\&/g, '&')

        // 3. Remove other invalid escape sequences
        // Only match backslashes not followed by valid JSON escape chars (", \, /, b, f, n, r, t, u)
        const invalidEscapes = /\\(?!["\\/bfnrtu])/g
        cleanText = cleanText.replace(invalidEscapes, '')

        // 3. Fix malformed ending: The last content_html field is missing its closing quote
        // Pattern: ...&quot;&gt;\n\t}\t]\n}
        // Should be: ...&quot;&gt;"\n\t}\t]\n}
        // Add the missing closing quote for the content_html value
        cleanText = cleanText.replace(/(&quot;&gt;)\s*\n\s*\}\s*\]\s*\n\s*\}\s*$/, '$1"\n\t}\t]\n}')

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