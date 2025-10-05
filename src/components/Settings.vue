<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      {{ $t('settings.title') }}
    </h2>

    <!-- Directories Section -->
    <div class="card bg-base-300/50 backdrop-blur-md shadow-xl mb-6 border border-primary/20">
      <div class="card-body">
        <h3 class="card-title text-secondary mb-4">{{ $t('settings.directories') }}</h3>

        <div class="form-control mb-4">
          <label class="label" for="installation-dir">
            <span class="label-text">{{ $t('settings.installationDir') }}</span>
          </label>
          <div class="join">
            <input
              id="installation-dir"
              v-model="settings.installationDirectory"
              type="text"
              class="input input-bordered join-item flex-1 bg-base-100/50"
              @change="saveSettings"
            />
            <button @click="selectDirectory('installationDirectory')" class="btn btn-primary join-item">
              {{ $t('settings.browse') }}
            </button>
          </div>
        </div>

        <div class="form-control">
          <label class="label" for="backup-dir">
            <span class="label-text">{{ $t('settings.backupDir') }}</span>
          </label>
          <div class="join">
            <input
              id="backup-dir"
              v-model="settings.backupDirectory"
              type="text"
              class="input input-bordered join-item flex-1 bg-base-100/50"
              @change="saveSettings"
            />
            <button @click="selectDirectory('backupDirectory')" class="btn btn-primary join-item">
              {{ $t('settings.browse') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Appearance Section -->
    <div class="card bg-base-300/50 backdrop-blur-md shadow-xl mb-6 border border-primary/20">
      <div class="card-body">
        <h3 class="card-title text-secondary mb-4">{{ $t('settings.appearance') }}</h3>

        <div class="form-control">
          <label class="label" for="theme">
            <span class="label-text">{{ $t('settings.theme') }}</span>
          </label>
          <select id="theme" v-model="settings.theme" @change="changeTheme" class="select select-bordered bg-base-100/50">
            <option value="light">{{ $t('settings.themeLight') }}</option>
            <option value="dark">{{ $t('settings.themeDark') }}</option>
            <option value="night">{{ $t('settings.themeNight') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Advanced Section -->
    <div class="card bg-base-300/50 backdrop-blur-md shadow-xl mb-6 border border-primary/20">
      <div class="card-body">
        <h3 class="card-title text-secondary mb-4">{{ $t('settings.advanced') }}</h3>

        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-4">
            <input
              type="checkbox"
              v-model="settings.enableNotifications"
              @change="saveSettings"
              class="checkbox checkbox-primary"
            />
            <span class="label-text">{{ $t('settings.enableNotifications') }}</span>
          </label>
        </div>

        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-4">
            <input
              type="checkbox"
              v-model="settings.autoStart"
              @change="saveSettings"
              class="checkbox checkbox-primary"
            />
            <span class="label-text">{{ $t('settings.autoStart') }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-4 justify-end">
      <button @click="resetSettings" class="btn btn-ghost">
        {{ $t('settings.resetDefaults') }}
      </button>
      <button @click="saveSettings" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
        </svg>
        {{ $t('settings.saveSettings') }}
      </button>
    </div>

    <!-- Save Message -->
    <div v-if="saveMessage" class="alert alert-success mt-4 shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ saveMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { open } from '@tauri-apps/plugin-dialog'
import { BaseDirectory, writeTextFile, readTextFile, exists, mkdir } from '@tauri-apps/plugin-fs'
import { homeDir } from '@tauri-apps/api/path'

const { t: $t } = useI18n()

const settings = ref({
  installationDirectory: '',
  backupDirectory: '',
  theme: 'dark',
  enableNotifications: true,
  autoStart: false
})

const saveMessage = ref('')

const defaultSettings = {
  installationDirectory: '',
  backupDirectory: '',
  theme: 'dark',
  enableNotifications: true,
  autoStart: false
}

const SETTINGS_FILE = 'settings.json'

onMounted(async () => {
  await loadSettings()
  // Apply theme from settings
  applyTheme(settings.value.theme)
})

async function loadSettings() {
  try {
    // Get default home directory first
    const defaultBackupDir = await homeDir()

    const fileExists = await exists(SETTINGS_FILE, { baseDir: BaseDirectory.AppData })
    if (fileExists) {
      const contents = await readTextFile(SETTINGS_FILE, { baseDir: BaseDirectory.AppData })
      const loadedSettings = JSON.parse(contents)
      // Filter out any old fields that no longer exist
      // eslint-disable-next-line no-unused-vars
      const { appName, ...validSettings } = loadedSettings
      settings.value = { ...defaultSettings, ...validSettings }
    }

    // Always show default backup directory if not set
    if (!settings.value.backupDirectory) {
      settings.value.backupDirectory = defaultBackupDir
    }
  } catch (error) {
    console.error('Error loading settings:', error)
  }
}

async function saveSettings() {
  try {
    // Ensure the directory exists
    try {
      await mkdir('', { baseDir: BaseDirectory.AppData, recursive: true })
    } catch {
      // Directory might already exist, ignore error
    }

    await writeTextFile(SETTINGS_FILE, JSON.stringify(settings.value, null, 2), {
      baseDir: BaseDirectory.AppData
    })
    saveMessage.value = $t('settings.savedSuccessfully')
    setTimeout(() => {
      saveMessage.value = ''
    }, 2000)
  } catch (error) {
    console.error('Error saving settings:', error)
    saveMessage.value = $t('settings.errorSaving') + ': ' + (error?.message || String(error) || 'Unknown error')
    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
  }
}

function resetSettings() {
  settings.value = { ...defaultSettings }
  saveSettings()
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

function changeTheme() {
  applyTheme(settings.value.theme)
  saveSettings()
}

async function selectDirectory(field) {
  try {
    // Set default directory - use backup directory for installation directory, home for backup directory
    let defaultPath
    if (field === 'installationDirectory') {
      defaultPath = settings.value.backupDirectory || await homeDir()
    } else if (field === 'backupDirectory') {
      defaultPath = await homeDir()
    }

    const selected = await open({
      directory: true,
      multiple: false,
      defaultPath: defaultPath,
      title: `Select ${field.replace(/([A-Z])/g, ' $1').trim()}`
    })

    if (selected) {
      settings.value[field] = selected
      saveSettings()
    }
  } catch (error) {
    console.error('Error selecting directory:', error)
    saveMessage.value = 'Error: ' + error.message
    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
  }
}
</script>

<style scoped>
/* Additional space-themed styling if needed */
</style>