<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      {{ $t('tools.title') }}
    </h2>

    <!-- Installation Directory Tools -->
    <div class="card bg-base-300/50 backdrop-blur-md shadow-xl mb-6 border border-primary/20">
      <div class="card-body">
        <h3 class="card-title text-secondary mb-4">{{ $t('tools.installationDir') }}</h3>
        <p class="text-sm opacity-70 mb-4">{{ settings.installationDirectory || $t('tools.noPathSet') }}</p>
        <div class="flex gap-2 flex-wrap">
          <button @click="backupDirectory('installation')" class="btn btn-primary btn-sm" :disabled="!settings.installationDirectory">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            {{ $t('tools.backup') }}
          </button>
          <button @click="restoreDirectory('installation')" class="btn btn-secondary btn-sm" :disabled="!settings.installationDirectory">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            {{ $t('tools.restore') }}
          </button>
          <button @click="deleteDirectory('installation')" class="btn btn-error btn-sm" :disabled="!settings.installationDirectory">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ $t('tools.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- User Directory Tools -->
    <div class="card bg-base-300/50 backdrop-blur-md shadow-xl mb-6 border border-primary/20">
      <div class="card-body">
        <h3 class="card-title text-secondary mb-4">{{ $t('tools.userDir') }}</h3>
        <p class="text-sm opacity-70 mb-4">{{ settings.userDirectory || $t('tools.noPathSet') }}</p>
        <div class="flex gap-2 flex-wrap">
          <button @click="backupDirectory('user')" class="btn btn-primary btn-sm" :disabled="!settings.userDirectory">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            {{ $t('tools.backup') }}
          </button>
          <button @click="restoreDirectory('user')" class="btn btn-secondary btn-sm" :disabled="!settings.userDirectory">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            {{ $t('tools.restore') }}
          </button>
          <button @click="deleteDirectory('user')" class="btn btn-error btn-sm" :disabled="!settings.userDirectory">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ $t('tools.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Shader Directory Tools -->
    <div class="card bg-base-300/50 backdrop-blur-md shadow-xl mb-6 border border-primary/20">
      <div class="card-body">
        <h3 class="card-title text-secondary mb-4">{{ $t('tools.shaderDir') }}</h3>
        <p class="text-sm opacity-70 mb-4">{{ settings.shaderDirectory || $t('tools.noPathSet') }}</p>
        <div class="flex gap-2 flex-wrap">
          <button @click="backupDirectory('shader')" class="btn btn-primary btn-sm" :disabled="!settings.shaderDirectory">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            {{ $t('tools.backup') }}
          </button>
          <button @click="restoreDirectory('shader')" class="btn btn-secondary btn-sm" :disabled="!settings.shaderDirectory">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            {{ $t('tools.restore') }}
          </button>
          <button @click="deleteDirectory('shader')" class="btn btn-error btn-sm" :disabled="!settings.shaderDirectory">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ $t('tools.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Status Messages -->
    <div v-if="statusMessage" :class="['alert shadow-lg', statusType === 'success' ? 'alert-success' : statusType === 'error' ? 'alert-error' : 'alert-info']">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path v-if="statusType === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path v-else-if="statusType === 'error'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ statusMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from "vue-i18n"
import { BaseDirectory, readTextFile, exists, copyFile, readDir, remove } from '@tauri-apps/plugin-fs'
import { Command } from '@tauri-apps/plugin-shell'

const { t: $t } = useI18n()

const settings = ref({
  installationDirectory: '',
  userDirectory: '',
  shaderDirectory: ''
})

const statusMessage = ref('')
const statusType = ref('info')

const SETTINGS_FILE = 'settings.json'

onMounted(async () => {
  await loadSettings()
})

async function loadSettings() {
  try {
    const fileExists = await exists(SETTINGS_FILE, { baseDir: BaseDirectory.AppData })
    if (fileExists) {
      const contents = await readTextFile(SETTINGS_FILE, { baseDir: BaseDirectory.AppData })
      const loadedSettings = JSON.parse(contents)
      settings.value = {
        installationDirectory: loadedSettings.installationDirectory || '',
        userDirectory: loadedSettings.userDirectory || '',
        shaderDirectory: loadedSettings.shaderDirectory || ''
      }
    }
  } catch (error) {
    console.error('Error loading settings:', error)
  }
}

function getDirectoryPath(type) {
  switch(type) {
    case 'installation': return settings.value.installationDirectory
    case 'user': return settings.value.userDirectory
    case 'shader': return settings.value.shaderDirectory
    default: return ''
  }
}

async function backupDirectory(type) {
  const path = getDirectoryPath(type)
  if (!path) return

  statusMessage.value = $t('tools.backingUp')
  statusType.value = 'info'

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = `${path}_backup_${timestamp}`

    // Use system command to copy directory
    const command = Command.create('cp', ['-r', path, backupPath])
    await command.execute()

    statusMessage.value = $t('tools.backupSuccess')
    statusType.value = 'success'
    setTimeout(() => { statusMessage.value = '' }, 3000)
  } catch (error) {
    console.error('Backup error:', error)
    statusMessage.value = $t('tools.backupError') + ': ' + error.message
    statusType.value = 'error'
    setTimeout(() => { statusMessage.value = '' }, 5000)
  }
}

async function restoreDirectory(type) {
  const path = getDirectoryPath(type)
  if (!path) return

  statusMessage.value = $t('tools.restoring')
  statusType.value = 'info'

  try {
    // Find most recent backup
    const parentDir = path.substring(0, path.lastIndexOf('/'))
    const dirName = path.substring(path.lastIndexOf('/') + 1)

    // This is a placeholder - actual implementation would need directory listing
    statusMessage.value = $t('tools.restoreNotImplemented')
    statusType.value = 'error'
    setTimeout(() => { statusMessage.value = '' }, 3000)
  } catch (error) {
    console.error('Restore error:', error)
    statusMessage.value = $t('tools.restoreError') + ': ' + error.message
    statusType.value = 'error'
    setTimeout(() => { statusMessage.value = '' }, 5000)
  }
}

async function deleteDirectory(type) {
  const path = getDirectoryPath(type)
  if (!path) return

  if (!confirm($t('tools.confirmDelete'))) return

  statusMessage.value = $t('tools.deleting')
  statusType.value = 'info'

  try {
    await remove(path, { recursive: true })

    statusMessage.value = $t('tools.deleteSuccess')
    statusType.value = 'success'
    setTimeout(() => { statusMessage.value = '' }, 3000)
  } catch (error) {
    console.error('Delete error:', error)
    statusMessage.value = $t('tools.deleteError') + ': ' + error.message
    statusType.value = 'error'
    setTimeout(() => { statusMessage.value = '' }, 5000)
  }
}
</script>

<style scoped>

</style>