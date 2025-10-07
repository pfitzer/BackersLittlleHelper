import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    app: {
      title: 'Backers Little Helper',
      home: 'Home',
      vehicles: 'Vehicles',
      commlink: 'Comm-Link',
      settings: 'Settings',
      tools: 'Tools'
    },
    common: {
      loading: 'Loading...',
      readMore: 'Read More',
      showLess: 'Show Less'
    },
    commlink: {
      title: 'Comm-Link News'
    },
    home: {
      welcome: 'A Backers Work Is Never Done!',
      description: 'Your Star Citizen companion tool',
      serverStatus: 'Server Status',
      latestNews: 'Latest News',
      readMore: 'Read More',
      viewDetails: 'View Details',
      errorLoadingNews: 'Failed to load news. Please try again later.',
      errorLoadingStatus: 'Failed to load server status.',
      statusOperational: 'Operational',
      statusDegraded: 'Degraded',
      statusDown: 'Down',
      statusUnknown: 'Unknown',
      setupRequired: 'Setup Required',
      setupMessage: 'Welcome to Backers Little Helper! To get started, please configure your directories in the settings.',
      goToSettings: 'Go to Settings',
      remindLater: 'Remind Me Later'
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
    },
    vehicles: {
      title: 'Vehicles',
      search: 'Search vehicles...',
      searchHint: 'Enter at least 3 characters to search for a vehicle',
      startSearching: 'Start typing to search for vehicles',
      noResults: 'No vehicles found',
      manufacturer: 'Manufacturer',
      type: 'Type',
      size: 'Size',
      crew: 'Crew',
      length: 'Length',
      beam: 'Beam',
      height: 'Height',
      mass: 'Mass',
      components: 'Components',
      componentType: 'Type',
      componentName: 'Name',
      componentSize: 'Size',
      componentManufacturer: 'Manufacturer',
      hardpoints: 'Hardpoints',
      hardpointName: 'Name',
      hardpointType: 'Type',
      hardpointSize: 'Size',
      shops: 'Available at Shops',
      price: 'Price',
      viewDetails: 'View Details',
      errorLoading: 'Failed to load vehicles. Please try again later.'
    }
  },
  de: {
    app: {
      title: 'Backers Little Helper',
      home: 'Startseite',
      vehicles: 'Fahrzeuge',
      commlink: 'Comm-Link',
      settings: 'Einstellungen',
      tools: 'Werkzeuge'
    },
    common: {
      loading: 'Lädt...',
      readMore: 'Weiterlesen',
      showLess: 'Weniger anzeigen'
    },
    commlink: {
      title: 'Comm-Link Nachrichten'
    },
    home: {
      welcome: 'A Backers Work Is Never Done!',
      description: 'Dein Star Citizen Begleiter-Tool',
      serverStatus: 'Serverstatus',
      latestNews: 'Neueste Nachrichten',
      readMore: 'Weiterlesen',
      viewDetails: 'Details anzeigen',
      errorLoadingNews: 'Nachrichten konnten nicht geladen werden. Bitte versuche es später erneut.',
      errorLoadingStatus: 'Serverstatus konnte nicht geladen werden.',
      statusOperational: 'Betriebsbereit',
      statusDegraded: 'Eingeschränkt',
      statusDown: 'Ausgefallen',
      statusUnknown: 'Unbekannt',
      setupRequired: 'Einrichtung erforderlich',
      setupMessage: 'Willkommen bei Backers Little Helper! Um loszulegen, konfiguriere bitte deine Verzeichnisse in den Einstellungen.',
      goToSettings: 'Zu den Einstellungen',
      remindLater: 'Später erinnern'
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
      confirmDelete: 'Bist du sicher, dass du dieses Verzeichnis löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden!'
    },
    vehicles: {
      title: 'Fahrzeuge',
      search: 'Fahrzeuge suchen...',
      searchHint: 'Gib mindestens 3 Zeichen ein, um nach einem Fahrzeug zu suchen',
      startSearching: 'Beginne mit der Eingabe, um Fahrzeuge zu suchen',
      noResults: 'Keine Fahrzeuge gefunden',
      manufacturer: 'Hersteller',
      type: 'Typ',
      size: 'Größe',
      crew: 'Besatzung',
      length: 'Länge',
      beam: 'Breite',
      height: 'Höhe',
      mass: 'Masse',
      components: 'Komponenten',
      componentType: 'Typ',
      componentName: 'Name',
      componentSize: 'Größe',
      componentManufacturer: 'Hersteller',
      hardpoints: 'Hardpoints',
      hardpointName: 'Name',
      hardpointType: 'Typ',
      hardpointSize: 'Größe',
      shops: 'Verfügbar in Geschäften',
      price: 'Preis',
      viewDetails: 'Details anzeigen',
      errorLoading: 'Fahrzeuge konnten nicht geladen werden. Bitte versuche es später erneut.'
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