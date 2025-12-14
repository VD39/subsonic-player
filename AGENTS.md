# AGENTS.md - AI Agent Guide for Subsonic Player (webOS Fork)

**Last Updated:** 2025-12-13

## 🎯 Repository Overview

This is a **webOS TV fork** of the Subsonic Player web application. The upstream project is a modern Nuxt 3-based web client for Subsonic music servers, and this fork adds minimal, isolated changes to make it work on LG webOS TVs.

### Key Repositories

- **Upstream (Web App):** https://github.com/VD39/subsonic-player.git
- **This Fork (webOS):** https://github.com/pando85/subsonic-player-webos.git

### Critical Context

⚠️ **IMPORTANT: This is a minimal fork strategy**

- The **upstream maintains the web application** (desktop, mobile, PWA)
- **We maintain the webOS TV port** (this repository)
- Changes must be **isolated and non-invasive** to allow easy syncing from upstream
- When making changes, ALWAYS consider: "Can this be merged easily when upstream updates?"

## 🏗️ Architecture

### Base Technology Stack (Upstream)

- **Framework:** Nuxt 3 (Vue 3)
- **Build:** Vite
- **UI:** Custom CSS with PostCSS
- **State Management:** Vue Composables
- **Audio:** Native HTMLAudioElement API
- **Icons:** @phosphor-icons/vue
- **Responsive:** CSS Grid + Flexbox

### webOS Additions (This Fork)

- **Platform Detection:** `file://` protocol check
- **Navigation:** Custom spatial DPAD navigation plugin
- **Build:** Static SPA generation (no SSR)
- **Packaging:** webOS SDK (`ares-*` CLI tools)

## 📁 Repository Structure

### Core Application Files (Upstream - DO NOT MODIFY unless necessary)

```
components/       # Vue UI components (Atoms, Molecules, Organisms)
composables/      # Vue composables for business logic
  useAudioPlayer/ # Audio playback management
  useAuth/        # Authentication
  usePlaylist/    # Playlist operations
  useQueue/       # Queue management
pages/            # Nuxt pages (auto-routing)
layouts/          # Layout components
middleware/       # Route middleware
navigations/      # Navigation configuration
utils/            # Utility functions
types/            # TypeScript types
assets/css/       # Global styles
plugins/          # Nuxt plugins
```

### webOS-Specific Files (THIS FORK - Safe to modify)

```
plugins/
  └── webos-input.client.ts          # TV remote navigation plugin ⭐

assets/css/global/
  └── webos-tv.css                   # TV-specific styling ⭐

webos/                                # webOS packaging directory ⭐
  ├── appinfo.json                   # App metadata
  ├── package-webos.sh               # Build script
  ├── README.md                      # webOS documentation
  └── DEPLOYMENT.md                  # Deployment guide

WEBOS_GUIDE.md                        # Comprehensive webOS guide ⭐
```

### Modified Configuration Files (Merge carefully on upstream sync)

```
nuxt.config.ts      # Added: ssr: false, nitro.preset: 'static', webOS configs
package.json        # Added: build:webos script
assets/css/main.css # Added: @import for webos-tv.css
```

## 🔄 Upstream Sync Strategy

### What We Changed from Upstream

**1. Configuration Files (3 files modified):**

- `nuxt.config.ts` - Lines 36-38, 52-60, 78, 107-110, 162
  - `ssr: false` - webOS doesn't support SSR
  - `nitro.preset: 'static'` - Generate static files
  - `app.baseURL: './'` - Relative paths for `file://` protocol
  - `experimental.appManifest: false` - Disable fetch()-based features
  - PWA disabled for webOS builds via `WEBOS_BUILD` env var

- `package.json` - Line 63
  - Added: `"build:webos": "./webos/package-webos.sh"`

- `assets/css/main.css` - Last line
  - Added: `@import url('./global/webos-tv.css');`

**2. New Files Added (webOS-only):**

- `plugins/webos-input.client.ts` (~534 lines)
- `assets/css/global/webos-tv.css` (~115 lines)
- `webos/*` (entire directory)
- `WEBOS_GUIDE.md` (~547 lines)

**Total Impact:** 3 modified files, ~1200 new lines in isolated files

### How to Sync from Upstream

```bash
# Fetch latest changes
git fetch upstream

# Rebase onto upstream (preferred over merge)
git rebase upstream/main

# If conflicts occur, they'll likely be in:
# 1. nuxt.config.ts
# 2. package.json
# 3. assets/css/main.css
```

### Conflict Resolution Rules

**If `nuxt.config.ts` has conflicts:**

- ✅ KEEP: `ssr: false`
- ✅ KEEP: `nitro.preset: 'static'`
- ✅ KEEP: `app.baseURL: './'`
- ✅ KEEP: All `experimental.*` webOS settings
- ✅ KEEP: All `features.inlineStyles` webOS logic
- ✅ KEEP: PWA `disable` and `injectRegister` conditional logic
- ⚠️ REVIEW: Any new modules or dependencies added upstream

**If `package.json` has conflicts:**

- ✅ KEEP: `"build:webos": "./webos/package-webos.sh"`
- ⚠️ MERGE: New dependencies from upstream

**If `assets/css/main.css` has conflicts:**

- ✅ KEEP: `@import url('./global/webos-tv.css');` at the end

### Safe Zones vs. Danger Zones

**🟢 SAFE to modify (webOS-only, won't conflict):**

- `plugins/webos-input.client.ts`
- `assets/css/global/webos-tv.css`
- `webos/*` directory
- `WEBOS_GUIDE.md`

**🟡 MODIFY WITH CAUTION (merge conflicts likely):**

- `nuxt.config.ts`
- `package.json`
- `assets/css/main.css`

**🔴 AVOID modifying (upstream territory):**

- `components/**`
- `composables/**`
- `pages/**`
- `layouts/**`
- Other core application files

### Adding webOS-Specific Features

**Pattern: Feature Flags (Preferred)**

When you need webOS-specific behavior in existing files, use runtime detection:

```typescript
// In any Vue/Nuxt file
const isWebOS =
  typeof window !== 'undefined' && window.location.protocol === 'file:';

if (isWebOS) {
  // TV-specific behavior
} else {
  // Desktop/mobile behavior
}
```

**Alternative: CSS Scoping**

```css
/* In webos-tv.css */
body.webosTV .someElement {
  /* TV-specific styles */
}
```

The `webosTV` class is automatically added by `plugins/webos-input.client.ts:36`.

## 🎮 webOS TV Navigation System

### How It Works

**1. Platform Detection (`plugins/webos-input.client.ts:20-26`)**

```typescript
const isWebOS = window.location.protocol === 'file:';
```

webOS apps run via `file://` protocol, which is our detection mechanism.

**2. Body Class Addition (`plugins/webos-input.client.ts:36`)**

```typescript
document.body.classList.add('webosTV');
```

Enables all TV-specific CSS in `webos-tv.css`.

**3. Viewport Forcing (`plugins/webos-input.client.ts:38-44`)**

```typescript
viewport.setAttribute('content', 'width=1024, initial-scale=1');
```

Forces tablet layout (CSS media queries) while disabling hover effects.

**4. Spatial Navigation Algorithm**

The plugin implements a custom spatial navigation system:

- **Focusable Elements** (`lines 136-152`): Scans DOM for `a`, `button`, `input`, etc.
- **Element Filtering** (`lines 62-101`): Skips hidden/unwanted elements
- **Direction Finding** (`lines 183-269`): Calculates nearest element in arrow direction
- **Smart Scrolling**: Auto-scrolls focused elements into view

**5. Key Mappings** (`lines 444-497`):

- Arrow Keys (37-40): Spatial navigation
- Enter (13): Click/activate
- Back (461 webOS, 10009 Samsung): Navigate back
- Escape (27): Back
- Backspace (8): Back (except in inputs)

**6. Focus Initialization** (`lines 382-439`):

- Detail pages (album/artist): Focus "Play All" button
- List pages: Focus first focusable element
- Runs on page load and route changes

### Navigation Behavior Differences

**On List/Discovery Pages (albums, artists, genres):**

- Only album/artist images are focusable
- Title links and artist names are skipped (CSS: `pointer-events: none`)
- Action buttons (hover overlays) are hidden

**On Detail Pages (individual album/artist/playlist):**

- "Play All" button gets initial focus
- All track buttons are focusable
- Full keyboard control

### Styling System (`assets/css/global/webos-tv.css`)

**Focus States (lines 31-44):**

- Uses theme color: `var(--theme-color, #6313bc)`
- 3-4px outline with offset
- Compatible with light/dark themes

**Disabled Features (lines 54-76):**

- Hover effects hidden
- Mouse cursor hidden
- Title/artist links non-interactive

**Track Row Enhancement (lines 80-106):**

- Entire row highlights on focus
- Play button scales up (1.15x)

## 🛠️ Build & Deployment

### Development Workflow

```bash
# Standard web development (works in browser)
yarn dev
# Test at http://localhost:3000
# Simulate TV: Use arrow keys, set viewport to 1920x1080

# Build for webOS TV
yarn build:webos
# Output: com.subsonic.player_1.0.0_all.ipk

# Install on TV (requires webOS SDK)
ares-install com.subsonic.player_1.0.0_all.ipk -d TV_NAME

# Launch on TV
ares-launch com.subsonic.player -d TV_NAME

# Debug on TV (Chrome DevTools)
ares-inspect com.subsonic.player -d TV_NAME
```

### What `build:webos` Does (`webos/package-webos.sh`)

1. Sets `WEBOS_BUILD=true` environment variable
2. Runs `yarn build` (Nuxt static generation)
3. Copies `.output/public/*` to `webos/`
4. Generates icons from PWA assets
5. Packages with `ares-package --no-minify`
6. Creates `.ipk` installer file

### Why Static SPA?

webOS TV apps run in a Chromium-based browser environment:

- ✅ HTML, CSS, JS fully supported
- ✅ Modern Web APIs (Audio, Storage, etc.)
- ❌ NO Node.js runtime
- ❌ NO server-side rendering
- ❌ NO fetch() with `file://` protocol

Therefore: `ssr: false` + `nitro.preset: 'static'`

## 🎨 UI/UX Considerations

### Design Principles for webOS

**1. 10-Foot UI:**

- Text must be readable from 3 meters away
- Focus indicators must be highly visible
- Touch targets: 44px minimum

**2. No Hover States:**

- TV has no mouse cursor
- All actions must be accessible via keyboard/remote
- Hover-only features are disabled

**3. Simplified Navigation:**

- Reduce focusable elements (less clutter)
- Clear visual hierarchy
- Predictable spatial navigation

**4. Performance:**

- TV hardware is slower than desktop
- Minimize animations
- Optimize image sizes (use 300-500px, not full resolution)

### Responsive Breakpoints

The app uses media queries, but webOS forces tablet viewport:

```css
/* From assets/css/breakpoints.css */
@custom-media --phone-only (width < 769px);
@custom-media --tablet-up (width >= 769px); /* ← webOS uses this */
@custom-media --desktop-up (width >= 1281px);
```

webOS simulates 1024px viewport → triggers `--tablet-up` styles.

## 🧪 Testing Guidelines

### Browser Testing (Desktop)

```bash
yarn dev
```

**Simulate TV:**

1. Open DevTools (F12)
2. Set viewport: 1920x1080
3. Use ONLY keyboard (arrow keys, Enter, Escape)
4. Check focus visibility
5. Test navigation flows

### TV Testing (Physical Hardware)

```bash
yarn build:webos
ares-install com.subsonic.player_1.0.0_all.ipk -d TV_NAME
ares-inspect com.subsonic.player -d TV_NAME  # Debug
```

**Test Checklist:**

- [ ] Navigation with remote arrow keys
- [ ] Focus visible on all elements
- [ ] "Play All" button gets initial focus on album pages
- [ ] Audio playback works (user-initiated)
- [ ] Back button navigates correctly
- [ ] Login/logout flows
- [ ] Queue persistence (localStorage)
- [ ] Network error handling

## 🐛 Common Issues & Solutions

### Issue: App doesn't start on TV

**Cause:** webOS app not properly packaged or installed
**Solution:**

```bash
# Check installation
ares-install --list -d TV_NAME

# View logs
ares-log -f com.subsonic.player -d TV_NAME

# Verify TV is in developer mode
ares-setup-device
```

### Issue: Navigation doesn't work

**Cause:** Plugin not loaded or `webosTV` class missing
**Solution:**

- Check console: `[webOS] TV input plugin enabled`
- Verify `file://` protocol detection
- Inspect `<body>` element for `webosTV` class

### Issue: Audio won't play

**Cause:** webOS enforces user-initiated playback
**Solution:**

- First play MUST follow user interaction (Enter key)
- Check codec support (MP3/AAC recommended)
- Verify Subsonic server URL is accessible from TV network

### Issue: Focus goes to wrong elements

**Cause:** Spatial navigation algorithm or element filtering
**Solution:**

- Review `shouldSkipElement()` logic (lines 62-101)
- Check if elements are visible: `isVisible()` (lines 106-131)
- Adjust navigation scoring (lines 218-250)

### Issue: Upstream merge conflicts

**Cause:** Modified core files
**Solution:**

- Use feature flags instead of direct modifications
- Keep changes in webOS-specific files
- Document all core file changes clearly

## 📝 Code Style & Conventions

### File Naming

- `*.client.ts` - Client-only plugins (not SSR)
- `*.spec.ts` - Test files
- `*.vue` - Vue components
- Use kebab-case for CSS files
- Use PascalCase for Vue components

### CSS Guidelines

- Use CSS variables: `var(--theme-color)`
- Avoid `!important` (except in `webos-tv.css` for overrides)
- Use logical properties: `inline-start` not `left`
- Responsive with custom media queries

### TypeScript

- Strict mode enabled
- Type check on build
- Prefer `interface` over `type`
- Use Vue 3 `<script setup>` syntax

### Git Commit Style

Check recent commits for patterns:

```bash
git log --oneline -20
```

Typical format:

- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `webos: TV-specific changes`

## 🔍 Important Files Reference

### For Navigation Changes

- `plugins/webos-input.client.ts:183-269` - Spatial navigation algorithm
- `plugins/webos-input.client.ts:382-439` - Focus initialization

### For Styling Changes

- `assets/css/global/webos-tv.css` - All TV-specific styles
- `nuxt.config.ts:6-15` - PWA icon generation

### For Build Configuration

- `nuxt.config.ts:34-174` - Main Nuxt config
- `webos/package-webos.sh` - Build script
- `webos/appinfo.json` - App metadata

### For Audio Playback

- `composables/useAudioPlayer/player.ts` - Audio player logic
- Standard HTMLAudioElement - no webOS-specific changes needed

### For Authentication

- `composables/useAuth/` - Auth logic
- `utils/storage.ts` - localStorage wrapper
- No webOS-specific changes - works natively

## 💡 Best Practices for AI Agents

### When Making Changes

**1. ALWAYS check upstream compatibility:**

```bash
# Before starting work
git fetch upstream
git log upstream/main..HEAD  # See what we changed
```

**2. Prefer webOS-specific files:**

- New features → `plugins/webos-input.client.ts`
- New styles → `assets/css/global/webos-tv.css`
- Documentation → `WEBOS_GUIDE.md`

**3. Use feature flags for core file changes:**

```typescript
if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
  // webOS-specific code
}
```

**4. Document everything:**

- Add comments explaining WHY (not just WHAT)
- Update `WEBOS_GUIDE.md` for major changes
- Update this file (`AGENTS.md`) for architecture changes

**5. Test thoroughly:**

- Browser first (desktop simulation)
- TV second (actual hardware)
- Check both light and dark themes

### When Reviewing Code

**Check for:**

- ❌ Direct modifications to upstream files (without feature flags)
- ❌ Hover-dependent functionality
- ❌ SSR-specific code
- ❌ `fetch()` calls that won't work with `file://`
- ✅ Focus states for new interactive elements
- ✅ Keyboard/remote accessibility
- ✅ TV performance considerations

### When Debugging

**Start here:**

1. Check browser console (ares-inspect)
2. Verify `file://` protocol and `webosTV` class
3. Review focusable elements: `getFocusableElements()`
4. Check TV logs: `ares-log -f`
5. Compare with browser behavior

## 🚀 Quick Reference Commands

```bash
# Development
yarn dev                    # Start dev server
yarn build                  # Standard web build
yarn build:webos            # Build for webOS TV

# Linting & Type Checking
yarn lint                   # Run all linters
yarn check-types            # TypeScript check

# Testing
yarn test                   # Run tests
yarn test:once              # Single test run

# Git Operations
git fetch upstream          # Get upstream changes
git rebase upstream/main    # Sync with upstream

# webOS Operations
ares-setup-device           # Setup TV connection
ares-install *.ipk -d NAME  # Install app
ares-launch com.subsonic.player -d NAME  # Launch
ares-inspect com.subsonic.player -d NAME # Debug
ares-log -f com.subsonic.player -d NAME  # View logs
```

## 📚 Additional Resources

- **Full webOS Guide:** `WEBOS_GUIDE.md` (comprehensive deployment guide)
- **webOS SDK Docs:** https://webostv.developer.lge.com/sdk/
- **Nuxt 3 Docs:** https://nuxt.com/docs
- **Subsonic API:** http://www.subsonic.org/pages/api.jsp
- **Upstream Repo:** https://github.com/VD39/subsonic-player
- **This Fork:** https://github.com/pando85/subsonic-player-webos

## 🎯 TL;DR for AI Agents

1. **This is a webOS TV fork** - upstream maintains web app, we maintain TV port
2. **Keep changes isolated** - prefer webOS-specific files over modifying core
3. **Use feature flags** - when core changes needed, use `file://` protocol detection
4. **Sync often** - rebase from upstream regularly
5. **3 modified files** - `nuxt.config.ts`, `package.json`, `main.css` (handle conflicts carefully)
6. **Safe zones** - `plugins/webos-input.client.ts`, `assets/css/global/webos-tv.css`, `webos/`
7. **Test on TV** - browser simulation is good, but hardware testing is required
8. **No SSR, no fetch()** - static SPA only, `file://` protocol limitations
9. **Focus is king** - all UI must work with keyboard/remote only
10. **Document everything** - future you (or AI) will thank you

