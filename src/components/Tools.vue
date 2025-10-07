<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      {{ $t('tools.title') }}
    </h2>

    <!-- Backup Directory Tools -->
    <div class="card bg-base-300/50 backdrop-blur-md shadow-xl mb-6 border border-primary/20">
      <div class="card-body">
        <h3 class="card-title text-secondary mb-4">{{ $t('tools.backupDir') }}</h3>
        <p class="text-sm opacity-70 mb-4">{{ settings.backupDirectory || $t('tools.noPathSet') }}</p>
        <div class="flex gap-2 flex-wrap">
          <button @click="deleteDirectory('backup')" class="btn btn-error btn-sm" :disabled="!settings.backupDirectory">
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

    <!-- Shader and Log Directory Tools Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Shader Directory Tools -->
      <div class="card bg-base-300/50 backdrop-blur-md shadow-xl border border-primary/20">
        <div class="card-body">
          <h3 class="card-title text-secondary mb-4">{{ $t('tools.shaderDir') }}</h3>
          <p class="text-sm opacity-70 mb-4">{{ settings.shaderDirectory || $t('tools.noPathSet') }}</p>
          <div class="flex gap-2 flex-wrap">
            <button @click="deleteDirectory('shader')" class="btn btn-error btn-sm" :disabled="!settings.shaderDirectory">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ $t('tools.delete') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Log Directory Tools -->
      <div class="card bg-base-300/50 backdrop-blur-md shadow-xl border border-primary/20">
        <div class="card-body">
          <h3 class="card-title text-secondary mb-4">{{ $t('tools.logDir') }}</h3>
          <p class="text-sm opacity-70 mb-4">{{ settings.logDirectory || $t('tools.noPathSet') }}</p>
          <div class="flex gap-2 flex-wrap items-center">
            <button @click="deleteDirectory('log')" class="btn btn-error btn-sm" :disabled="!settings.logDirectory">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ $t('tools.delete') }}
            </button>
            <span v-if="logSize" class="badge badge-neutral">{{ logSize }}</span>
          </div>
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
import { ref, onMounted, onActivated } from 'vue'
import { useI18n } from "vue-i18n"
import { BaseDirectory, readTextFile, exists, copyFile, readDir, remove, mkdir, stat } from '@tauri-apps/plugin-fs'
import { homeDir, dirname, localDataDir } from '@tauri-apps/api/path'

const { t: $t } = useI18n()

const settings = ref({
  userDirectory: '',
  backupDirectory: '',
  shaderDirectory: '',
  logDirectory: ''
})

const logSize = ref('')
const statusMessage = ref('')
const statusType = ref('info')

const SETTINGS_FILE = 'settings.json'

onMounted(async () => {
  await loadSettings()
  // Calculate log size only if not in test environment
  if (import.meta.env.MODE !== 'test') {
    await calculateLogSize()
  }
})

// Recalculate log size every time the component is activated/shown
onActivated(async () => {
  if (import.meta.env.MODE !== 'test' && settings.value.logDirectory) {
    await calculateLogSize()
  }
})

async function loadSettings() {
  try {
    // Get default directories
    const defaultBackupDir = await homeDir()
    const localDataPath = await localDataDir()

    const fileExists = await exists(SETTINGS_FILE, { baseDir: BaseDirectory.AppData })
    if (fileExists) {
      const contents = await readTextFile(SETTINGS_FILE, { baseDir: BaseDirectory.AppData })
      const loadedSettings = JSON.parse(contents)
      settings.value = {
        userDirectory: loadedSettings.installationDirectory ? `${loadedSettings.installationDirectory}\\StarCitizen\\LIVE\\user` : '',
        backupDirectory: loadedSettings.backupDirectory || '',
        shaderDirectory: `${localDataPath}\\Star Citizen`,
        logDirectory: loadedSettings.installationDirectory ? `${loadedSettings.installationDirectory}\\StarCitizen\\LIVE\\logs` : ''
      }
    }

    // Always show default backup directory if not set
    if (!settings.value.backupDirectory) {
      settings.value.backupDirectory = defaultBackupDir
    }
  } catch {
    // Settings file doesn't exist or is invalid, use defaults
  }
}

function getDirectoryPath(type) {
  switch(type) {
    case 'user': return settings.value.userDirectory
    case 'backup': return settings.value.backupDirectory
    case 'shader': return settings.value.shaderDirectory
    case 'log': return settings.value.logDirectory
    default: return ''
  }
}

async function copyDirectoryRecursive(sourcePath, destPath) {
  // Create destination directory
  await mkdir(destPath, { recursive: true })

  // Read source directory contents
  const entries = await readDir(sourcePath)

  for (const entry of entries) {
    const sourceFile = `${sourcePath}\\${entry.name}`
    const destFile = `${destPath}\\${entry.name}`

    if (entry.isDirectory) {
      // Recursively copy subdirectories
      await copyDirectoryRecursive(sourceFile, destFile)
    } else {
      // Copy file
      await copyFile(sourceFile, destFile)
    }
  }
}

async function backupDirectory(type) {
  const path = getDirectoryPath(type)
  if (!path) return

  statusMessage.value = $t('tools.backingUp')
  statusType.value = 'info'

  try {
    let backupPath
    if (type === 'user') {
      // For user directory, copy to backup directory with 'user' folder name
      backupPath = `${settings.value.backupDirectory}\\user`
      if (!settings.value.backupDirectory) {
        statusMessage.value = $t('tools.backupError') + ': No backup directory set'
        statusType.value = 'error'
        setTimeout(() => { statusMessage.value = '' }, 5000)
        return
      }
    } else {
      // For other directories, create timestamped backup
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      backupPath = `${path}_backup_${timestamp}`
    }

    // Copy directory recursively using filesystem API
    await copyDirectoryRecursive(path, backupPath)

    statusMessage.value = $t('tools.backupSuccess')
    statusType.value = 'success'
    setTimeout(() => { statusMessage.value = '' }, 3000)
  } catch (error) {
    statusMessage.value = $t('tools.backupError') + ': ' + (error?.message || 'Unknown error')
    statusType.value = 'error'
    setTimeout(() => { statusMessage.value = '' }, 5000)
  }
}

async function restoreDirectory(type) {
  const userPath = getDirectoryPath(type) + '\\..';
  if (!userPath) return

  statusMessage.value = $t('tools.restoring')
  statusType.value = 'info'

  try {
    if (type === 'user') {
      // For user directory, restore from backup directory
      const backupPath = `${settings.value.backupDirectory}\\user`

      if (!settings.value.backupDirectory) {
        statusMessage.value = $t('tools.restoreError') + ': No backup directory set'
        statusType.value = 'error'
        setTimeout(() => { statusMessage.value = '' }, 5000)
        return
      }

      // Check if backup exists
      const backupExists = await exists(backupPath)
      if (!backupExists) {
        statusMessage.value = $t('tools.restoreError') + ': No backup found'
        statusType.value = 'error'
        setTimeout(() => { statusMessage.value = '' }, 5000)
        return
      }

      // Get parent directory using Tauri's dirname function
      const parentPath = await dirname(userPath)

      // Copy from backup to parent directory
      await copyDirectoryRecursive(backupPath, parentPath)

      statusMessage.value = $t('tools.restoreSuccess')
      statusType.value = 'success'
      setTimeout(() => { statusMessage.value = '' }, 3000)
    } else {
      statusMessage.value = $t('tools.restoreNotImplemented')
      statusType.value = 'error'
      setTimeout(() => { statusMessage.value = '' }, 3000)
    }
  } catch (error) {
    statusMessage.value = $t('tools.restoreError') + ': ' + (error?.message || 'Unknown error')
    statusType.value = 'error'
    setTimeout(() => { statusMessage.value = '' }, 5000)
  }
}

async function calculateDirectorySize(path) {
  let totalSize = 0

  try {
    const dirExists = await exists(path)

    if (!dirExists) {
      return 0
    }

    const entries = await readDir(path)

    for (const entry of entries) {
      const entryPath = `${path}\\${entry.name}`

      if (entry.isDirectory) {
        const dirSize = await calculateDirectorySize(entryPath)
        totalSize += dirSize
      } else {
        try {
          const fileStat = await stat(entryPath)
          totalSize += fileStat.size
        } catch {
          // Silently skip files that can't be accessed
        }
      }
    }
  } catch {
    // Silently handle errors
  }

  return totalSize
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

async function calculateLogSize() {
  try {
    if (!settings.value.logDirectory) {
      logSize.value = ''
      return
    }

    const sizeInBytes = await calculateDirectorySize(settings.value.logDirectory)
    logSize.value = formatBytes(sizeInBytes)
  } catch {
    logSize.value = ''
  }
}

async function deleteDirectory(type) {
  const path = getDirectoryPath(type)
  if (!path) return

  if (!confirm($t('tools.confirmDelete'))) return

  statusMessage.value = $t('tools.deleting')
  statusType.value = 'info'

  try {
    if (type === 'backup') {
      // For backup directory, delete all contents but keep the directory
      const entries = await readDir(path)
      for (const entry of entries) {
        const entryPath = `${path}\\${entry.name}`
        await remove(entryPath, { recursive: true })
      }
    } else {
      // For other directories, delete the entire directory
      await remove(path, { recursive: true })
    }

    statusMessage.value = $t('tools.deleteSuccess')
    statusType.value = 'success'
    setTimeout(() => { statusMessage.value = '' }, 3000)

    // Recalculate log size if log directory was deleted
    if (type === 'log' && settings.value.logDirectory) {
      await calculateLogSize()
    }
  } catch (error) {
    statusMessage.value = $t('tools.deleteError') + ': ' + (error?.message || 'Unknown error')
    statusType.value = 'error'
    setTimeout(() => { statusMessage.value = '' }, 5000)
  }
}
</script>

<style scoped>

</style>