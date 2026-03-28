# webOS Release Guide

## Prerequisites

- webOS SDK installed (for `ares-package`)
- `yarn` installed
- Git repository in clean state

## Release Steps

### 1. Update Version Numbers

Edit two files with the new version (e.g., `1.1.0`):

**package.json** (line 95):

```json
"version": "1.1.0"
```

**webos/appinfo.json** (line 4):

```json
"version": "1.1.0"
```

### 2. Build webOS Package

```bash
yarn build:webos
```

This creates: `com.subsonic.player_1.1.0_all.ipk`

### 3. Generate Homebrew Manifest

```bash
yarn manifest
```

This creates: `com.subsonic.player.v1.manifest.json`

### 4. Create GitHub Release

1. Go to: https://github.com/pando85/subsonic-player-webos/releases/new
2. Click "Choose a tag" → enter `v1.1.0` → "Create new tag"
3. Title: `v1.1.0`
4. Description: Summarize changes (see step 5 for how to generate)
5. Attach both files:
   - `com.subsonic.player_1.1.0_all.ipk`
   - `com.subsonic.player.v1.manifest.json`
6. Click "Publish release"

### 5. Generate Release Notes (Optional)

```bash
git log v1.0.0..HEAD --oneline --no-merges | grep -v dependabot
```

Replace `v1.0.0` with the previous release tag.

### 6. Commit and Tag

```bash
git add package.json webos/appinfo.json
git commit -m "release: v1.1.0"
git tag v1.1.0
git push origin main v1.1.0
```

## Summary Checklist

- [ ] Update `package.json` version
- [ ] Update `webos/appinfo.json` version
- [ ] Run `yarn build:webos`
- [ ] Run `yarn manifest`
- [ ] Create GitHub release with both files attached
- [ ] Commit, tag, and push
