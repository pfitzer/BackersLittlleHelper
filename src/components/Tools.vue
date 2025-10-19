<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      {{ $t('tools.title') }}
    </h2>

    <!-- Environment Folders Status -->
    <div class="card bg-base-300/50 backdrop-blur-md shadow-xl mb-6 border border-primary/20">
      <div class="card-body">
        <h3 class="card-title text-secondary mb-4">{{ $t('tools.environmentFolders') }}</h3>
        <div class="flex gap-4 flex-wrap">
          <div v-for="env in environments" :key="env" class="flex items-center gap-2">
            <span class="font-semibold">{{ env }}:</span>
            <span
                :class="[
                'badge',
                'badge-sm',
                environmentStatus[env] ? 'badge-success' : 'badge-error'
              ]"
            >
              {{ environmentStatus[env] ? $t('tools.folderExists') : $t('tools.folderMissing') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Backup Directory Tools -->
    <BackupListSection
      :backup-directory="settings.backupDirectory"
      :existing-backups="existingBackups"
      :get-universe-badge-class="getUniverseBadgeClass"
      @backup="backupDirectory('user')"
      @restore="restoreDirectory('user')"
      @delete="deleteDirectory('backup')"
      @restore-backup="restoreFromBackup"
      @delete-backup="deleteBackup"
    />

    <!-- User Directory Tools -->
    <div class="card bg-base-300/50 backdrop-blur-md shadow-xl mb-6 border border-primary/20">
      <div class="card-body">
        <h3 class="card-title text-secondary mb-4">{{ $t('tools.userDir') }}</h3>

        <!-- Environment Selector -->
        <div class="form-control mb-4">
          <div class="flex gap-2 items-center">
            <span class="text-sm opacity-70">{{ $t('tools.selectEnvironment') }}:</span>
            <div class="btn-group">
              <button
                v-for="env in environments"
                :key="env"
                @click="selectedEnvironment = env"
                :class="[
                  'btn btn-sm',
                  selectedEnvironment === env ? 'btn-primary' : 'btn-ghost',
                  !environmentStatus[env] ? 'opacity-50' : ''
                ]"
                :disabled="!environmentStatus[env]"
              >
                {{ env }}
              </button>
            </div>
          </div>
        </div>

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
        </div>
      </div>
    </div>

    <!-- Copy Between Environments -->
    <CopyEnvironmentsSection
      :environments="environments"
      v-model:source-env="copySourceEnv"
      v-model:target-env="copyTargetEnv"
      :environment-status="environmentStatus"
      :install-dir-set="!!settings.installationDirectory"
      :get-universe-badge-class="getUniverseBadgeClass"
      @copy="copyBetweenEnvironments"
    />

    <!-- Shader and Log Directory Tools Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Shader Directory Tools -->
      <DirectoryCard
        :title="$t('tools.shaderDir')"
        :path="settings.shaderDirectory"
        :no-path-text="$t('tools.noPathSet')"
        :delete-text="$t('tools.delete')"
        @delete="deleteDirectory('shader')"
      />

      <!-- Log Directory Tools -->
      <DirectoryCard
        :title="$t('tools.logDir')"
        :path="settings.logDirectory"
        :no-path-text="$t('tools.noPathSet')"
        :delete-text="$t('tools.delete')"
        :extra-info="logSize"
        @delete="deleteDirectory('log')"
      />
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
import {onActivated, onMounted, ref, watch} from 'vue'
import {useI18n} from "vue-i18n"
import {BaseDirectory, copyFile, exists, mkdir, readDir, readTextFile, remove, stat} from '@tauri-apps/plugin-fs'
import {dirname, homeDir, localDataDir} from '@tauri-apps/api/path'
import {ask} from '@tauri-apps/plugin-dialog'
import BackupListSection from './tools/BackupListSection.vue'
import CopyEnvironmentsSection from './tools/CopyEnvironmentsSection.vue'
import DirectoryCard from './tools/DirectoryCard.vue'

const { t: $t } = useI18n()

const settings = ref({
  userDirectory: '',
  backupDirectory: '',
  shaderDirectory: '',
  logDirectory: '',
  installationDirectory: ''
})

const environments = ['LIVE', 'PTU', 'EPTU']
const selectedEnvironment = ref('LIVE')
const environmentStatus = ref({
  LIVE: false,
  PTU: false,
  EPTU: false
})

const existingBackups = ref([])
const logSize = ref('')
const statusMessage = ref('')
const statusType = ref('info')
const isOperationInProgress = ref(false)
const copySourceEnv = ref('LIVE')
const copyTargetEnv = ref('PTU')

const SETTINGS_FILE = 'settings.json'

// Helper function to format error messages
function formatError(error) {
  return error?.message || error?.toString() || JSON.stringify(error) || 'Unknown error'
}

// Helper function to show status message
function showStatus(message, type = 'info', duration = 3000) {
  statusMessage.value = message
  statusType.value = type
  if (duration > 0) {
    setTimeout(() => { statusMessage.value = '' }, duration)
  }
}

// Watch for environment changes and update directories
watch(selectedEnvironment, (newEnv) => {
  updateDirectoriesForEnvironment(newEnv)
})

onMounted(async () => {
  await loadSettings()
  // Calculate log size only if not in test environment
  if (import.meta.env.MODE !== 'test') {
    await calculateLogSize()
    await checkEnvironmentFolders()
    await scanExistingBackups()
  }
})

// Recalculate log size every time the component is activated/shown
onActivated(async () => {
  if (import.meta.env.MODE !== 'test') {
    // Don't scan if an operation is in progress to prevent UI flicker during confirmations
    if (isOperationInProgress.value) return

    if (settings.value.logDirectory) {
      await calculateLogSize()
    }
    await checkEnvironmentFolders()
    await scanExistingBackups()
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
      // Normalize paths to use forward slashes
      const normalizedInstallDir = loadedSettings.installationDirectory ? loadedSettings.installationDirectory.replace(/\\/g, '/') : ''
      const normalizedBackupDir = loadedSettings.backupDirectory ? loadedSettings.backupDirectory.replace(/\\/g, '/') : ''
      settings.value = {
        installationDirectory: normalizedInstallDir,
        userDirectory: normalizedInstallDir ? `${normalizedInstallDir}/${selectedEnvironment.value}/user` : '',
        backupDirectory: normalizedBackupDir,
        shaderDirectory: `${localDataPath}/Star Citizen`,
        logDirectory: normalizedInstallDir ? `${normalizedInstallDir}/${selectedEnvironment.value}/logs` : ''
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

function updateDirectoriesForEnvironment(env) {
  if (settings.value.installationDirectory) {
    // Normalize path separators to forward slashes for cross-platform compatibility
    const normalizedPath = settings.value.installationDirectory.replace(/\\/g, '/')
    settings.value.userDirectory = `${normalizedPath}/${env}/user`
    settings.value.logDirectory = `${normalizedPath}/${env}/logs`

    // Recalculate log size for the new environment if not in test mode
    if (import.meta.env.MODE !== 'test') {
      calculateLogSize()
    }
  }
}

async function checkEnvironmentFolders() {
  if (!settings.value.installationDirectory) {
    // Reset all to false if no installation directory is set
    environmentStatus.value = {
      LIVE: false,
      PTU: false,
      EPTU: false
    }
    return
  }

  for (const env of environments) {
    try {
      // Normalize path separators
      const normalizedPath = settings.value.installationDirectory.replace(/\\/g, '/')
      const envPath = `${normalizedPath}/${env}`
      environmentStatus.value[env] = await exists(envPath)
    } catch {
      environmentStatus.value[env] = false
    }
  }
}

async function scanExistingBackups() {
  if (!settings.value.backupDirectory) {
    existingBackups.value = []
    return
  }

  try {
    const normalizedBackupDir = settings.value.backupDirectory.replace(/\\/g, '/')
    const backupDirExists = await exists(normalizedBackupDir)
    if (!backupDirExists) {
      existingBackups.value = []
      return
    }

    const entries = await readDir(normalizedBackupDir)
    const backups = []

    for (const entry of entries) {
      if (entry.isDirectory && entry.name.startsWith('user_')) {
        const universe = entry.name.replace('user_', '')
        if (environments.includes(universe)) {
          const backupPath = `${normalizedBackupDir}/${entry.name}`
          try {
            const stats = await stat(backupPath)
            backups.push({
              name: entry.name,
              universe: universe,
              age: formatAge(stats.mtime),
              timestamp: stats.mtime
            })
          } catch {
            // Skip if can't read stats
          }
        }
      }
    }

    // Sort by timestamp (newest first)
    backups.sort((a, b) => b.timestamp - a.timestamp)
    existingBackups.value = backups
  } catch {
    existingBackups.value = []
  }
}

function formatAge(timestamp) {
  try {
    // Convert timestamp to milliseconds if it's in seconds
    const timestampMs = timestamp > 10000000000 ? timestamp : timestamp * 1000
    const now = Date.now()
    const diffMs = now - timestampMs
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffDay > 0) {
      return diffDay === 1 ? $t('tools.oneDay') : $t('tools.daysAgo', { count: diffDay })
    } else if (diffHour > 0) {
      return diffHour === 1 ? $t('tools.oneHour') : $t('tools.hoursAgo', { count: diffHour })
    } else if (diffMin > 0) {
      return diffMin === 1 ? $t('tools.oneMinute') : $t('tools.minutesAgo', { count: diffMin })
    } else {
      return $t('tools.justNow')
    }
  } catch {
    return $t('tools.justNow')
  }
}

function getUniverseBadgeClass(universe) {
  switch (universe) {
    case 'LIVE': return 'badge-success'
    case 'PTU': return 'badge-warning'
    case 'EPTU': return 'badge-info'
    default: return 'badge-neutral'
  }
}

async function restoreFromBackup(backupName) {
  // Set operation in progress flag BEFORE confirmation to prevent UI updates
  isOperationInProgress.value = true

  try {
    const normalizedBackupDir = settings.value.backupDirectory.replace(/\\/g, '/')
    const backupPath = `${normalizedBackupDir}/${backupName}`
    const universe = backupName.replace('user_', '')

    const confirmed = await ask($t('tools.confirmRestoreFrom', { universe }), { title: $t('tools.restore'), kind: 'warning' })
    if (!confirmed) return

    statusMessage.value = $t('tools.restoring')
    statusType.value = 'info'

    const normalizedInstallDir = settings.value.installationDirectory.replace(/\\/g, '/')
    const userPath = `${normalizedInstallDir}/${universe}/user/..`
    const parentPath = await dirname(userPath)

    await copyDirectoryRecursive(backupPath, parentPath)

    statusMessage.value = $t('tools.restoreSuccess')
    statusType.value = 'success'
    setTimeout(() => { statusMessage.value = '' }, 3000)
  } catch (error) {
    const errorMsg = error?.message || error?.toString() || JSON.stringify(error) || 'Unknown error'
    statusMessage.value = $t('tools.restoreError') + ': ' + errorMsg
    statusType.value = 'error'
    setTimeout(() => { statusMessage.value = '' }, 5000)
  } finally {
    // Always clear the operation flag and refresh backup list
    isOperationInProgress.value = false
    if (import.meta.env.MODE !== 'test') {
      await scanExistingBackups()
    }
  }
}

async function deleteBackup(backupName) {
  // Set operation in progress flag BEFORE confirmation to prevent UI updates
  isOperationInProgress.value = true

  try {
    // Show confirmation FIRST before doing anything else
    const confirmed = await ask($t('tools.confirmDeleteBackup', { name: backupName }), { title: $t('tools.delete'), kind: 'warning' })
    if (!confirmed) return

    const normalizedBackupDir = settings.value.backupDirectory.replace(/\\/g, '/')
    const backupPath = `${normalizedBackupDir}/${backupName}`

    // Only set status after confirmation
    statusMessage.value = $t('tools.deleting')
    statusType.value = 'info'

    await remove(backupPath, { recursive: true })

    statusMessage.value = $t('tools.deleteSuccess')
    statusType.value = 'success'
    setTimeout(() => { statusMessage.value = '' }, 3000)
  } catch (error) {
    const errorMsg = error?.message || error?.toString() || JSON.stringify(error) || 'Unknown error'
    statusMessage.value = $t('tools.deleteError') + ': ' + errorMsg
    statusType.value = 'error'
    setTimeout(() => { statusMessage.value = '' }, 5000)
  } finally {
    // Always clear the operation flag and refresh backup list
    isOperationInProgress.value = false
    if (import.meta.env.MODE !== 'test') {
      await scanExistingBackups()
    }
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
  try {
    // Create destination directory
    await mkdir(destPath, { recursive: true })

    // Read source directory contents
    const entries = await readDir(sourcePath)

    for (const entry of entries) {
      const sourceFile = `${sourcePath}/${entry.name}`
      const destFile = `${destPath}/${entry.name}`

      if (entry.isDirectory) {
        // Recursively copy subdirectories
        await copyDirectoryRecursive(sourceFile, destFile)
      } else {
        // Copy file
        await copyFile(sourceFile, destFile)
      }
    }
  } catch (error) {
    throw error
  }
}

async function backupDirectory(type) {
  const path = getDirectoryPath(type)
  if (!path) return

  showStatus($t('tools.backingUp'), 'info', 0)

  try {
    let backupPath
    if (type === 'user') {
      // For user directory, copy to backup directory with environment-specific folder name
      const normalizedBackupDir = settings.value.backupDirectory.replace(/\\/g, '/')
      backupPath = `${normalizedBackupDir}/user_${selectedEnvironment.value}`
      if (!settings.value.backupDirectory) {
        showStatus($t('tools.backupError') + ': No backup directory set', 'error', 5000)
        return
      }
    } else {
      // For other directories, create timestamped backup
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const normalizedPath = path.replace(/\\/g, '/')
      backupPath = `${normalizedPath}_backup_${timestamp}`
    }

    // Normalize source path
    const normalizedPath = path.replace(/\\/g, '/')

    // Check if source directory exists
    const sourceExists = await exists(normalizedPath)
    if (!sourceExists) {
      showStatus($t('tools.backupError') + ': ' + $t('tools.sourceNotFound', { path: normalizedPath }), 'error', 5000)
      return
    }

    // Copy directory recursively using filesystem API
    await copyDirectoryRecursive(normalizedPath, backupPath)

    showStatus($t('tools.backupSuccess'), 'success')
  } catch (error) {
    showStatus($t('tools.backupError') + ': ' + formatError(error), 'error', 5000)
  } finally {
    // Always refresh backup list after attempting backup
    if (import.meta.env.MODE !== 'test') {
      await scanExistingBackups()
    }
  }
}

async function restoreDirectory(type) {
  const userPath = getDirectoryPath(type) + '/..';
  if (!userPath) return

  statusMessage.value = $t('tools.restoring')
  statusType.value = 'info'

  try {
    if (type === 'user') {
      // For user directory, restore from backup directory with environment-specific folder name
      const normalizedBackupDir = settings.value.backupDirectory.replace(/\\/g, '/')
      const backupPath = `${normalizedBackupDir}/user_${selectedEnvironment.value}`

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
    const errorMsg = error?.message || error?.toString() || JSON.stringify(error) || 'Unknown error'
    statusMessage.value = $t('tools.restoreError') + ': ' + errorMsg
    statusType.value = 'error'
    setTimeout(() => { statusMessage.value = '' }, 5000)
  }

  // Refresh backup list after restore
  if (import.meta.env.MODE !== 'test') {
    await scanExistingBackups()
  }
}

async function copyBetweenEnvironments() {
  if (!settings.value.installationDirectory) {
    statusMessage.value = $t('tools.copyError') + ': ' + $t('tools.noInstallDirSet')
    statusType.value = 'error'
    setTimeout(() => { statusMessage.value = '' }, 5000)
    return
  }

  if (copySourceEnv.value === copyTargetEnv.value) {
    statusMessage.value = $t('tools.copyError') + ': ' + $t('tools.sameEnvironment')
    statusType.value = 'error'
    setTimeout(() => { statusMessage.value = '' }, 5000)
    return
  }

  const normalizedInstallDir = settings.value.installationDirectory.replace(/\\/g, '/')
  const sourcePath = `${normalizedInstallDir}/${copySourceEnv.value}/user`
  const targetPath = `${normalizedInstallDir}/${copyTargetEnv.value}/user`

  try {
    // Check if source exists
    const sourceExists = await exists(sourcePath)
    if (!sourceExists) {
      statusMessage.value = $t('tools.copyError') + ': ' + $t('tools.sourceNotFound', { path: sourcePath })
      statusType.value = 'error'
      setTimeout(() => { statusMessage.value = '' }, 5000)
      return
    }

    // Ask for confirmation
    const confirmed = await ask(
      $t('tools.confirmCopy', { source: copySourceEnv.value, target: copyTargetEnv.value }),
      { title: $t('tools.copy'), kind: 'warning' }
    )
    if (!confirmed) return

    statusMessage.value = $t('tools.copying')
    statusType.value = 'info'

    // If target exists, remove it first
    const targetExists = await exists(targetPath)
    if (targetExists) {
      await remove(targetPath, { recursive: true })
    }

    // Copy from source to target
    await copyDirectoryRecursive(sourcePath, targetPath)

    statusMessage.value = $t('tools.copySuccess')
    statusType.value = 'success'
    setTimeout(() => { statusMessage.value = '' }, 3000)
  } catch (error) {
    const errorMsg = error?.message || error?.toString() || JSON.stringify(error) || 'Unknown error'
    statusMessage.value = $t('tools.copyError') + ': ' + errorMsg
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
      const entryPath = `${path}/${entry.name}`

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

  // Set operation in progress flag BEFORE confirmation to prevent UI updates
  isOperationInProgress.value = true

  try {
    // Show confirmation FIRST before doing anything else
    const confirmMessage = type === 'backup' ? $t('tools.confirmDeleteAllBackups') : $t('tools.confirmDelete')
    const confirmed = await ask(confirmMessage, { title: $t('tools.delete'), kind: 'warning' })
    if (!confirmed) return

    // Only set status after confirmation
    statusMessage.value = $t('tools.deleting')
    statusType.value = 'info'

    // Normalize path to use forward slashes
    const normalizedPath = path.replace(/\\/g, '/')

    if (type === 'backup') {
      // For backup directory, only delete the user_* folders inside, not the directory itself
      const backupDirExists = await exists(normalizedPath)
      if (backupDirExists) {
        const entries = await readDir(normalizedPath)
        for (const entry of entries) {
          if (entry.isDirectory && entry.name.startsWith('user_')) {
            const backupPath = `${normalizedPath}/${entry.name}`
            await remove(backupPath, { recursive: true })
          }
        }
      }
    } else {
      // For other directories, delete the entire directory recursively
      await remove(normalizedPath, { recursive: true })
    }

    // If deleting user directory, also delete the corresponding backup
    // if (type === 'user' && settings.value.backupDirectory) {
    //   const normalizedBackupDir = settings.value.backupDirectory.replace(/\\/g, '/')
    //   const backupPath = `${normalizedBackupDir}/user_${selectedEnvironment.value}`
    //   try {
    //     const backupExists = await exists(backupPath)
    //     if (backupExists) {
    //       await remove(backupPath, { recursive: true })
    //     }
    //   } catch (error) {
    //     console.error('Error deleting corresponding backup:', error)
    //     // Don't fail the whole operation if backup delete fails
    //   }
    // }

    statusMessage.value = $t('tools.deleteSuccess')
    statusType.value = 'success'
    setTimeout(() => { statusMessage.value = '' }, 3000)

    // Recalculate log size if log directory was deleted
    if (type === 'log' && settings.value.logDirectory) {
      await calculateLogSize()
    }
  } catch (error) {
    const errorMsg = error?.message || error?.toString() || JSON.stringify(error) || 'Unknown error'
    statusMessage.value = $t('tools.deleteError') + ': ' + errorMsg
    statusType.value = 'error'
    setTimeout(() => { statusMessage.value = '' }, 5000)
  } finally {
    // Always clear the operation flag and refresh backup list
    isOperationInProgress.value = false
    if (import.meta.env.MODE !== 'test') {
      await scanExistingBackups()
    }
  }
}
</script>

<style scoped>

</style>