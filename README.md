# 🎵 Subsonic Music App: A Modern Subsonic Client

## 📝 Overview

Subsonic Music App is a responsive, modern web-based client designed for [Subsonic music servers][subsonic].

Built with [Nuxt 3][nuxt], a modern [Vue 3][vue] framework, this open-source application provides a seamless and enjoyable music listening experience across all devices.

**Compatible Servers:**

- [Gonic][gonic] (This app is primarily optimized for use with [Gonic][gonic]).
- [Airsonic Advanced][airsonic].
- [Navidrome][navidrome].
- [Subsonic servers][subsonic].

## ✨ Features

1. Fully Responsive UI (Further design improvements are ongoing.)

   - Optimized for desktop and mobile devices.
   - Adaptive design.

2. Comprehensive Library Browsing

   - Browse by album, artist, genre.
   - Explore podcasts and favourites.
   - Access internet radio stations.

3. Advanced Functionality

   - MediaSession Integration.
   - Advanced Search capabilities.
   - Dark/Light Mode support.

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
  subsonic-music-player:
    container_name: subsonic-music-player
    image: vd39/subsonic-music-app:latest # To be deployed.
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
  --name subsonic-music-player \
  -p 3000:3000 \
  --restart unless-stopped \
  vd39/subsonic-music-app:latest # To be deployed.
```

The application will be accessible at `http://localhost:3000`.

### Method 2: Local Development

This method skips Docker and runs the application directly using Node.js and Yarn.

1. Clone the repository:

   ```bash
   git clone https://github.com/VD39/subsonic-music-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd subsonic-music-app
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

[nuxt]: https://nuxt.com/
[vue]: https://vuejs.org/
[gonic]: https://github.com/sentriz/gonic
[airsonic]: https://github.com/airsonic-advanced/airsonic-advanced
[navidrome]: https://github.com/navidrome/navidrome
[subsonic]: https://github.com/topics/subsonic
[docker]: https://www.docker.com/
[nodejs]: https://nodejs.org/
[yarn]: https://yarnpkg.com/
[env-vars]: #-environment-variables
[license]: LICENSE
