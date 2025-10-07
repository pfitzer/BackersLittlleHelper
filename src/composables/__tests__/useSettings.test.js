import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSettings } from '../useSettings'

// Mock the Tauri filesystem plugin
vi.mock('@tauri-apps/plugin-fs', () => ({
  BaseDirectory: {
    AppData: 'AppData'
  },
  exists: vi.fn()
}))

import { exists } from '@tauri-apps/plugin-fs'

describe('useSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with correct default values', () => {
    const { settingsExist, loading } = useSettings()

    expect(settingsExist.value).toBe(false)
    expect(loading.value).toBe(true)
  })

  it('checks if settings file exists successfully', async () => {
    exists.mockResolvedValue(true)

    const { settingsExist, loading, checkSettingsExist } = useSettings()

    await checkSettingsExist()

    expect(exists).toHaveBeenCalledWith('settings.json', { baseDir: 'AppData' })
    expect(settingsExist.value).toBe(true)
    expect(loading.value).toBe(false)
  })

  it('handles settings file not existing', async () => {
    exists.mockResolvedValue(false)

    const { settingsExist, loading, checkSettingsExist } = useSettings()

    await checkSettingsExist()

    expect(exists).toHaveBeenCalledWith('settings.json', { baseDir: 'AppData' })
    expect(settingsExist.value).toBe(false)
    expect(loading.value).toBe(false)
  })

  it('handles errors when checking settings existence', async () => {
    exists.mockRejectedValue(new Error('File system error'))

    const { settingsExist, loading, checkSettingsExist } = useSettings()

    await checkSettingsExist()

    expect(settingsExist.value).toBe(false)
    expect(loading.value).toBe(false)
  })

  it('sets loading to true during check and false after', async () => {
    let resolveExists
    const existsPromise = new Promise((resolve) => {
      resolveExists = resolve
    })
    exists.mockReturnValue(existsPromise)

    const { loading, checkSettingsExist } = useSettings()

    expect(loading.value).toBe(true)

    const checkPromise = checkSettingsExist()
    expect(loading.value).toBe(true)

    resolveExists(true)
    await checkPromise

    expect(loading.value).toBe(false)
  })
})