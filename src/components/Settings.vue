<template>
  <div class="settings-container">
    <h2>{{ $t('settings.title') }}</h2>

    <div class="settings-section">
      <h3>{{ $t('settings.directories') }}</h3>
      <div class="setting-item">
        <label for="installation-dir">{{ $t('settings.installationDir') }}</label>
        <div class="path-input-group">
          <input
            id="installation-dir"
            v-model="settings.installationDirectory"
            type="text"
            @change="saveSettings"
          />
          <button @click="selectDirectory('installationDirectory')" class="btn-browse">
            {{ $t('settings.browse') }}
          </button>
        </div>
      </div>
      <div class="setting-item">
        <label for="user-dir">{{ $t('settings.userDir') }}</label>
        <div class="path-input-group">
          <input
            id="user-dir"
            v-model="settings.userDirectory"
            type="text"
            @change="saveSettings"
          />
          <button @click="selectDirectory('userDirectory')" class="btn-browse">
            {{ $t('settings.browse') }}
          </button>
        </div>
      </div>
      <div class="setting-item">
        <label for="shader-dir">{{ $t('settings.shaderDir') }}</label>
        <div class="path-input-group">
          <input
            id="shader-dir"
            v-model="settings.shaderDirectory"
            type="text"
            @change="saveSettings"
          />
          <button @click="selectDirectory('shaderDirectory')" class="btn-browse">
            {{ $t('settings.browse') }}
          </button>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <h3>{{ $t('settings.appearance') }}</h3>
      <div class="setting-item">
        <label for="theme">{{ $t('settings.theme') }}</label>
        <select id="theme" v-model="settings.theme" @change="saveSettings">
          <option value="light">{{ $t('settings.themeLight') }}</option>
          <option value="dark">{{ $t('settings.themeDark') }}</option>
          <option value="auto">{{ $t('settings.themeAuto') }}</option>
        </select>
      </div>
    </div>

    <div class="settings-section">
      <h3>{{ $t('settings.advanced') }}</h3>
      <div class="setting-item">
        <label>
          <input
            type="checkbox"
            v-model="settings.enableNotifications"
            @change="saveSettings"
          />
          {{ $t('settings.enableNotifications') }}
        </label>
      </div>
      <div class="setting-item">
        <label>
          <input
            type="checkbox"
            v-model="settings.autoStart"
            @change="saveSettings"
          />
          {{ $t('settings.autoStart') }}
        </label>
      </div>
    </div>

    <div class="settings-actions">
      <button @click="resetSettings" class="btn-secondary">{{ $t('settings.resetDefaults') }}</button>
      <button @click="saveSettings" class="btn-primary">{{ $t('settings.saveSettings') }}</button>
    </div>

    <div v-if="saveMessage" class="save-message">{{ saveMessage }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { open } from '@tauri-apps/plugin-dialog'
import { BaseDirectory, writeTextFile, readTextFile, exists, mkdir } from '@tauri-apps/plugin-fs'

const { t: $t } = useI18n()

const settings = ref({
  installationDirectory: '',
  userDirectory: '',
  shaderDirectory: '',
  theme: 'dark',
  enableNotifications: true,
  autoStart: false
})

const saveMessage = ref('')

const defaultSettings = {
  installationDirectory: '',
  userDirectory: '',
  shaderDirectory: '',
  theme: 'dark',
  enableNotifications: true,
  autoStart: false
}

const SETTINGS_FILE = 'settings.json'

onMounted(async () => {
  await loadSettings()
})

async function loadSettings() {
  try {
    console.log('Loading settings from:', SETTINGS_FILE)
    const fileExists = await exists(SETTINGS_FILE, { baseDir: BaseDirectory.AppData })
    console.log('Settings file exists:', fileExists)
    if (fileExists) {
      const contents = await readTextFile(SETTINGS_FILE, { baseDir: BaseDirectory.AppData })
      console.log('Settings contents:', contents)
      const loadedSettings = JSON.parse(contents)
      // Filter out any old fields that no longer exist
      const { appName, ...validSettings } = loadedSettings
      settings.value = { ...defaultSettings, ...validSettings }
      console.log('Settings loaded:', settings.value)
    } else {
      console.log('No settings file found, using defaults')
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
    } catch (mkdirError) {
      // Directory might already exist, ignore error
      console.log('Directory creation skipped:', mkdirError)
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

async function selectDirectory(field) {
  console.log('selectDirectory called for:', field)
  try {
    console.log('Opening dialog...')
    const selected = await open({
      directory: true,
      multiple: false,
      title: `Select ${field.replace(/([A-Z])/g, ' $1').trim()}`
    })

    console.log('Selected:', selected)
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
.settings-container {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #646cff;
  padding-bottom: 0.5rem;
}

h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #646cff;
}

.settings-section {
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
}

.setting-item {
  margin-bottom: 1rem;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-item label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.setting-item input[type="text"],
.setting-item select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #444;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.2);
  color: inherit;
  font-size: 1rem;
}

.path-input-group {
  display: flex;
  gap: 0.5rem;
}

.path-input-group input {
  flex: 1;
}

.btn-browse {
  padding: 0.5rem 1rem;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: all 0.2s;
}

.btn-browse:hover {
  background-color: #535bf2;
}

.setting-item input[type="checkbox"] {
  margin-right: 0.5rem;
}

.settings-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #646cff;
  color: white;
}

.btn-primary:hover {
  background-color: #535bf2;
}

.btn-secondary {
  background-color: #444;
  color: white;
}

.btn-secondary:hover {
  background-color: #555;
}

.save-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  text-align: center;
}
</style>