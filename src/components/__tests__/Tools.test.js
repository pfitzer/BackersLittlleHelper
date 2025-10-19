import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Tools from '../Tools.vue'
import { createI18n } from 'vue-i18n'

// Mock Tauri APIs
vi.mock('@tauri-apps/plugin-fs', () => ({
  BaseDirectory: { AppData: 'AppData' },
  writeTextFile: vi.fn(),
  readTextFile: vi.fn(),
  exists: vi.fn(),
  mkdir: vi.fn(),
  copyFile: vi.fn(),
  readDir: vi.fn(),
  remove: vi.fn(),
  stat: vi.fn()
}))

vi.mock('@tauri-apps/api/path', () => ({
  homeDir: vi.fn(),
  dirname: vi.fn(),
  localDataDir: vi.fn()
}))

vi.mock('@tauri-apps/plugin-dialog', () => ({
  ask: vi.fn()
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      tools: {
        title: 'Tools',
        backupDir: 'Backup Directory',
        userDir: 'User Directory',
        shaderDir: 'Shader Directory',
        logDir: 'Log Directory',
        noPathSet: 'No path configured',
        backup: 'Backup',
        restore: 'Restore',
        delete: 'Delete',
        backingUp: 'Creating backup...',
        backupSuccess: 'Backup created successfully!',
        backupError: 'Error creating backup',
        restoring: 'Restoring from backup...',
        restoreSuccess: 'Restored successfully!',
        restoreError: 'Error restoring',
        restoreNotImplemented: 'Restore feature coming soon',
        deleting: 'Deleting directory...',
        deleteSuccess: 'Directory deleted successfully!',
        deleteError: 'Error deleting directory',
        confirmDelete: 'Are you sure you want to delete this directory?',
        confirmDeleteAllBackups: 'Are you sure you want to delete all backups?',
        environmentFolders: 'Game Universe',
        folderExists: 'Installed',
        folderMissing: 'Not installed',
        selectEnvironment: 'Choose Universe'
      }
    }
  }
})

describe('Tools.vue', () => {
  beforeEach(async () => {
    vi.clearAllMocks()

    // Set up default mocks for all tests to prevent infinite loops in calculateDirectorySize
    const { exists, readDir, stat, readTextFile } = await import('@tauri-apps/plugin-fs')
    const { homeDir, localDataDir } = await import('@tauri-apps/api/path')

    exists.mockResolvedValue(false) // By default, directories don't exist
    readDir.mockResolvedValue([]) // By default, return empty array
    stat.mockResolvedValue({ size: 0 }) // By default, files have 0 size
    readTextFile.mockResolvedValue(JSON.stringify({})) // By default, empty settings
    homeDir.mockResolvedValue('C:\\Users\\test')
    localDataDir.mockResolvedValue('C:\\Users\\test\\AppData\\Local\\')
  })

  it('renders tools page with title', () => {
    const wrapper = mount(Tools, {
      global: {
        plugins: [i18n]
      }
    })
    expect(wrapper.find('h2').text()).toBe('Tools')
  })

  it('renders backup directory section', () => {
    const wrapper = mount(Tools, {
      global: {
        plugins: [i18n]
      }
    })
    expect(wrapper.text()).toContain('Backup Directory')
  })

  it('renders user directory section', () => {
    const wrapper = mount(Tools, {
      global: {
        plugins: [i18n]
      }
    })
    expect(wrapper.text()).toContain('User Directory')
  })

  it('loads settings on mount', async () => {
    const { exists, readTextFile } = await import('@tauri-apps/plugin-fs')
    const { homeDir, localDataDir } = await import('@tauri-apps/api/path')

    exists.mockResolvedValue(true)
    readTextFile.mockResolvedValue(JSON.stringify({
      installationDirectory: 'C:\\test\\install',
      backupDirectory: 'C:\\test\\backup'
    }))
    homeDir.mockResolvedValue('C:\\Users\\test')
    localDataDir.mockResolvedValue('C:\\Users\\test\\AppData\\Local\\')

    const wrapper = mount(Tools, {
      global: {
        plugins: [i18n]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.settings.userDirectory).toBe('C:/test/install/LIVE/user')
    expect(wrapper.vm.settings.backupDirectory).toBe('C:/test/backup')
  })

  it('uses default backup directory when not set', async () => {
    const { exists, readTextFile } = await import('@tauri-apps/plugin-fs')
    const { homeDir, localDataDir } = await import('@tauri-apps/api/path')

    exists.mockResolvedValue(true)
    readTextFile.mockResolvedValue(JSON.stringify({
      installationDirectory: 'C:\\test\\install'
    }))
    homeDir.mockResolvedValue('C:\\Users\\test')
    localDataDir.mockResolvedValue('C:\\Users\\test\\AppData\\Local\\')

    const wrapper = mount(Tools, {
      global: {
        plugins: [i18n]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.settings.backupDirectory).toBe('C:\\Users\\test')
  })

  it('performs backup operation', async () => {
    const { exists, readTextFile, mkdir, readDir, copyFile } = await import('@tauri-apps/plugin-fs')
    const { homeDir, localDataDir } = await import('@tauri-apps/api/path')

    exists.mockResolvedValue(true)
    readTextFile.mockResolvedValue(JSON.stringify({
      installationDirectory: 'C:\\test\\install',
      backupDirectory: 'C:\\test\\backup'
    }))
    homeDir.mockResolvedValue('C:\\Users\\test')
    localDataDir.mockResolvedValue('C:\\Users\\test\\AppData\\Local\\')
    // Mock readDir to return empty array for subdirectories to prevent infinite recursion
    readDir.mockImplementation((path) => {
      if (path.includes('folder1')) {
        return Promise.resolve([])
      }
      return Promise.resolve([
        { name: 'file1.txt', isDirectory: false },
        { name: 'folder1', isDirectory: true }
      ])
    })
    mkdir.mockResolvedValue()
    copyFile.mockResolvedValue()

    const wrapper = mount(Tools, {
      global: {
        plugins: [i18n]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    await wrapper.vm.backupDirectory('user')

    expect(mkdir).toHaveBeenCalled()
    expect(wrapper.vm.statusMessage).toBe('Backup created successfully!')
    expect(wrapper.vm.statusType).toBe('success')
  })

  it('shows error when backup directory not set', async () => {
    const { exists, readTextFile } = await import('@tauri-apps/plugin-fs')
    const { homeDir, localDataDir } = await import('@tauri-apps/api/path')

    exists.mockResolvedValue(true)
    readTextFile.mockResolvedValue(JSON.stringify({
      installationDirectory: 'C:\\test\\install'
    }))
    homeDir.mockResolvedValue('')
    localDataDir.mockResolvedValue('C:\\Users\\test\\AppData\\Local\\')

    const wrapper = mount(Tools, {
      global: {
        plugins: [i18n]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    wrapper.vm.settings.backupDirectory = ''
    await wrapper.vm.backupDirectory('user')

    expect(wrapper.vm.statusType).toBe('error')
    expect(wrapper.vm.statusMessage).toContain('No backup directory set')
  })

  it('performs restore operation', async () => {
    const { exists, readTextFile, mkdir, readDir, copyFile } = await import('@tauri-apps/plugin-fs')
    const { homeDir, dirname, localDataDir } = await import('@tauri-apps/api/path')

    exists.mockResolvedValue(true)
    readTextFile.mockResolvedValue(JSON.stringify({
      installationDirectory: 'C:\\test\\install',
      backupDirectory: 'C:\\test\\backup'
    }))
    homeDir.mockResolvedValue('C:\\Users\\test')
    localDataDir.mockResolvedValue('C:\\Users\\test\\AppData\\Local\\')
    dirname.mockResolvedValue('C:\\test\\install\\LIVE')
    readDir.mockResolvedValue([
      { name: 'file1.txt', isDirectory: false }
    ])
    mkdir.mockResolvedValue()
    copyFile.mockResolvedValue()

    const wrapper = mount(Tools, {
      global: {
        plugins: [i18n]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    await wrapper.vm.restoreDirectory('user')

    expect(dirname).toHaveBeenCalled()
    expect(wrapper.vm.statusMessage).toBe('Restored successfully!')
    expect(wrapper.vm.statusType).toBe('success')
  })

  it('shows error when restore backup not found', async () => {
    const { exists, readTextFile } = await import('@tauri-apps/plugin-fs')
    const { homeDir, localDataDir } = await import('@tauri-apps/api/path')

    exists.mockResolvedValueOnce(true) // settings file exists
      .mockResolvedValueOnce(false) // backup doesn't exist
    readTextFile.mockResolvedValue(JSON.stringify({
      installationDirectory: 'C:\\test\\install',
      backupDirectory: 'C:\\test\\backup'
    }))
    homeDir.mockResolvedValue('C:\\Users\\test')
    localDataDir.mockResolvedValue('C:\\Users\\test\\AppData\\Local\\')

    const wrapper = mount(Tools, {
      global: {
        plugins: [i18n]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    await wrapper.vm.restoreDirectory('user')

    expect(wrapper.vm.statusType).toBe('error')
    expect(wrapper.vm.statusMessage).toContain('No backup found')
  })

  it('deletes backup directory completely', async () => {
    const { exists, readTextFile, remove, readDir } = await import('@tauri-apps/plugin-fs')
    const { homeDir, localDataDir } = await import('@tauri-apps/api/path')
    const { ask } = await import('@tauri-apps/plugin-dialog')

    exists.mockResolvedValue(true)
    readTextFile.mockResolvedValue(JSON.stringify({
      installationDirectory: 'C:\\test\\install',
      backupDirectory: 'C:\\test\\backup'
    }))
    homeDir.mockResolvedValue('C:\\Users\\test')
    localDataDir.mockResolvedValue('C:\\Users\\test\\AppData\\Local\\')
    remove.mockResolvedValue()

    // Mock readDir to return some backup folders
    readDir.mockResolvedValue([
      { name: 'user_LIVE', isDirectory: true },
      { name: 'user_PTU', isDirectory: true },
      { name: 'otherfile.txt', isDirectory: false }
    ])

    // Mock Tauri ask dialog to return true
    ask.mockResolvedValue(true)

    const wrapper = mount(Tools, {
      global: {
        plugins: [i18n]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    await wrapper.vm.deleteDirectory('backup')

    // Should delete only user_* folders, not the whole directory
    expect(remove).toHaveBeenCalledWith('C:/test/backup/user_LIVE', { recursive: true })
    expect(remove).toHaveBeenCalledWith('C:/test/backup/user_PTU', { recursive: true })
    expect(remove).not.toHaveBeenCalledWith('C:/test/backup', { recursive: true })
    expect(wrapper.vm.statusMessage).toBe('Directory deleted successfully!')
    expect(wrapper.vm.statusType).toBe('success')
  })

  it('deletes user directory completely', async () => {
    const { exists, readTextFile, remove } = await import('@tauri-apps/plugin-fs')
    const { homeDir, localDataDir } = await import('@tauri-apps/api/path')
    const { ask } = await import('@tauri-apps/plugin-dialog')

    exists.mockResolvedValue(true)
    readTextFile.mockResolvedValue(JSON.stringify({
      installationDirectory: 'C:\\test\\install',
      backupDirectory: 'C:\\test\\backup'
    }))
    homeDir.mockResolvedValue('C:\\Users\\test')
    localDataDir.mockResolvedValue('C:\\Users\\test\\AppData\\Local\\')
    remove.mockResolvedValue()

    // Mock Tauri ask dialog to return true
    ask.mockResolvedValue(true)

    const wrapper = mount(Tools, {
      global: {
        plugins: [i18n]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    await wrapper.vm.deleteDirectory('user')

    expect(remove).toHaveBeenCalledWith('C:/test/install/LIVE/user', { recursive: true })
    expect(wrapper.vm.statusMessage).toBe('Directory deleted successfully!')
    expect(wrapper.vm.statusType).toBe('success')
  })

  it('cancels delete when confirmation is rejected', async () => {
    const { exists, readTextFile, remove } = await import('@tauri-apps/plugin-fs')
    const { homeDir, localDataDir } = await import('@tauri-apps/api/path')
    const { ask } = await import('@tauri-apps/plugin-dialog')

    exists.mockResolvedValue(true)
    readTextFile.mockResolvedValue(JSON.stringify({
      installationDirectory: 'C:\\test\\install',
      backupDirectory: 'C:\\test\\backup'
    }))
    homeDir.mockResolvedValue('C:\\Users\\test')
    localDataDir.mockResolvedValue('C:\\Users\\test\\AppData\\Local\\')
    remove.mockResolvedValue()

    // Mock Tauri ask dialog to return false
    ask.mockResolvedValue(false)

    const wrapper = mount(Tools, {
      global: {
        plugins: [i18n]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    await wrapper.vm.deleteDirectory('user')

    expect(remove).not.toHaveBeenCalled()
    expect(wrapper.vm.statusMessage).toBe('')
  })

  it('displays status messages in UI', async () => {
    const wrapper = mount(Tools, {
      global: {
        plugins: [i18n]
      }
    })

    wrapper.vm.statusMessage = 'Test message'
    wrapper.vm.statusType = 'success'
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.alert-success').exists()).toBe(true)
    expect(wrapper.find('.alert-success').text()).toContain('Test message')
  })

  it('shows different alert types based on status', async () => {
    const wrapper = mount(Tools, {
      global: {
        plugins: [i18n]
      }
    })

    // Test error status
    wrapper.vm.statusMessage = 'Error message'
    wrapper.vm.statusType = 'error'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.alert-error').exists()).toBe(true)

    // Test info status
    wrapper.vm.statusMessage = 'Info message'
    wrapper.vm.statusType = 'info'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.alert-info').exists()).toBe(true)
  })
})