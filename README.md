# Backers Little Helper 2

A desktop application built with Tauri 2 and Vue.js for managing Star Citizen game configurations and settings.

## Features

- **Multi-language Support**: Automatically detects OS language (English and German supported)
- **Settings Management**:
  - Installation Directory configuration
  - User Directory configuration
  - Shader Directory configuration
  - Theme selection (Light, Dark, Auto)
  - Notifications toggle
  - Auto-start on system startup
- **Cross-platform**: Built with Tauri 2 for Windows, macOS, and Linux
- **Modern UI**: Vue 3 with Composition API

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Rust](https://www.rust-lang.org/) (v1.90.0 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone git@github.com:pfitzer/BackersLittlleHelper.git
cd BackersLittleHelper2
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

## Building

Build the application for production:

```bash
npm run tauri build
```

The built application will be available in `src-tauri/target/release`.

## Project Structure

```
BackersLittleHelper2/
├── src/                    # Vue.js frontend source
│   ├── components/         # Vue components
│   │   └── Settings.vue   # Settings page component
│   ├── App.vue            # Main app component
│   ├── main.js            # Vue app entry point
│   ├── i18n.js            # Internationalization configuration
│   └── style.css          # Global styles
├── src-tauri/             # Tauri backend
│   ├── src/               # Rust source code
│   ├── icons/             # Application icons
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
└── package.json           # Node.js dependencies
```

## Technologies

- **Frontend**: Vue 3, Vite, vue-i18n
- **Backend**: Tauri 2, Rust
- **UI Framework**: Custom CSS
- **File System**: Tauri FS Plugin
- **Dialogs**: Tauri Dialog Plugin

## Configuration

Settings are stored in the application data directory:
- **Windows**: `%APPDATA%\com.backerslittlehelper2.app\settings.json`
- **macOS**: `~/Library/Application Support/com.backerslittlehelper2.app/settings.json`
- **Linux**: `~/.config/com.backerslittlehelper2.app/settings.json`

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

Michael Pfister (info@mp-development.de)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.