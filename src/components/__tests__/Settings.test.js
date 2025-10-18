import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Settings from '../Settings.vue'
import { createI18n } from 'vue-i18n'

// Mock Tauri APIs
vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: vi.fn()
}))

vi.mock('@tauri-apps/plugin-fs', () => ({
  BaseDirectory: { AppData: 'AppData' },
  writeTextFile: vi.fn(),
  readTextFile: vi.fn(),
  exists: vi.fn(),
  mkdir: vi.fn()
}))

vi.mock('@tauri-apps/api/path', () => ({
  homeDir: vi.fn(),
  appDataDir: vi.fn()
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      settings: {
        title: 'Settings',
        directories: 'Directories',
        installationDir: 'Installation Directory',
        installationDirHint: 'On Windows, this path is usually C:\\Program Files\\Roberts Space Industries\\StarCitizen',
        backupDir: 'Backup Directory',
        browse: 'Browse',
        resetDefaults: 'Reset to Defaults',
        saveSettings: 'Save Settings',
        savedSuccessfully: 'Settings saved successfully',
        errorSaving: 'Error saving settings'
      }
    }
  }
})

describe('Settings.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders settings page with title', () => {
    const wrapper = mount(Settings, {
      global: {
        plugins: [i18n]
      }
    })
    expect(wrapper.find('h2').text()).toBe('Settings')
  })

  it('renders all directory inputs', () => {
    const wrapper = mount(Settings, {
      global: {
        plugins: [i18n]
      }
    })
    expect(wrapper.find('#installation-dir').exists()).toBe(true)
    expect(wrapper.find('#backup-dir').exists()).toBe(true)
  })

  it('loads settings on mount', async () => {
    const { exists, readTextFile } = await import('@tauri-apps/plugin-fs')
    const { homeDir } = await import('@tauri-apps/api/path')
    homeDir.mockResolvedValue('/home/user')
    exists.mockResolvedValue(true)
    readTextFile.mockResolvedValue(JSON.stringify({
      installationDirectory: '/test/install',
      backupDirectory: '/test/backup'
    }))

    const wrapper = mount(Settings, {
      global: {
        plugins: [i18n]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.settings.installationDirectory).toBe('/test/install')
    expect(wrapper.vm.settings.backupDirectory).toBe('/test/backup')
  })

  it('saves settings when save button is clicked', async () => {
    const { writeTextFile, mkdir } = await import('@tauri-apps/plugin-fs')
    mkdir.mockResolvedValue()
    writeTextFile.mockResolvedValue()

    const wrapper = mount(Settings, {
      global: {
        plugins: [i18n]
      }
    })

    const saveButtons = wrapper.findAll('button.btn-primary')
    // Find the save button (not the browse buttons)
    const saveButton = saveButtons.find(btn => btn.text().includes('Save'))
    await saveButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(writeTextFile).toHaveBeenCalled()
  })

  it('resets settings to defaults', async () => {
    const { writeTextFile, mkdir } = await import('@tauri-apps/plugin-fs')
    mkdir.mockResolvedValue()
    writeTextFile.mockResolvedValue()

    const wrapper = mount(Settings, {
      global: {
        plugins: [i18n]
      }
    })

    wrapper.vm.settings.installationDirectory = '/custom/path'
    wrapper.vm.settings.backupDirectory = '/custom/backup'

    await wrapper.vm.resetSettings()

    expect(wrapper.vm.settings.installationDirectory).toBe('')
    expect(wrapper.vm.settings.backupDirectory).toBe('')
  })

  it('opens directory picker when browse button is clicked', async () => {
    const { open } = await import('@tauri-apps/plugin-dialog')
    const { homeDir } = await import('@tauri-apps/api/path')
    homeDir.mockResolvedValue('/home/user')
    open.mockResolvedValue('/selected/path')

    const wrapper = mount(Settings, {
      global: {
        plugins: [i18n]
      }
    })

    const browseButtons = wrapper.findAll('button.btn-primary.join-item')
    await browseButtons[0].trigger('click')
    await wrapper.vm.$nextTick()

    expect(open).toHaveBeenCalledWith({
      directory: true,
      multiple: false,
      defaultPath: expect.any(String),
      title: expect.stringContaining('installation')
    })
  })

  it('displays save message after successful save', async () => {
    const { writeTextFile, mkdir } = await import('@tauri-apps/plugin-fs')
    mkdir.mockResolvedValue()
    writeTextFile.mockResolvedValue()

    const wrapper = mount(Settings, {
      global: {
        plugins: [i18n]
      }
    })

    await wrapper.vm.saveSettings()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.saveMessage).toBe('Settings saved successfully')
    expect(wrapper.find('.alert-success').exists()).toBe(true)
  })
})