import { BaseDirectory, exists, readTextFile, writeTextFile, mkdir } from '@tauri-apps/plugin-fs'

const CACHE_DIR = 'cache'

/**
 * Creates a simple hash from a string for use as a cache key
 */
function hashKey(key) {
  return key.replace(/[^a-zA-Z0-9]/g, '_')
}

/**
 * Composable for caching API responses with 1 week expiration
 */
export function useApiCache() {
  /**
   * Get cached data if it exists and is not expired
   * @param {string} key - The cache key
   * @param {string} time
   * @returns {Promise<any|null>} The cached data or null if not found/expired
   */
  async function getCached(key, time) {
    try {
      const fileName = `${hashKey(key)}.json`
      const filePath = `${CACHE_DIR}/${fileName}`

      const fileExists = await exists(filePath, { baseDir: BaseDirectory.AppData })

      if (!fileExists) {
        return null
      }

      const content = await readTextFile(filePath, { baseDir: BaseDirectory.AppData })
      const cached = JSON.parse(content)

      // Check if cache is expired
      const now = Date.now()
      if (now - cached.timestamp > time) {
        console.log(`Cache expired for key: ${key}`)
        return null
      }

      console.log(`Cache hit for key: ${key}`)
      return cached.data
    } catch (error) {
      console.error('Error reading cache:', error)
      return null
    }
  }

  /**
   * Save data to cache with current timestamp
   * @param {string} key - The cache key
   * @param {any} data - The data to cache
   * @returns {Promise<void>}
   */
  async function setCached(key, data) {
    try {
      const fileName = `${hashKey(key)}.json`
      const filePath = `${CACHE_DIR}/${fileName}`

      // Ensure cache directory exists
      try {
        await mkdir(CACHE_DIR, { baseDir: BaseDirectory.AppData, recursive: true })
      } catch (error) {
        // Directory might already exist, which is fine
      }

      const cacheData = {
        timestamp: Date.now(),
        data: data
      }

      await writeTextFile(filePath, JSON.stringify(cacheData), {
        baseDir: BaseDirectory.AppData
      })

      console.log(`Cache saved for key: ${key}`)
    } catch (error) {
      console.error('Error writing cache:', error)
    }
  }

  /**
   * Fetch data with caching support
   * @param {string} cacheKey - The cache key
   * @param {number} cacheDuration - Cache duration in milliseconds
   * @param {Function} fetchFunction - The async function to fetch data if not cached
   * @returns {Promise<any>} The data (from cache or freshly fetched)
   */
  async function fetchWithCache(cacheKey, cacheDuration, fetchFunction) {
    // Try to get from cache first
    const cached = await getCached(cacheKey, cacheDuration)
    if (cached !== null) {
      return cached
    }

    // If not in cache or expired, fetch fresh data
    console.log(`Cache miss for key: ${cacheKey}, fetching fresh data`)
    const freshData = await fetchFunction()

    // Save to cache
    await setCached(cacheKey, freshData)

    return freshData
  }

  return {
    getCached,
    setCached,
    fetchWithCache
  }
}
