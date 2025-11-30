# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Backers Little Helper is a Tauri 2 + Vue 3 desktop application for managing Star Citizen game configurations. It's a hybrid application with:
- **Frontend**: Vue 3 with Composition API, i18n for multilingual support (EN/DE/FR)
- **Backend**: Rust (Tauri 2) for native OS integration
- **Communication**: Frontend uses Tauri plugins to call native OS functions (file system, shell, HTTP, dialogs)

## Development Commands

### Running the Application
```bash
npm run tauri dev           # Start development server with hot reload
npm run tauri build         # Build production application
```

### Testing
```bash
npm test                    # Run all tests with Vitest
npm test -- --watch         # Run tests in watch mode
npm test -- path/to/file    # Run specific test file
npm run test:ui             # Run tests with Vitest UI
```

### Code Quality
```bash
npm run lint                # Check code with ESLint
npm run lint:fix            # Auto-fix ESLint issues
```

## Architecture

### Frontend Architecture (Vue 3)

The application uses Vue 3 Composition API with composables for shared logic:

1. **Composables Pattern** (`src/composables/`):
   - `useApiCache.js`: Centralized API caching with file-based storage in app data directory
   - `useCommLinks.js`: Fetches and parses RSS feed from Star Citizen (includes JSON cleaning for malformed API responses)
   - `useSettings.js`: Manages persistent app settings stored in OS-specific locations

2. **API Data Flow**:
   ```
   Component → Composable → useApiCache.fetchWithCache() → Tauri HTTP Plugin → API
                                ↓ (on cache hit)
                           Read from AppData/cache/
   ```

3. **Critical: JSON Parsing in useCommLinks**:
   The RSI comm-links feed returns malformed JSON that requires extensive cleaning:
   - Strip leading garbage characters (en-dash before JSON)
   - Replace invalid escape sequences (`\&` → `&`)
   - Escape literal control characters in `content_html` fields using hex codes (`\x0A`, `\x0D`, `\x09`)
   - Add missing closing quotes at end of responses
   - Handle corrupted cache files gracefully

### Backend Architecture (Rust/Tauri)

1. **Menu System** (`src-tauri/src/main.rs`):
   - Application menu with "Launch Star Citizen" functionality
   - Reads settings from `{AppData}/settings.json` to find game installation
   - Uses Tauri plugins: Shell (launch processes), Dialog (show messages), Opener (open URLs)

2. **Tauri Plugins Used**:
   - `@tauri-apps/plugin-fs`: File system operations (all file I/O goes through this)
   - `@tauri-apps/plugin-dialog`: Native file/folder picker dialogs
   - `@tauri-apps/plugin-http`: CORS-free HTTP requests (critical for API calls)
   - `@tauri-apps/plugin-shell`: Execute external processes (e.g., launch game)
   - `@tauri-apps/plugin-opener`: Open URLs in default browser

3. **File System Patterns**:
   - All paths use `BaseDirectory.AppData` for cross-platform compatibility
   - Settings: `{AppData}/settings.json`
   - Cache: `{AppData}/cache/{key}.json`
   - Platform-specific paths:
     - Windows: `%APPDATA%\com.backers-little-helper\`
     - macOS: `~/Library/Application Support/com.backers-little-helper/`
     - Linux: `~/.config/com.backers-little-helper/`

### State Management

No Vuex/Pinia - uses Vue 3 reactive refs in composables:
- Each composable returns reactive state and methods
- Components call composable methods which update reactive refs
- Multiple components can share the same composable instance

### Internationalization (i18n)

- Auto-detects OS language on startup
- Messages defined in `src/i18n.js` with nested object structure
- All user-facing strings must use `$t('key.path')` syntax
- Supported languages: English (en), German (de), French (fr)

## Testing Patterns

1. **Component Tests**: Use `@vue/test-utils` with `happy-dom`
2. **Composable Tests**: Mock Tauri plugins with Vitest `vi.mock()`
3. **Common Mocks**:
   ```javascript
   vi.mock('@tauri-apps/plugin-fs', () => ({
     BaseDirectory: { AppData: 0 },
     exists: vi.fn(),
     readTextFile: vi.fn(),
     writeTextFile: vi.fn()
   }))
   ```

## UI/Styling

- **Tailwind CSS** with custom RSI-inspired theme (sharp corners, blue glowing accents)
- **DaisyUI** for component library
- Custom theme colors defined in `tailwind.config.js`
- Dynamic font sizing with `clamp()` in `style.css`
- Noise texture overlay for atmospheric effect

## API Integration

### Star Citizen Wiki API
- Base URL: `https://api.star-citizen.wiki/api/v2/`
- Vehicles endpoint: `/vehicles/{name}?locale={locale}&include=manufacturer,shops,components`
- Uses `useApiCache` with 30-day cache for vehicles

### RSI Comm-Links Feed
- URL: `https://leonick.se/feeds/rsi/json`
- **Important**: Returns malformed JSON requiring extensive cleanup (see useCommLinks.js)
- Cache: 1 hour duration
- Never cache on errors - always retry fetch

### RSI Status Feed
- URL: `https://status.robertsspaceindustries.com/index.xml`
- XML format, parsed in component
- No caching applied

## Common Pitfalls

1. **Tauri Plugin Imports**: Always import from `@tauri-apps/plugin-{name}`, not `@tauri-apps/api`
2. **File Paths**: Use `BaseDirectory.AppData`, never hardcode OS-specific paths
3. **HTTP Requests**: Must use Tauri HTTP plugin, not fetch/axios (CORS restrictions)
4. **JSON Parsing**: When working with external APIs, validate and clean JSON before parsing
5. **Testing**: Mock all Tauri plugins - they don't work in Node.js test environment
6. **i18n Keys**: Always check if translation key exists before adding new UI text

## Build & Distribution

- Production builds go to `src-tauri/target/release/`
- Unsigned builds trigger Windows SmartScreen warnings (document workaround in README)
- No code signing configured - manual "Run anyway" required on first launch
