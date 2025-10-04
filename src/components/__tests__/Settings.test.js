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
        backupDir: 'Backup Directory',
        browse: 'Browse',
        appearance: 'Appearance',
        theme: 'Theme',
        themeLight: 'Light',
        themeDark: 'Dark',
        themeNight: 'Night',
        advanced: 'Advanced',
        enableNotifications: 'Enable Notifications',
        autoStart: 'Auto Start',
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

  it('renders theme selector', () => {
    const wrapper = mount(Settings, {
      global: {
        plugins: [i18n]
      }
    })
    const themeSelect = wrapper.find('#theme')
    expect(themeSelect.exists()).toBe(true)
    const options = themeSelect.findAll('option')
    expect(options).toHaveLength(3)
    expect(options[0].text()).toBe('Light')
    expect(options[1].text()).toBe('Dark')
    expect(options[2].text()).toBe('Night')
  })

  it('renders notification and auto-start checkboxes', () => {
    const wrapper = mount(Settings, {
      global: {
        plugins: [i18n]
      }
    })
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    expect(checkboxes).toHaveLength(2)
  })

  it('loads settings on mount', async () => {
    const { exists, readTextFile } = await import('@tauri-apps/plugin-fs')
    exists.mockResolvedValue(true)
    readTextFile.mockResolvedValue(JSON.stringify({
      installationDirectory: '/test/install',
      userDirectory: '/test/user',
      shaderDirectory: '/test/shader',
      theme: 'light',
      enableNotifications: false,
      autoStart: true
    }))

    const wrapper = mount(Settings, {
      global: {
        plugins: [i18n]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.settings.installationDirectory).toBe('/test/install')
    expect(wrapper.vm.settings.theme).toBe('light')
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
    const wrapper = mount(Settings, {
      global: {
        plugins: [i18n]
      }
    })

    wrapper.vm.settings.theme = 'light'
    wrapper.vm.settings.installationDirectory = '/custom/path'

    await wrapper.vm.resetSettings()

    expect(wrapper.vm.settings.theme).toBe('dark')
    expect(wrapper.vm.settings.installationDirectory).toBe('')
  })

  it('opens directory picker when browse button is clicked', async () => {
    const { open } = await import('@tauri-apps/plugin-dialog')
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

  it('updates theme when theme select changes', async () => {
    const wrapper = mount(Settings, {
      global: {
        plugins: [i18n]
      }
    })

    const themeSelect = wrapper.find('#theme')
    await themeSelect.setValue('light')

    expect(wrapper.vm.settings.theme).toBe('light')
  })

  it('updates checkbox values when toggled', async () => {
    const { exists } = await import('@tauri-apps/plugin-fs')
    exists.mockResolvedValue(false)

    const wrapper = mount(Settings, {
      global: {
        plugins: [i18n]
      }
    })

    // Wait for loadSettings to complete
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    const notificationCheckbox = checkboxes[0]
    const autoStartCheckbox = checkboxes[1]

    expect(wrapper.vm.settings.enableNotifications).toBe(true)
    await notificationCheckbox.setValue(false)
    expect(wrapper.vm.settings.enableNotifications).toBe(false)

    expect(wrapper.vm.settings.autoStart).toBe(false)
    await autoStartCheckbox.setValue(true)
    expect(wrapper.vm.settings.autoStart).toBe(true)
  })
})