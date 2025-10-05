# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.1.1]: https://github.com/pfitzer/BackersLittlleHelper/releases/tag/v0.1.1
[0.1.0]: https://github.com/pfitzer/BackersLittlleHelper/releases/tag/v0.1.0