import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    app: {
      title: 'Backers Little Helper 2',
      home: 'Home',
      settings: 'Settings'
    },
    home: {
      welcome: 'Welcome to Tauri + Vue!',
      description: 'Click the button below to invoke a Tauri command',
      greet: 'Greet'
    },
    settings: {
      title: 'Settings',
      directories: 'Directories',
      installationDir: 'Installation Directory',
      userDir: 'User Directory',
      shaderDir: 'Shader Directory',
      browse: 'Browse',
      appearance: 'Appearance',
      theme: 'Theme',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeAuto: 'Auto',
      advanced: 'Advanced',
      enableNotifications: 'Enable Notifications',
      autoStart: 'Start on System Startup',
      resetDefaults: 'Reset to Defaults',
      saveSettings: 'Save Settings',
      savedSuccessfully: 'Settings saved successfully!',
      errorSaving: 'Error saving settings'
    }
  },
  de: {
    app: {
      title: 'Backers Little Helper 2',
      home: 'Startseite',
      settings: 'Einstellungen'
    },
    home: {
      welcome: 'Willkommen zu Tauri + Vue!',
      description: 'Klicken Sie auf die Schaltfläche unten, um einen Tauri-Befehl aufzurufen',
      greet: 'Grüßen'
    },
    settings: {
      title: 'Einstellungen',
      directories: 'Verzeichnisse',
      installationDir: 'Installationsverzeichnis',
      userDir: 'Benutzerverzeichnis',
      shaderDir: 'Shader-Verzeichnis',
      browse: 'Durchsuchen',
      appearance: 'Aussehen',
      theme: 'Design',
      themeLight: 'Hell',
      themeDark: 'Dunkel',
      themeAuto: 'Automatisch',
      advanced: 'Erweitert',
      enableNotifications: 'Benachrichtigungen aktivieren',
      autoStart: 'Beim Systemstart starten',
      resetDefaults: 'Auf Standardwerte zurücksetzen',
      saveSettings: 'Einstellungen speichern',
      savedSuccessfully: 'Einstellungen erfolgreich gespeichert!',
      errorSaving: 'Fehler beim Speichern der Einstellungen'
    }
  }
}

// Detect OS locale
const getDefaultLocale = () => {
  const browserLocale = navigator.language.toLowerCase()
  if (browserLocale.startsWith('de')) {
    return 'de'
  }
  return 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages
})

export default i18n