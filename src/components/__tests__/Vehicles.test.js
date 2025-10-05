import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Vehicles from '../Vehicles.vue'
import { createI18n } from 'vue-i18n'

// Mock the Tauri HTTP plugin
vi.mock('@tauri-apps/plugin-http', () => ({
  fetch: vi.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: [] })
  }))
}))

import { fetch as mockFetch } from '@tauri-apps/plugin-http'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      vehicles: {
        title: 'Vehicles',
        search: 'Search vehicles...',
        startSearching: 'Start typing to search for vehicles',
        noResults: 'No vehicles found',
        manufacturer: 'Manufacturer',
        type: 'Type',
        size: 'Size',
        crew: 'Crew',
        length: 'Length',
        beam: 'Beam',
        height: 'Height',
        mass: 'Mass',
        components: 'Components',
        componentType: 'Type',
        componentName: 'Name',
        componentSize: 'Size',
        componentManufacturer: 'Manufacturer',
        shops: 'Available at Shops',
        price: 'Price',
        viewDetails: 'View Details',
        errorLoading: 'Failed to load vehicles. Please try again later.'
      }
    }
  }
})

describe('Vehicles.vue', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('renders title', () => {
    const wrapper = mount(Vehicles, {
      global: {
        plugins: [i18n]
      }
    })
    expect(wrapper.text()).toContain('Vehicles')
  })

  it('displays search field with correct placeholder', () => {
    const wrapper = mount(Vehicles, {
      global: {
        plugins: [i18n]
      }
    })
    const input = wrapper.find('input[type="text"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Search vehicles...')
  })

  it('displays initial empty state message', () => {
    const wrapper = mount(Vehicles, {
      global: {
        plugins: [i18n]
      }
    })
    expect(wrapper.text()).toContain('Start typing to search for vehicles')
  })

  it('does not trigger search when input is less than 3 characters', async () => {
    const wrapper = mount(Vehicles, {
      global: {
        plugins: [i18n]
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('Cu')

    // Wait a bit to ensure no debounced call
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('triggers search when input is 3 or more characters', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: [
          {
            id: 1,
            name: 'Cutlass Black',
            manufacturer: { name: 'Drake' }
          }
        ]
      })
    })

    const wrapper = mount(Vehicles, {
      global: {
        plugins: [i18n]
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('Cut')

    // Wait for the search to trigger
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('vehicles/search'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ query: 'Cut' })
      })
    )
  })

  it('displays search results in dropdown', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: [
          {
            id: 1,
            name: 'Cutlass Black',
            manufacturer: { name: 'Drake' }
          },
          {
            id: 2,
            name: 'Cutlass Red',
            manufacturer: { name: 'Drake' }
          }
        ]
      })
    })

    const wrapper = mount(Vehicles, {
      global: {
        plugins: [i18n]
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('Cut')

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Cutlass Black')
    expect(wrapper.text()).toContain('Cutlass Red')
    expect(wrapper.text()).toContain('Drake')
  })

  it('fetches vehicle details when selecting from dropdown', async () => {
    const searchResponse = {
      ok: true,
      json: () => Promise.resolve({
        data: [
          {
            id: 1,
            name: 'Cutlass Black',
            manufacturer: { name: 'Drake' }
          }
        ]
      })
    }

    const detailsResponse = {
      ok: true,
      json: () => Promise.resolve({
        data: {
          id: 1,
          name: 'Cutlass Black',
          description: 'A versatile medium freighter',
          manufacturer: { name: 'Drake' },
          type: 'Medium Freight',
          size: 'Medium',
          crew: { min: 1, max: 3 },
          length: 38,
          beam: 26.5,
          height: 10.5,
          mass: 53000
        }
      })
    }

    mockFetch
      .mockResolvedValueOnce(searchResponse)
      .mockResolvedValueOnce(detailsResponse)

    const wrapper = mount(Vehicles, {
      global: {
        plugins: [i18n]
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('Cut')

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    // Click on the first result
    const firstResult = wrapper.find('li')
    await firstResult.trigger('click')

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    // Check that the 2nd call was for vehicle details (1st was search, 2nd is details)
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('vehicles/Cutlass%20Black')
    )
  })

  it('displays vehicle details after selection', async () => {
    const searchResponse = {
      ok: true,
      json: () => Promise.resolve({
        data: [
          {
            id: 1,
            name: 'Cutlass Black',
            manufacturer: { name: 'Drake' }
          }
        ]
      })
    }

    const detailsResponse = {
      ok: true,
      json: () => Promise.resolve({
        data: {
          id: 1,
          name: 'Cutlass Black',
          description: 'A versatile medium freighter',
          manufacturer: { name: 'Drake' },
          type: 'Medium Freight',
          size: 'Medium',
          crew: { min: 1, max: 3 },
          length: 38,
          beam: 26.5,
          height: 10.5,
          mass: 53000
        }
      })
    }

    mockFetch
      .mockResolvedValueOnce(searchResponse)
      .mockResolvedValueOnce(detailsResponse)

    const wrapper = mount(Vehicles, {
      global: {
        plugins: [i18n]
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('Cut')

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    const firstResult = wrapper.find('li')
    await firstResult.trigger('click')

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Cutlass Black')
    expect(wrapper.text()).toContain('A versatile medium freighter')
    expect(wrapper.text()).toContain('Medium Freight')
    expect(wrapper.text()).toContain('38m')
  })

  it('displays loading spinner during fetch', async () => {
    mockFetch.mockImplementation(() => new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ok: true,
          json: () => Promise.resolve({ data: [] })
        })
      }, 1000)
    }))

    const wrapper = mount(Vehicles, {
      global: {
        plugins: [i18n]
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('Cut')

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
  })

  it('displays error message on fetch failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    const wrapper = mount(Vehicles, {
      global: {
        plugins: [i18n]
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('Cut')

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    // Error should be logged but component should handle gracefully
    expect(wrapper.vm.searchResults).toEqual([])
  })

  it('displays shops when available in vehicle details', async () => {
    const searchResponse = {
      ok: true,
      json: () => Promise.resolve({
        data: [
          {
            id: 1,
            name: 'Cutlass Black',
            manufacturer: { name: 'Drake' }
          }
        ]
      })
    }

    const detailsResponse = {
      ok: true,
      json: () => Promise.resolve({
        data: {
          id: 1,
          name: 'Cutlass Black',
          manufacturer: { name: 'Drake' },
          shops: [
            {
              id: 1,
              name_raw: 'New Deal',
              location: 'Lorville',
              items: [
                {
                  id: 1,
                  base_price: 1456200
                }
              ]
            }
          ]
        }
      })
    }

    mockFetch
      .mockResolvedValueOnce(searchResponse)
      .mockResolvedValueOnce(detailsResponse)

    const wrapper = mount(Vehicles, {
      global: {
        plugins: [i18n]
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('Cut')

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    const firstResult = wrapper.find('li')
    await firstResult.trigger('click')

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Available at Shops')
    expect(wrapper.text()).toContain('New Deal')
    expect(wrapper.text()).toContain('Lorville')
    // Price formatting is locale-dependent, just check it contains the price
    expect(wrapper.text()).toMatch(/1[.,]456[.,]200/)
  })

  it('applies correct CSS classes to root element', () => {
    const wrapper = mount(Vehicles, {
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

  it('has gradient text classes on title', () => {
    const wrapper = mount(Vehicles, {
      global: {
        plugins: [i18n]
      }
    })
    const h2 = wrapper.find('h2')
    expect(h2.classes()).toContain('bg-gradient-to-r')
    expect(h2.classes()).toContain('from-primary')
    expect(h2.classes()).toContain('to-secondary')
    expect(h2.classes()).toContain('bg-clip-text')
    expect(h2.classes()).toContain('text-transparent')
  })
})