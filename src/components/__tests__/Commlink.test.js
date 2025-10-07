import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Commlink from '../Commlink.vue'
import { createI18n } from 'vue-i18n'
import { ref } from 'vue'

// Mock the useCommLinks composable
vi.mock('../../composables/useCommLinks', () => ({
  useCommLinks: () => ({
    commLinks: ref([]),
    loading: ref(false),
    error: ref(null),
    fetchCommLinks: vi.fn()
  })
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      commlink: {
        title: 'Comm-Link'
      },
      common: {
        loading: 'Loading...',
        readMore: 'Read More'
      },
      home: {
        errorLoadingNews: 'Error loading news'
      }
    }
  }
})

describe('Commlink.vue', () => {

  it('renders comm-link title', () => {
    const wrapper = mount(Commlink, {
      global: {
        plugins: [i18n]
      }
    })
    expect(wrapper.text()).toContain('Comm-Link')
  })

  it('applies correct CSS classes to root element', () => {
    const wrapper = mount(Commlink, {
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

  it('has gradient text classes on h2 heading', () => {
    const wrapper = mount(Commlink, {
      global: {
        plugins: [i18n]
      }
    })
    const h2 = wrapper.find('h2')
    expect(h2.exists()).toBe(true)
    expect(h2.classes()).toContain('bg-gradient-to-r')
    expect(h2.classes()).toContain('from-primary')
    expect(h2.classes()).toContain('to-secondary')
    expect(h2.classes()).toContain('bg-clip-text')
    expect(h2.classes()).toContain('text-transparent')
  })

  it('does not show loading indicator when not loading', () => {
    const wrapper = mount(Commlink, {
      global: {
        plugins: [i18n]
      }
    })
    // With loading set to false, we shouldn't see loading text
    const loadingText = wrapper.find('.text-gray-400')
    expect(loadingText.exists()).toBe(false)
  })
})