import { ref } from 'vue'
import { BaseDirectory, exists } from '@tauri-apps/plugin-fs'

const SETTINGS_FILE = 'settings.json'

export function useSettings() {
  const settingsExist = ref(false)
  const loading = ref(true)

  async function checkSettingsExist() {
    try {
      loading.value = true
      settingsExist.value = await exists(SETTINGS_FILE, { baseDir: BaseDirectory.AppData })
    } catch (error) {
      console.error('Error checking settings:', error)
      settingsExist.value = false
    } finally {
      loading.value = false
    }
  }

  return {
    settingsExist,
    loading,
    checkSettingsExist
  }
}