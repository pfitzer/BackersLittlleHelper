# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.1] - 2025-10-16

### Added
- **API Caching System**: Implemented comprehensive caching for API requests
  - Vehicles data cached for 30 days to reduce API load
  - Comm-Links data cached for 1 hour for fresh content
  - Comprehensive test suite for API caching functionality
- **Enhanced Comm-Links**:
  - Added images to Comm-Links display
  - HTML encoding for Comm-Link titles for proper rendering
- **Vehicle Details**: Additional ship data from the API displayed in vehicle view

### Changed
- Enhanced vehicle details view with improved data presentation
- Updated internationalization (i18n) translations for new features
- RSI-inspired CSS styles applied to vehicle cards
- Updated all existing tests to accommodate new caching functionality

### Fixed
- **API Cache Bug**: Fixed parameter order bug in API cache implementation
- **File System Permissions**: Corrected Tauri 2.0 file system permissions
  - Restructured fs permissions to use proper Tauri 2.0 format
  - Added fs:scope with $APPDATA/** for proper app data directory access
  - Settings.json now properly accessible in AppData folder
- **Background Image**: Fixed case sensitivity error preventing background image loading

## [0.2.0] - 2025-10-07

### Added
- **RSI-Inspired UI Theme**: Complete visual overhaul to match Roberts Space Industries website aesthetic
  - Custom blue-glowing button and card effects with smooth transitions
  - Sharp corners throughout the interface (no rounded borders)
  - Noise texture overlay for authentic space-themed atmosphere
  - Radial gradient backgrounds with atmospheric depth
  - Custom corner decorations on cards using CSS pseudo-elements
- **Vehicle Database**: New comprehensive vehicle search and information system
  - Live search integration with Star Citizen Wiki API
  - Detailed vehicle specifications (manufacturer, type, size, crew, dimensions, mass)
  - Shop availability and pricing information
  - Multilingual support (English/German)
  - Unit tests with 100% pass rate
- **Screenshots Documentation**: Added 4 high-quality screenshots to docs folder showcasing all features
- **Enhanced Tools Page**: Automatic log folder size calculation that updates when navigating to page
- **Tauri Permissions**: Added fs:allow-stat capability for file size operations

### Changed
- **UI Framework**: Replaced DaisyUI Synthwave theme with custom RSI-inspired Tailwind CSS theme
- **Theme System**: Removed theme selection feature (now uses fixed RSI theme)
- **Style Consistency**: All buttons, form fields, badges, and cards now use sharp corners
- **README**: Comprehensive update with screenshots, accurate feature list, and current technologies
- **Test Coverage**: Updated all 40 tests to reflect UI changes (100% pass rate maintained)

### Removed
- **Settings**: Removed non-functional features that were placeholders:
  - Theme selection dropdown (Light/Dark/Night)
  - Enable Notifications toggle
  - Auto-start on system startup toggle
  - Appearance and Advanced settings sections
- **Debug Code**: Removed all console.log statements from production code
  - Cleaned up Tools.vue directory size calculation
  - Removed debug logging from Settings.vue

### Fixed
- **Horizontal Scrollbar**: Resolved overflow issue on server status card in Home component
- **Log Size Calculation**: Fixed permission error preventing file size calculation in Tools
- **Settings Filtering**: Old deprecated settings (theme, notifications, autoStart) now filtered on load

## [0.1.1] - 2025-10-05

### Added
- GitHub Actions workflow for automated Windows release builds triggered by git tags
- ESLint configuration for consistent code quality enforcement
- CONTRIBUTING.md with comprehensive contribution guidelines
- Dynamic font sizing based on window size for better responsiveness
- Home dashboard with latest Comm-Links from Star Citizen Wiki API
- Live RSI Server Status from official XML feed
- Beautiful gradient UI with space-themed background
- Responsive layout that fits content to Tauri window without scrolling

### Changed
- Renamed application from "Backers Little Helper 2" to "Backers Little Helper"
- Updated application identifier from `com.backerslittlehelper2.app` to `com.backerslittlehelper.app`
- Updated package name from `backers-little-helper2` to `backers-little-helper`
- Improved error handling consistency across all components
- Refined HTML font scaling using CSS clamp() and viewport units
- Updated README with linting instructions, expanded file structure, and feature documentation

### Removed
- Excessive debugging console.log statements from production code
- Unused `appDataDir` references in Settings.vue and Tools.vue

### Fixed
- Tauri build configuration to correctly locate frontend dist directory
- CORS issues by using Tauri HTTP plugin for external API requests

## [0.1.0] - 2025-10-04

### Added
- Initial Tauri 2 + Vue 3 implementation replacing Electron
- Multi-language support (English and German) with automatic OS language detection
- Settings Management:
  - Installation Directory configuration
  - Backup Directory configuration
  - Theme selection (Light, Dark, Night)
  - Notifications toggle
  - Auto-start on system startup
- Tools & Directory Management:
  - Backup Directory: Delete backup contents
  - User Directory: Backup, restore, and delete user data
  - Shader Directory: Delete shader cache
  - Log Directory: Delete logs with automatic size calculation
- DaisyUI Synthwave theme integration
- Tailwind CSS for styling
- Vitest testing framework with initial test suite
- GitHub Actions workflow for automated testing
- Test coverage for Settings, Home, and Tools components

### Changed
- Migrated from Electron to Tauri 2 for better performance and smaller bundle size
- Replaced custom CSS with Tailwind CSS and DaisyUI
- Updated development port from 5173 to 5175

### Removed
- Electron dependencies and configuration
- Old Soft UI Dashboard theme
- Unused `greet` functionality
- Ship search and details features (legacy from v1)

## [Legacy] - Pre-Tauri Migration

### Historical Changes
- Initial Electron-based implementation
- Ship search and pricing features
- Basic settings and tools functionality
- Security updates via Dependabot (Electron 24.3.0 → 35.7.5)

[0.4.1]: https://github.com/pfitzer/BackersLittlleHelper/releases/tag/v0.4.1
[0.2.0]: https://github.com/pfitzer/BackersLittlleHelper/releases/tag/v0.2.0
[0.1.1]: https://github.com/pfitzer/BackersLittlleHelper/releases/tag/v0.1.1
[0.1.0]: https://github.com/pfitzer/BackersLittlleHelper/releases/tag/v0.1.0