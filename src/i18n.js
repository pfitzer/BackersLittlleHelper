import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    app: {
      title: 'Backers Little Helper',
      home: 'Home',
      settings: 'Settings',
      tools: 'Tools'
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
      backupDir: 'Backup Directory',
      shaderDir: 'Shader Directory',
      browse: 'Browse',
      appearance: 'Appearance',
      theme: 'Theme',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeNight: 'Night',
      advanced: 'Advanced',
      enableNotifications: 'Enable Notifications',
      autoStart: 'Start on System Startup',
      resetDefaults: 'Reset to Defaults',
      saveSettings: 'Save Settings',
      savedSuccessfully: 'Settings saved successfully!',
      errorSaving: 'Error saving settings'
    },
    tools: {
      title: 'Tools',
      installationDir: 'Installation Directory',
      userDir: 'User Directory',
      backupDir: 'Backup Directory',
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
      confirmDelete: 'Are you sure you want to delete this directory? This action cannot be undone!'
    }
  },
  de: {
    app: {
      title: 'Backers Little Helper',
      home: 'Startseite',
      settings: 'Einstellungen',
      tools: 'Werkzeuge'
    },
    home: {
      welcome: 'Willkommen zu Backers Little Helper',
      description: 'Ein paar einfache Tools um die das Verwalten von Star Citizen zu vereinfachen',
      greet: 'Grüßen'
    },
    settings: {
      title: 'Einstellungen',
      directories: 'Verzeichnisse',
      installationDir: 'Installationsverzeichnis',
      backupDir: 'Sicherungsverzeichnis',
      shaderDir: 'Shader-Verzeichnis',
      browse: 'Durchsuchen',
      appearance: 'Aussehen',
      theme: 'Design',
      themeLight: 'Hell',
      themeDark: 'Dunkel',
      themeNight: 'Nacht',
      advanced: 'Erweitert',
      enableNotifications: 'Benachrichtigungen aktivieren',
      autoStart: 'Beim Systemstart starten',
      resetDefaults: 'Auf Standardwerte zurücksetzen',
      saveSettings: 'Einstellungen speichern',
      savedSuccessfully: 'Einstellungen erfolgreich gespeichert!',
      errorSaving: 'Fehler beim Speichern der Einstellungen'
    },
    tools: {
      title: 'Werkzeuge',
      installationDir: 'Installationsverzeichnis',
      userDir: 'Benutzerverzeichnis',
      backupDir: 'Sicherungsverzeichnis',
      shaderDir: 'Shader-Verzeichnis',
      logDir: 'Log-Verzeichnis',
      noPathSet: 'Kein Pfad konfiguriert',
      backup: 'Sichern',
      restore: 'Wiederherstellen',
      delete: 'Löschen',
      backingUp: 'Erstelle Sicherung...',
      backupSuccess: 'Sicherung erfolgreich erstellt!',
      backupError: 'Fehler beim Erstellen der Sicherung',
      restoring: 'Stelle wieder her...',
      restoreSuccess: 'Erfolgreich wiederhergestellt!',
      restoreError: 'Fehler beim Wiederherstellen',
      restoreNotImplemented: 'Wiederherstellungsfunktion kommt bald',
      deleting: 'Lösche Verzeichnis...',
      deleteSuccess: 'Verzeichnis erfolgreich gelöscht!',
      deleteError: 'Fehler beim Löschen des Verzeichnisses',
      confirmDelete: 'Sind Sie sicher, dass Sie dieses Verzeichnis löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden!'
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