#!/bin/bash

# webOS Packaging Script for Subsonic Player
# This script builds the Nuxt app and packages it for webOS TV

set -e

echo "🚀 Building Subsonic Player for webOS..."

# Step 1: Generate the Nuxt app as static SPA with webOS-specific settings
echo "📦 Step 1: Generating Nuxt static app for webOS..."
cd "$(dirname "$0")/.."
WEBOS_BUILD=true yarn nuxt generate

# Step 2: Clean previous webOS build
echo "🧹 Step 2: Cleaning previous webOS build..."
rm -rf webos/dist webos/_nuxt webos/*.html webos/*.js webos/*.css webos/*.png webos/*.svg webos/*.webmanifest webos/*.ico

# Step 3: Copy build output to webOS directory
echo "📋 Step 3: Copying build output to webOS directory..."
cp -r .output/public/* webos/

# Step 3.5: Fix absolute paths for webOS file:// protocol
echo "🔧 Step 3.5: Converting absolute paths to relative paths..."
# Fix HTML attributes (href, src)
find webos -name "*.html" -type f -exec sed -i 's|href="/|href="./|g; s|src="/|src="./|g' {} \;
# Fix importmap JSON in HTML ({"imports":{"#entry":"/_nuxt/...)
find webos -name "*.html" -type f -exec sed -i 's|"/_nuxt/|"./_nuxt/|g; s|"/builds/|"./builds/|g' {} \;
# Fix JavaScript module imports and fetch calls
find webos -name "*.js" -type f -exec sed -i 's|"/_nuxt/|"./_nuxt/|g; s|'\''/_nuxt/|'\''./_nuxt/|g; s|"/builds/|"./builds/|g; s|'\''/builds/|'\''./builds/|g' {} \;

# Step 3.6: Remove crossorigin attributes (file:// protocol doesn't support CORS)
echo "🔧 Step 3.6: Removing crossorigin attributes for file:// compatibility..."
find webos -name "*.html" -type f -exec sed -i 's| crossorigin||g' {} \;

# Step 3.7: Removing modulepreload links...
echo "🔧 Step 3.7: Removing modulepreload links..."
find webos -name "*.html" -type f -exec sed -i 's|<link rel="modulepreload"[^>]*>||g' {} \;

# Step 3.8: Fix runtime config baseURL in inline script
echo "🔧 Step 3.8: Fixing runtime config baseURL..."
find webos -name "*.html" -type f -exec sed -i 's|baseURL:"/"|baseURL:"./"|g' {} \;

# Step 4: Create icons (using existing favicon)
echo "🎨 Step 4: Creating webOS icons..."
if [ -f "webos/favicon.svg" ]; then
  cp webos/favicon.svg webos/icon.png 2>/dev/null || echo "  ⚠️  Icon conversion skipped (install imagemagick for auto-conversion)"
  cp webos/favicon.svg webos/largeIcon.png 2>/dev/null || true
fi

# Use existing PWA icons if available
if [ -f "webos/pwa-512x512.png" ]; then
  cp webos/pwa-512x512.png webos/icon.png
  cp webos/pwa-512x512.png webos/largeIcon.png
  cp webos/pwa-512x512.png webos/splashBackground.png
fi

# Step 5: Package for webOS (if ares-package is installed)
echo "📦 Step 5: Creating webOS package..."
if command -v ares-package &> /dev/null; then
  # Use --no-minify because Nuxt already minified the code
  ares-package webos --outdir ./ --no-minify
  echo "✅ webOS package created successfully!"
  echo "📦 Package: com.subsonic.player_1.0.0_all.ipk"
  echo ""
  echo "To install on your TV:"
  echo "  ares-install com.subsonic.player_1.0.0_all.ipk -d <TV_NAME>"
else
  echo "⚠️  ares-package not found. Install webOS SDK to create .ipk package"
  echo "   See: https://webostv.developer.lge.com/sdk/installation/"
fi

echo ""
echo "✅ Build complete! webOS app files are in: webos/"
yarn manifest
