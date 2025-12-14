# Subsonic Player - webOS TV App

This directory contains the webOS TV packaging and deployment files for the Subsonic Player.

## 🎯 Overview

This app transforms the Subsonic Player into a production-quality webOS TV application using a **minimal-fork strategy** that maintains upstream compatibility while adding TV-specific optimizations.

## 📋 Prerequisites

- **Node.js**: 20+
- **Yarn**: 1.22.22+ (included)
- **webOS SDK**: For packaging and deployment to TV
  - Install from: https://webostv.developer.lge.com/sdk/installation/
  - Required tools: `ares-package`, `ares-install`, `ares-launch`

## 🚀 Quick Start

### 1. Build for webOS

```bash
# From project root
yarn build:webos
```

This command will:

1. Build the Nuxt app as a static SPA
2. Copy build output to `webos/` directory
3. Create icons from PWA assets
4. Package as `.ipk` file (if webOS SDK is installed)

### 2. Manual Packaging (if script doesn't work)

```bash
# Build the app
yarn build

# Copy files to webOS directory
cp -r .output/public/* webos/

# Package (requires webOS SDK)
ares-package webos --outdir ./

# Install on TV
ares-install com.subsonic.player_1.0.0_all.ipk -d YOUR_TV_NAME
```

### 3. Launch on TV

```bash
# List available devices
ares-device --list

# Add your TV (one-time setup)
ares-setup-device

# Launch the app
ares-launch com.subsonic.player -d YOUR_TV_NAME
```

## 🔄 Maintenance Strategy

### Staying Up-to-Date with Upstream

This webOS adaptation uses a **shallow fork** strategy:

```bash
# Add upstream remote (one-time)
git remote add upstream https://github.com/VD39/subsonic-player.git

# Update from upstream
git fetch upstream
git rebase upstream/main

# Resolve conflicts (if any)
# - Most changes should auto-rebase cleanly
# - Only webOS-specific files may need manual merge
```

### Files Modified from Upstream

**Core Configuration:**

- `nuxt.config.ts` - Added `ssr: false` and `nitro.preset: 'static'`
- `package.json` - Added `build:webos` script
- `assets/css/main.css` - Added webOS CSS import

**webOS-Specific Additions:**

- `plugins/webos-input.client.ts` - TV navigation (new file)
- `assets/css/global/webos-tv.css` - TV styling (new file)
- `webos/*` - Packaging directory (new directory)

### Feature Flags (No Forking Required)

The app detects webOS at runtime:

```typescript
if (typeof window !== 'undefined' && 'webOS' in window) {
  // webOS-specific behavior
}
```

This allows TV-specific UX without breaking desktop/mobile compatibility.

## 📝 Development Workflow

### Local Development

```bash
# Standard web development (no TV needed)
yarn dev

# Test in browser at http://localhost:3000/?webos=true
# Simulate TV with browser dev tools:
# - Set viewport to 1920x1080
# - Use keyboard for navigation (arrow keys = DPAD)
```

### TV Testing

```bash
# Build and deploy to TV
yarn build:webos
ares-install com.subsonic.player_1.0.0_all.ipk -d YOUR_TV_NAME
ares-launch com.subsonic.player -d YOUR_TV_NAME

# Debug on TV
ares-inspect com.subsonic.player -d YOUR_TV_NAME
# Opens Chrome DevTools connected to TV
```

Quick redeploy cycle:

```bash
ares-launch --close com.subsonic.player
yarn build:webos
while ! ares-install com.subsonic.player_1.0.0_all.ipk; do echo next try; done
ares-inspect  --app com.subsonic.player --open
```
