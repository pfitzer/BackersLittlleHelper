import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCommLinks } from '../useCommLinks'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

// Mock the Tauri HTTP plugin
vi.mock('@tauri-apps/plugin-http', () => ({
  fetch: vi.fn()
}))

import { fetch as mockFetch } from '@tauri-apps/plugin-http'

describe('useCommLinks', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('initializes with correct default values', () => {
    const { commLinks, loading, error } = useCommLinks()

    expect(commLinks.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
  })

  it('fetches and parses comm-links successfully', async () => {
    const mockData = {
      items: [
        {
          id: '1',
          title: 'Test News 1',
          summary: 'Summary 1',
          date_published: '2025-01-01',
          content_html: '<p>Content 1</p>'
        },
        {
          id: '2',
          title: 'Test News 2',
          summary: 'Summary 2',
          date_published: '2025-01-02',
          content_html: '<p>Content 2</p>'
        }
      ]
    }

    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockData))
    })

    const { commLinks, loading, error, fetchCommLinks } = useCommLinks()

    await fetchCommLinks(2)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://leonick.se/feeds/rsi/json',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Accept': 'application/json',
          'User-Agent': 'BackersLittleHelper/1.0'
        })
      })
    )
    expect(commLinks.value).toHaveLength(2)
    expect(commLinks.value[0].title).toBe('Test News 1')
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
  })

  it('respects the limit parameter', async () => {
    const mockData = {
      items: Array.from({ length: 15 }, (_, i) => ({
        id: `${i + 1}`,
        title: `News ${i + 1}`,
        summary: `Summary ${i + 1}`,
        date_published: '2025-01-01',
        content_html: `<p>Content ${i + 1}</p>`
      }))
    }

    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockData))
    })

    const { commLinks, fetchCommLinks } = useCommLinks()

    await fetchCommLinks(10)

    expect(commLinks.value).toHaveLength(10)
  })

  it('handles escaped characters in JSON', async () => {
    const mockDataWithEscapes = {
      items: [
        {
          id: '1',
          title: 'Test \\& Title',
          summary: 'Summary with \\& character',
          date_published: '2025-01-01',
          content_html: '<p>Content</p>'
        }
      ]
    }

    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockDataWithEscapes).replace(/&/g, '\\&'))
    })

    const { commLinks, fetchCommLinks } = useCommLinks()

    await fetchCommLinks(1)

    expect(commLinks.value[0].title).toContain('&')
  })

  it('handles HTTP errors', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500
    })

    const { loading, error, fetchCommLinks } = useCommLinks()

    await fetchCommLinks(10)

    expect(loading.value).toBe(false)
    expect(error.value).toBe('home.errorLoadingNews')
  })

  it('handles invalid JSON response', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('invalid json')
    })

    const { loading, error, fetchCommLinks } = useCommLinks()

    await fetchCommLinks(10)

    expect(loading.value).toBe(false)
    expect(error.value).toBe('home.errorLoadingNews')
  })

  it('handles missing items in response', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ data: [] }))
    })

    const { loading, error, fetchCommLinks } = useCommLinks()

    await fetchCommLinks(10)

    expect(loading.value).toBe(false)
    expect(error.value).toBe('home.errorLoadingNews')
  })

  it('sets loading state correctly during fetch', async () => {
    mockFetch.mockImplementation(() => new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ok: true,
          text: () => Promise.resolve(JSON.stringify({ items: [] }))
        })
      }, 100)
    }))

    const { loading, fetchCommLinks } = useCommLinks()

    expect(loading.value).toBe(false)

    const fetchPromise = fetchCommLinks(10)
    expect(loading.value).toBe(true)

    await fetchPromise
    expect(loading.value).toBe(false)
  })
})