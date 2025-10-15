import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useApiCache } from '../useApiCache'

// Mock Tauri filesystem plugin
const mockExists = vi.fn()
const mockReadTextFile = vi.fn()
const mockWriteTextFile = vi.fn()
const mockMkdir = vi.fn()

vi.mock('@tauri-apps/plugin-fs', () => ({
  BaseDirectory: {
    AppData: 'appdata'
  },
  exists: (...args) => mockExists(...args),
  readTextFile: (...args) => mockReadTextFile(...args),
  writeTextFile: (...args) => mockWriteTextFile(...args),
  mkdir: (...args) => mockMkdir(...args)
}))

describe('useApiCache', () => {
  let cache

  beforeEach(() => {
    cache = useApiCache()
    mockExists.mockClear()
    mockReadTextFile.mockClear()
    mockWriteTextFile.mockClear()
    mockMkdir.mockClear()

    // Default mock implementations
    mockExists.mockResolvedValue(false)
    mockMkdir.mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getCached', () => {
    it('returns null when cache file does not exist', async () => {
      mockExists.mockResolvedValue(false)

      const result = await cache.getCached('test-key', 1000)

      expect(result).toBeNull()
      expect(mockExists).toHaveBeenCalledWith(
        'cache/test_key.json',
        { baseDir: 'appdata' }
      )
    })

    it('returns cached data when not expired', async () => {
      const cachedData = {
        timestamp: Date.now() - 5000, // 5 seconds ago
        data: { foo: 'bar' }
      }

      mockExists.mockResolvedValue(true)
      mockReadTextFile.mockResolvedValue(JSON.stringify(cachedData))

      const result = await cache.getCached('test-key', 10000) // 10 second expiry

      expect(result).toEqual({ foo: 'bar' })
      expect(mockReadTextFile).toHaveBeenCalledWith(
        'cache/test_key.json',
        { baseDir: 'appdata' }
      )
    })

    it('returns null when cache is expired', async () => {
      const cachedData = {
        timestamp: Date.now() - 15000, // 15 seconds ago
        data: { foo: 'bar' }
      }

      mockExists.mockResolvedValue(true)
      mockReadTextFile.mockResolvedValue(JSON.stringify(cachedData))

      const result = await cache.getCached('test-key', 10000) // 10 second expiry

      expect(result).toBeNull()
    })

    it('returns null on read error', async () => {
      mockExists.mockResolvedValue(true)
      mockReadTextFile.mockRejectedValue(new Error('Read error'))

      const result = await cache.getCached('test-key', 10000)

      expect(result).toBeNull()
    })

    it('sanitizes cache key to valid filename', async () => {
      mockExists.mockResolvedValue(false)

      await cache.getCached('test/key:with*special?chars', 1000)

      expect(mockExists).toHaveBeenCalledWith(
        'cache/test_key_with_special_chars.json',
        { baseDir: 'appdata' }
      )
    })
  })

  describe('setCached', () => {
    it('creates cache directory if it does not exist', async () => {
      const testData = { foo: 'bar' }

      await cache.setCached('test-key', testData)

      expect(mockMkdir).toHaveBeenCalledWith(
        'cache',
        { baseDir: 'appdata', recursive: true }
      )
    })

    it('writes cache data with timestamp', async () => {
      const testData = { foo: 'bar' }
      const now = Date.now()

      await cache.setCached('test-key', testData)

      expect(mockWriteTextFile).toHaveBeenCalledWith(
        'cache/test_key.json',
        expect.stringContaining('"data":{"foo":"bar"}'),
        { baseDir: 'appdata' }
      )

      const writtenData = JSON.parse(mockWriteTextFile.mock.calls[0][1])
      expect(writtenData.timestamp).toBeGreaterThanOrEqual(now)
      expect(writtenData.data).toEqual(testData)
    })

    it('handles write errors gracefully', async () => {
      mockWriteTextFile.mockRejectedValue(new Error('Write error'))

      // Should not throw
      await expect(cache.setCached('test-key', { foo: 'bar' })).resolves.toBeUndefined()
    })

    it('handles mkdir errors gracefully', async () => {
      mockMkdir.mockRejectedValue(new Error('Directory already exists'))

      // Should still attempt to write
      await cache.setCached('test-key', { foo: 'bar' })

      expect(mockWriteTextFile).toHaveBeenCalled()
    })
  })

  describe('fetchWithCache', () => {
    it('returns cached data when available and not expired', async () => {
      const cachedData = {
        timestamp: Date.now() - 5000,
        data: { cached: true }
      }

      mockExists.mockResolvedValue(true)
      mockReadTextFile.mockResolvedValue(JSON.stringify(cachedData))

      const fetchFn = vi.fn().mockResolvedValue({ fresh: true })

      const result = await cache.fetchWithCache('test-key', 10000, fetchFn)

      expect(result).toEqual({ cached: true })
      expect(fetchFn).not.toHaveBeenCalled()
    })

    it('calls fetch function when cache is expired', async () => {
      const cachedData = {
        timestamp: Date.now() - 15000, // expired
        data: { cached: true }
      }

      mockExists.mockResolvedValue(true)
      mockReadTextFile.mockResolvedValue(JSON.stringify(cachedData))

      const fetchFn = vi.fn().mockResolvedValue({ fresh: true })

      const result = await cache.fetchWithCache('test-key', 10000, fetchFn)

      expect(result).toEqual({ fresh: true })
      expect(fetchFn).toHaveBeenCalledTimes(1)
    })

    it('calls fetch function when cache does not exist', async () => {
      mockExists.mockResolvedValue(false)

      const fetchFn = vi.fn().mockResolvedValue({ fresh: true })

      const result = await cache.fetchWithCache('test-key', 10000, fetchFn)

      expect(result).toEqual({ fresh: true })
      expect(fetchFn).toHaveBeenCalledTimes(1)
    })

    it('caches fetched data', async () => {
      mockExists.mockResolvedValue(false)

      const fetchFn = vi.fn().mockResolvedValue({ fresh: true })

      await cache.fetchWithCache('test-key', 10000, fetchFn)

      expect(mockWriteTextFile).toHaveBeenCalled()
      const writtenData = JSON.parse(mockWriteTextFile.mock.calls[0][1])
      expect(writtenData.data).toEqual({ fresh: true })
    })

    it('passes through fetch function errors', async () => {
      mockExists.mockResolvedValue(false)

      const fetchFn = vi.fn().mockRejectedValue(new Error('Fetch failed'))

      await expect(
        cache.fetchWithCache('test-key', 10000, fetchFn)
      ).rejects.toThrow('Fetch failed')
    })

    it('uses correct cache duration for expiration check', async () => {
      const oneHour = 60 * 60 * 1000
      const cachedData = {
        timestamp: Date.now() - 30 * 60 * 1000, // 30 minutes ago
        data: { cached: true }
      }

      mockExists.mockResolvedValue(true)
      mockReadTextFile.mockResolvedValue(JSON.stringify(cachedData))

      const fetchFn = vi.fn().mockResolvedValue({ fresh: true })

      // Should use cache (30 min < 1 hour)
      const result = await cache.fetchWithCache('test-key', oneHour, fetchFn)

      expect(result).toEqual({ cached: true })
      expect(fetchFn).not.toHaveBeenCalled()
    })

    it('handles different cache keys independently', async () => {
      mockExists.mockResolvedValue(false)

      const fetchFn1 = vi.fn().mockResolvedValue({ data: 1 })
      const fetchFn2 = vi.fn().mockResolvedValue({ data: 2 })

      await cache.fetchWithCache('key1', 10000, fetchFn1)
      await cache.fetchWithCache('key2', 10000, fetchFn2)

      expect(mockWriteTextFile).toHaveBeenCalledTimes(2)
      expect(mockWriteTextFile.mock.calls[0][0]).toBe('cache/key1.json')
      expect(mockWriteTextFile.mock.calls[1][0]).toBe('cache/key2.json')
    })
  })

  describe('integration scenarios', () => {
    it('full cache lifecycle: miss, store, hit', async () => {
      const cacheDuration = 10000
      const fetchFn = vi.fn().mockResolvedValue({ count: 1 })

      // First call - cache miss
      mockExists.mockResolvedValue(false)
      const result1 = await cache.fetchWithCache('counter', cacheDuration, fetchFn)

      expect(result1).toEqual({ count: 1 })
      expect(fetchFn).toHaveBeenCalledTimes(1)

      // Simulate cache now exists with the stored data
      const storedData = {
        timestamp: Date.now(),
        data: { count: 1 }
      }
      mockExists.mockResolvedValue(true)
      mockReadTextFile.mockResolvedValue(JSON.stringify(storedData))

      // Second call - cache hit
      const result2 = await cache.fetchWithCache('counter', cacheDuration, fetchFn)

      expect(result2).toEqual({ count: 1 })
      expect(fetchFn).toHaveBeenCalledTimes(1) // Still only called once
    })

    it('handles API response format with nested data', async () => {
      mockExists.mockResolvedValue(false)

      const apiResponse = {
        status: 'success',
        data: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' }
        ]
      }

      const fetchFn = vi.fn().mockResolvedValue(apiResponse)

      const result = await cache.fetchWithCache('items', 10000, fetchFn)

      expect(result).toEqual(apiResponse)

      // Check that cached data matches
      const writtenData = JSON.parse(mockWriteTextFile.mock.calls[0][1])
      expect(writtenData.data).toEqual(apiResponse)
    })
  })
})
