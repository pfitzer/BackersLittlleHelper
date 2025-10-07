import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '../Home.vue'
import { createI18n } from 'vue-i18n'

// Mock the Tauri HTTP plugin
vi.mock('@tauri-apps/plugin-http', () => ({
  fetch: vi.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: [] }),
    text: () => Promise.resolve(JSON.stringify({
      items: [
        {
          id: '1',
          title: 'Test News 1',
          summary: 'Test summary 1',
          date_published: '2025-01-01',
          content_html: '<p>Test content 1</p>'
        },
        {
          id: '2',
          title: 'Test News 2',
          summary: 'Test summary 2',
          date_published: '2025-01-02',
          content_html: '<p>Test content 2</p>'
        }
      ]
    }))
  }))
}))

// Mock the useCommLinks composable
vi.mock('../../composables/useCommLinks', () => ({
  useCommLinks: () => ({
    commLinks: { value: [] },
    loading: { value: false },
    error: { value: null },
    fetchCommLinks: vi.fn()
  })
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      home: {
        welcome: 'Welcome',
        description: 'Your Star Citizen companion',
        latestNews: 'Latest Comm-Links',
        serverStatus: 'Server Status',
        readMore: 'Read More',
        viewDetails: 'View Details',
        errorLoadingNews: 'Error loading news',
        errorLoadingStatus: 'Error loading server status',
        statusOperational: 'Operational',
        statusDegraded: 'Degraded',
        statusDown: 'Down',
        statusUnknown: 'Unknown'
      }
    }
  }
})

describe('Home.vue', () => {

  it('renders welcome message', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [i18n]
      }
    })
    expect(wrapper.text()).toContain('Welcome')
  })

  it('displays loading spinner initially', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [i18n]
      }
    })
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
  })

  it('renders comm-links section heading', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [i18n]
      }
    })
    expect(wrapper.text()).toContain('Latest Comm-Links')
  })

  it('renders server status section heading', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [i18n]
      }
    })
    expect(wrapper.text()).toContain('Server Status')
  })

  it('applies correct CSS classes to root element', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [i18n]
      }
    })
    const rootDiv = wrapper.find('.max-w-6xl')
    expect(rootDiv.exists()).toBe(true)
    expect(rootDiv.classes()).toContain('mx-auto')
    expect(rootDiv.classes()).toContain('h-full')
    expect(rootDiv.classes()).toContain('overflow-y-auto')
  })

  it('has gradient text classes on h3 headings', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [i18n]
      }
    })
    const h3Elements = wrapper.findAll('h3')
    expect(h3Elements.length).toBeGreaterThan(0)
    h3Elements.forEach(h3 => {
      expect(h3.classes()).toContain('bg-gradient-to-r')
      expect(h3.classes()).toContain('from-primary')
      expect(h3.classes()).toContain('to-secondary')
      expect(h3.classes()).toContain('bg-clip-text')
      expect(h3.classes()).toContain('text-transparent')
    })
  })
})