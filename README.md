# Backers Little Helper

[![Run Tests](https://github.com/pfitzer/BackersLittlleHelper/actions/workflows/test.yml/badge.svg)](https://github.com/pfitzer/BackersLittlleHelper/actions/workflows/test.yml)

A desktop application built with Tauri 2 and Vue.js for managing Star Citizen game configurations and settings.

## Features

- **Home Dashboard**:
  - Latest Comm-Links from Star Citizen Wiki API
  - Live RSI Server Status from official status feed
  - Beautiful gradient UI with space-themed background
- **Vehicle Database**:
  - Search Star Citizen vehicles with live API integration
  - View detailed vehicle specifications (manufacturer, type, size, crew, dimensions, mass)
  - Browse available shops and pricing information
  - Multilingual support (English/German)
- **Application Menu**:
  - Quick launch Star Citizen from configured installation directory
  - GitHub repository access
  - About dialog with copyright information
- **Multi-language Support**: Automatically detects OS language (English and German supported)
- **Settings Management**:
  - Installation Directory configuration
  - Backup Directory configuration
  - Theme selection (Light, Dark, Night)
  - Notifications toggle
  - Auto-start on system startup
- **Tools & Directory Management**:
  - **Backup Directory**: Delete backup contents
  - **User Directory**: Backup, restore, and delete user data
  - **Shader Directory**: Delete shader cache
  - **Log Directory**: Delete logs with automatic size calculation and display
- **Cross-platform**: Built with Tauri 2 for Windows, macOS, and Linux
- **Modern UI**: Vue 3 with Composition API and DaisyUI Synthwave theme

## Prerequisites

- [Node.js](https://nodejs.org/) (v20.19+ or v22.12+)
- [Rust](https://www.rust-lang.org/) (v1.90.0 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone git@github.com:pfitzer/BackersLittlleHelper.git
cd BackersLittleHelper
```

2. Install dependencies:
```bash
npm install
```

## Development

Run the application in development mode:

```bash
npm run tauri dev
```

## Code Quality

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

Auto-fix linting issues:

```bash
npm run lint:fix
```

### Testing

Run the test suite:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

Run tests in watch mode:

```bash
npm test -- --watch
```

## Building

Build the application for production:

```bash
npm run tauri build
```

The built application will be available in `src-tauri/target/release`.


## Project Structure

```
BackersLittleHelper/
├── src/                        # Vue.js frontend source
│   ├── components/             # Vue components
│   │   ├── __tests__/         # Component tests
│   │   │   ├── Home.test.js
│   │   │   ├── Settings.test.js
│   │   │   ├── Tools.test.js
│   │   │   └── Vehicles.test.js
│   │   ├── Home.vue           # Home dashboard with Comm-Links and server status
│   │   ├── Settings.vue       # Settings page component
│   │   ├── Tools.vue          # Tools & directory management component
│   │   └── Vehicles.vue       # Vehicle search and details component
│   ├── App.vue                # Main app component
│   ├── main.js                # Vue app entry point
│   ├── i18n.js                # Internationalization configuration
│   └── style.css              # Global styles with dynamic font sizing
├── src-tauri/                 # Tauri backend
│   ├── src/                   # Rust source code
│   │   └── main.rs            # Main Rust backend with menu system
│   ├── icons/                 # Application icons
│   ├── capabilities/          # Tauri security capabilities
│   ├── Cargo.toml             # Rust dependencies
│   └── tauri.conf.json        # Tauri configuration
├── index.html                 # HTML entry point
├── vite.config.js             # Vite configuration
├── vitest.config.js           # Vitest test configuration
└── package.json               # Node.js dependencies
```

## Technologies

- **Frontend**: Vue 3, Vite, vue-i18n
- **Backend**: Tauri 2, Rust
- **UI Framework**: Tailwind CSS, DaisyUI (Synthwave theme)
- **Code Quality**: ESLint, eslint-plugin-vue
- **Testing**: Vitest, Vue Test Utils
- **APIs**: Star Citizen Wiki API, RSI Status Feed (XML)
- **Tauri Plugins**:
  - FS (File System operations)
  - Dialog (File/folder selection)
  - HTTP (CORS-free API requests)
  - Opener (External links and URLs)
  - Shell (Process execution)

## Configuration

Settings are stored in the application data directory:
- **Windows**: `%APPDATA%\com.backerslittlehelper.app\settings.json`
- **macOS**: `~/Library/Application Support/com.backerslittlehelper.app/settings.json`
- **Linux**: `~/.config/com.backerslittlehelper.app/settings.json`

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

Michael Pfister (info@mp-development.de)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.