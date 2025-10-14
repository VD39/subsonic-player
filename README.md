# 🎵 Subsonic Player: A Modern Subsonic Client

![GitHub Actions Workflow Status][action-workflow]
[![Docker Pulls][docker-pulls]][docker-hub]
[![GitHub License][github-license]][license]

## 📝 Overview

Subsonic player is a responsive, modern web-based client designed for [Subsonic music servers][subsonic].

Built with [Nuxt 3][nuxt], a modern [Vue 3][vue] framework, this open-source application provides a seamless and enjoyable music listening experience across all devices.

**Compatible Servers:**

- [Gonic][gonic] (This application is primarily optimized for use with [Gonic][gonic]).
- [Airsonic Advanced][airsonic].
- [Navidrome][navidrome].
- [Subsonic servers][subsonic].

## ✨ Features

1. Fully Responsive UI (Further design improvements are ongoing.)

   - Optimized for desktop and mobile devices.
   - Adaptive design.

2. Comprehensive Library Browsing

   - Browse by album, artist, genre, and folder/files.
   - Explore podcasts and favourites.
   - Access internet radio stations.

3. Advanced Functionality

   - Bookmarking podcast episode to keep track of the listening position across multiple sessions.
   - MediaSession Integration.
   - Advanced Search capabilities.
   - Dark/Light Mode support.
   - Keyboard shortcut (Press `h` to see menu).
   - Easily drag and drop your favorite tracks, albums, and podcast episodes right into the queue or your playlist in the sidebar (available only on desktop).

4. Progressive Web App (PWA) Feature

   - Seamlessly download the app icon to the home screen, providing the convenience of launching the app just like a traditional native application.
   - Benefit from a web-based app that reduces storage space on devices compared to traditional downloadable applications, while still providing robust functionality.

## 📷 Previews

Click on the images to see video of the app in action.

### Dark theme

| Desktop                                             | Mobile                                           |
| --------------------------------------------------- | ------------------------------------------------ |
| [![Desktop Dark][desktop-dark]][desktop-dark-video] | [![Mobile Dark][mobile-dark]][mobile-dark-video] |

### Light theme

| Desktop                                                | Mobile                                              |
| ------------------------------------------------------ | --------------------------------------------------- |
| [![Desktop Light][desktop-light]][desktop-light-video] | [![Mobile Light][mobile-light]][mobile-light-video] |

## 🚀 Installation Methods

**Prerequisites:**

- [Docker][docker] (recommended).
- [Node.js][nodejs] 20+.
- [Yarn][yarn].

### Method 1: Docker Deployment

### Docker Compose Configuration

The simplest way to run the application is via Docker Compose. This method automatically handles dependencies and configuration.

The [environment variables][env-vars] are optional and can be customized as needed.

Create a file named `docker-compose.yml` with the following content.

```yml
services:
  subsonic-player:
    container_name: subsonic-player
    image: vd39/subsonic-player:latest
    ports:
      - '3000:3000'
    restart: unless-stopped
```

Execute the following command in your terminal:

```bash
docker compose up -d
```

The application will be accessible at `http://localhost:3000`.

### Docker Run Command (Alternative)

This method offers more granular control.

```bash
docker run -d \
  --name subsonic-player \
  -p 3000:3000 \
  --restart unless-stopped \
  vd39/subsonic-player:latest
```

The application will be accessible at `http://localhost:3000`.

### Method 2: Local Development

This method skips Docker and runs the application directly using Node.js and Yarn.

1. Clone the repository:

   ```bash
   git clone https://github.com/VD39/subsonic-player.git
   ```

2. Navigate to the project directory:

   ```bash
   cd subsonic-player
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```

4. **(Optional)** Create a `.env` file: Create a file named `.env` in the project's root directory. This file will hold your [environment variables][env-vars].

5. Start the development server:

   ```bash
   yarn dev
   ```

The development server will start at `http://localhost:3000`.

Changes you make to the code will automatically trigger a rebuild and refresh of the browser.

## 🔧 Environment Variables

| Variable                     | Default     | Description                      |
| ---------------------------- | ----------- | -------------------------------- |
| `NUXT_PUBLIC_SERVER_URL`     | `undefined` | Subsonic server URL              |
| `NUXT_PUBLIC_MAIN_APP_TITLE` | `Music App` | Browser tab title                |
| `NUXT_PUBLIC_LOAD_SIZE`      | `50`        | Items loaded per scroll          |
| `NUXT_PUBLIC_IMAGE_SIZE`     | `500`       | Album art image size (in pixels) |

## 🤝 Contributing

Contributions are always welcome! Feel free to contribute, provide feedback, or raise issues on GitHub!

## 📄 License

This project is licensed under the AGPLv3 license. Full license details available in the [LICENSE][license] file for details.

## 🌐 Project Resources

- [GitHub Repository][github]
- [Docker Hub][docker-hub]

<!-- Links -->

[nuxt]: https://nuxt.com/
[vue]: https://vuejs.org/
[gonic]: https://github.com/sentriz/gonic/
[airsonic]: https://github.com/airsonic-advanced/airsonic-advanced/
[navidrome]: https://github.com/navidrome/navidrome/
[subsonic]: https://github.com/topics/subsonic/
[docker]: https://www.docker.com/
[nodejs]: https://nodejs.org/
[yarn]: https://yarnpkg.com/
[env-vars]: #-environment-variables
[license]: LICENSE
[github]: https://github.com/VD39/subsonic-player
[docker-hub]: https://hub.docker.com/r/vd39/subsonic-player

<!-- Badges -->

[action-workflow]: https://img.shields.io/github/actions/workflow/status/VD39/subsonic-player/ci.yml?logo=githubactions&style=flat-square
[docker-pulls]: https://img.shields.io/docker/pulls/vd39/subsonic-player?logo=githubactions&style=flat-square
[github-license]: https://img.shields.io/github/license/VD39/subsonic-player?logo=githubactions&style=flat-square

<!-- Images -->

[desktop-dark]: docs/images/desktop-dark.png
[mobile-dark]: docs/images/mobile-dark.png
[desktop-light]: docs/images/desktop-light.png
[mobile-light]: docs/images/mobile-light.png

<!-- Videos -->

[desktop-dark-video]: https://vd39.github.io/subsonic-player/videos/desktop-dark.mp4
[mobile-dark-video]: https://vd39.github.io/subsonic-player/videos/mobile-dark.mp4
[desktop-light-video]: https://vd39.github.io/subsonic-player/videos/desktop-light.mp4
[mobile-light-video]: https://vd39.github.io/subsonic-player/videos/mobile-light.mp4
