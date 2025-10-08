<template>
  <div class="max-w-6xl mx-auto h-full overflow-y-auto">
    <h2 class="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      {{ $t('vehicles.title') }}
    </h2>

    <!-- Search Field -->
    <div class="mb-6 relative">
      <div class="form-control">
        <label class="label">
          <span class="label-text">{{ $t('vehicles.searchHint') }}</span>
        </label>
        <div class="input-group">
          <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('vehicles.search')"
              class="input input-bordered w-full bg-base-300/50 backdrop-blur-md"
              @focus="showDropdown = true"
          />
        </div>
      </div>

      <!-- Dropdown List -->
      <div
          v-if="showDropdown && searchResults.length > 0"
          class="absolute z-10 w-full mt-2 bg-base-300 rounded-lg shadow-xl border border-primary/20 max-h-96 overflow-y-auto"
      >
        <ul class="menu p-2">
          <li
              v-for="result in searchResults"
              :key="result.id"
              @click="selectVehicle(result)"
          >
            <a class="flex items-center gap-3">
              <img
                  v-if="result.thumbnail"
                  :src="result.thumbnail"
                  :alt="result.name"
                  class="w-12 h-12 object-contain rounded bg-base-200"
              />
              <div class="flex-1">
                <div class="font-semibold">{{ result.name }}</div>
                <div v-if="result.manufacturer" class="text-xs opacity-70">
                  {{ result.manufacturer.name }}
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error shadow-lg mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- No Search Message -->
    <div v-else-if="!searchQuery || searchQuery.trim().length === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24"
           stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <p class="text-lg opacity-70">{{ $t('vehicles.startSearching') }}</p>
    </div>

    <!-- No Results Message -->
    <div v-else-if="vehicles.length === 0 && !loading" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24"
           stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <p class="text-lg opacity-70">{{ $t('vehicles.noResults') }}</p>
    </div>

    <!-- Vehicle Details -->
    <div v-else>
      <div
          v-for="vehicle in vehicles"
          :key="vehicle.id"
          class="space-y-6"
      >
        <!-- Main Vehicle Card -->
        <div class="card bg-base-300/50 backdrop-blur-md shadow-xl border border-primary/20">
          <div class="card-body">
            <div class="flex flex-col md:flex-row gap-6">
              <figure v-if="vehicle.store_image" class="w-full md:w-1/3">
                <img
                    :src="vehicle.store_image"
                    :alt="vehicle.name"
                    class="w-full h-auto object-contain rounded-lg bg-base-200 p-4"
                />
              </figure>

              <div class="flex-1">
                <h3 class="card-title text-3xl text-secondary mb-4">{{ vehicle.name }}</h3>
                <div v-if="vehicle.description" class="mb-4 text-lg opacity-80 italic">
                  {{ vehicle.description }}
                </div>
                <div class="card bg-base-300/50 backdrop-blur-md shadow-xl border border-primary/20 mb-4">
                  <div class="card-body">
                    <h2 class="card-title">{{ $t('vehicles.info') }}</h2>
                    <div class="grid grid-cols-2 gap-4 text-md">
                      <div v-if="vehicle.manufacturer">
                        <span class="opacity-70">{{ $t('vehicles.manufacturer') }}:</span>
                        <div class="font-semibold">{{ vehicle.manufacturer.name }}</div>
                      </div>

                      <div v-if="vehicle.type">
                        <span class="opacity-70">{{ $t('vehicles.type') }}:</span>
                        <div class="font-semibold">{{ vehicle.type }}</div>
                        <ul class="list-disc list-inside mt-2">
                          <li v-for="foci in vehicle.foci" :key="foci" class="list-item">{{ foci }}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card bg-base-300/50 backdrop-blur-md shadow-xl border border-primary/20 mb-4">
                  <div class="card-body">
                    <h2 class="card-title">{{ $t('vehicles.body') }}</h2>
                    <div class="grid grid-cols-2 gap-4 text-md">
                      <div v-if="vehicle.size">
                        <span class="opacity-70">{{ $t('vehicles.size') }}:</span>
                        <div class="font-semibold">{{ vehicle.size }}</div>
                      </div>

                      <div v-if="vehicle.crew">
                        <span class="opacity-70">{{ $t('vehicles.crew') }}:</span>
                        <div class="font-semibold">min {{ vehicle.crew.min }} <span
                            v-if="vehicle.crew_max"> - max {{ vehicle.crew.max }}</span></div>
                      </div>

                      <div v-if="vehicle.sizes">
                        <span class="opacity-70">{{ $t('vehicles.dimensions') }}:</span>
                        <div class="font-semibold">{{ vehicle.sizes.length }}m x {{ vehicle.sizes.height }}m - Beam:
                          {{ vehicle.sizes.beam }}m
                        </div>
                      </div>

                      <div v-if="vehicle.mass">
                        <span class="opacity-70">{{ $t('vehicles.mass') }}:</span>
                        <div class="font-semibold">{{ vehicle.mass }} kg</div>
                      </div>
                      <div v-if="vehicle.cargo_capacity">
                        <span class="opacity-70">{{ $t('vehicles.carga_capacity') }}:</span>
                        <div class="font-semibold">{{ vehicle.cargo_capacity }} SCU</div>
                      </div>
                      <div v-if="vehicle.fuel">
                        <span class="opacity-70">{{ $t('vehicles.quantum_fuel') }}:</span>
                        <div class="font-semibold">{{ vehicle.fuel.capacity }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card bg-base-300/50 backdrop-blur-md shadow-xl border border-primary/20 mb-4">
                  <div class="card-body">
                    <h2 class="card-title">{{ $t('vehicles.speed') }}</h2>
                    <div class="grid grid-cols-2 gap-4 text-md">
                      <div v-if="vehicle.speed.scm">
                        <span class="opacity-70">{{ $t('vehicles.speed_scm') }}:</span>
                        <div class="font-semibold">{{ vehicle.speed.scm }} m/s</div>
                      </div>
                      <div v-if="vehicle.speed.max">
                        <span class="opacity-70">{{ $t('vehicles.speed_max') }}:</span>
                        <div class="font-semibold">{{ vehicle.speed.max }} m/s</div>
                      </div>
                      <div v-if="vehicle.speed.zero_to_scm">
                        <span class="opacity-70">{{ $t('vehicles.zero_to_scm') }}:</span>
                        <div class="font-semibold">{{ vehicle.speed.zero_to_scm }} s</div>
                      </div>
                      <div v-if="vehicle.speed.scm_to_zero">
                        <span class="opacity-70">{{ $t('vehicles.scm_to_zero') }}:</span>
                        <div class="font-semibold">{{ vehicle.speed.scm_to_zero }} s</div>
                      </div>
                    </div>
                    <div v-if="vehicle.agility" class="grid grid-cols-3 gap-6 text-md w-100 mt-4">
                      <div v-if="vehicle.agility.pitch">
                        <span class="opacity-70">{{ $t('vehicles.pitch') }}:</span>
                        <div class="font-semibold">{{ vehicle.agility.pitch }}</div>
                      </div>
                      <div v-if="vehicle.agility.yaw">
                        <span class="opacity-70">{{ $t('vehicles.yaw') }}:</span>
                        <div class="font-semibold">{{ vehicle.agility.yaw }}</div>
                      </div>
                      <div v-if="vehicle.speed.scm_to_zero">
                        <span class="opacity-70">{{ $t('vehicles.roll') }}:</span>
                        <div class="font-semibold">{{ vehicle.agility.roll }}</div>
                      </div>
                    </div>
                  </div>
                </div>


                <div class="mt-4">
                  <a
                      v-if="vehicle.url"
                      :href="vehicle.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn btn-primary btn-sm"
                  >
                    {{ $t('vehicles.viewDetails') }}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                          d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Components -->
        <div v-if="vehicle.components && vehicle.components.length > 0"
             class="card bg-base-300/50 backdrop-blur-md shadow-xl border border-primary/20">
          <div class="card-body">
            <h4 class="card-title text-xl text-secondary mb-4">{{ $t('vehicles.components') }}</h4>
            <div class="overflow-x-auto">
              <table class="table table-sm">
                <thead>
                <tr>
                  <th>{{ $t('vehicles.componentType') }}</th>
                  <th>{{ $t('vehicles.componentName') }}</th>
                  <th>{{ $t('vehicles.componentSize') }}</th>
                  <th>{{ $t('vehicles.componentManufacturer') }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="component in vehicle.components" :key="component.uuid">
                  <td>{{ component.type }}</td>
                  <td>{{ component.name }}</td>
                  <td>{{ component.size }}</td>
                  <td>{{ component.manufacturer }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Shops -->
        <div v-if="vehicle.shops && vehicle.shops.length > 0"
             class="card bg-base-300/50 backdrop-blur-md shadow-xl border border-primary/20">
          <div class="card-body">
            <h4 class="card-title text-xl text-secondary mb-4">{{ $t('vehicles.shops') }}</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="shop in vehicle.shops" :key="shop.id" class="p-4 bg-base-200 rounded-lg">
                <div class="font-semibold">{{ shop.name_raw }}</div>
                <div v-if="shop.location" class="text-sm opacity-70">{{ shop.location }}</div>
                <div v-if="shop.items && shop.items.length > 0" class="text-sm mt-2">
                  <div v-for="item in shop.items" :key="item.id">
                    {{ $t('vehicles.price') }}: {{ item.base_price?.toLocaleString() }} aUEC
                    <span
                        :class="{'text-green-600': item.rentable, 'text-red-600': !item.rentable }"
                        class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium inset-ring inset-ring-gray-500/10 float-end">{{ $t('vehicles.rentable') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {fetch} from '@tauri-apps/plugin-http'

const {t: $t, locale} = useI18n()

const vehicles = ref([])
const searchResults = ref([])
const selectedVehicle = ref(null)
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const showDropdown = ref(false)

// Debounce timer
let debounceTimer = null

// Watch for search query changes
watch(searchQuery, (newQuery) => {
  // Clear previous timer
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // If query is empty or less than 3 characters, clear results
  if (!newQuery || newQuery.trim().length < 3) {
    searchResults.value = []
    if (!newQuery || newQuery.trim().length === 0) {
      vehicles.value = []
      selectedVehicle.value = null
    }
    loading.value = false
    error.value = null
    return
  }

  // Search immediately for dropdown results (no debounce for better UX)
  searchVehiclesList(newQuery)
})

// Close dropdown when clicking outside
if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.form-control')) {
      showDropdown.value = false
    }
  })
}

async function searchVehiclesList(query) {
  try {
    loading.value = true
    error.value = null

    // Convert locale format (e.g., 'en' -> 'en_EN', 'de' -> 'de_DE')
    const apiLocale = locale.value === 'de' ? 'de_DE' : 'en_EN'

    // Search for vehicles matching the query using POST
    const url = `https://api.star-citizen.wiki/api/v2/vehicles/search?locale=${apiLocale}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({query})
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data && data.data) {
      searchResults.value = data.data
      showDropdown.value = true
    } else {
      searchResults.value = []
    }
  } catch (err) {
    console.error('Error searching vehicles list:', err)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

async function selectVehicle(vehicle) {
  selectedVehicle.value = vehicle
  searchQuery.value = vehicle.name
  showDropdown.value = false

  // Fetch full vehicle details
  await fetchVehicleDetails(vehicle.name)
}

async function fetchVehicleDetails(vehicleName) {
  try {
    loading.value = true
    error.value = null

    // Convert locale format (e.g., 'en' -> 'en_EN', 'de' -> 'de_DE')
    const apiLocale = locale.value === 'de' ? 'de_DE' : 'en_EN'

    // Fetch the specific vehicle with full details
    const url = `https://api.star-citizen.wiki/api/v2/vehicles/${encodeURIComponent(vehicleName)}?locale=${apiLocale}&include=manufacturer,shops,components`
    console.log('Fetch vehicle details URL:', url)

    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === 404) {
        vehicles.value = []
        loading.value = false
        return
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data && data.data) {
      vehicles.value = [data.data]
    } else {
      vehicles.value = []
    }
  } catch (err) {
    console.error('Error fetching vehicle details:', err)
    error.value = $t('vehicles.errorLoading')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Additional styling if needed */
</style>