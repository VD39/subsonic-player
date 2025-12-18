import type { Asset } from '@vite-pwa/assets-generator/config';
import type { NuxtConfig } from 'nuxt/schema';

import { THEME_COLOUR } from '../constants/theme';

const DEFAULT_PRESET = {
  padding: 0.1,
  resizeOptions: {
    background: THEME_COLOUR,
    fit: 'contain',
  },
} as Partial<Asset>;

export function createPWAConfig(mainAppTitle: string): NuxtConfig {
  if (process.env.NODE_ENV !== 'production') {
    return {
      pwa: {
        disable: true,
      },
    };
  }

  return {
    pwa: {
      client: {
        installPrompt: false,
        periodicSyncForUpdates: 3600,
        registerPlugin: true,
      },
      devOptions: {
        enabled: false,
        type: 'module',
      },
      includeAssets: ['*.svg', '*.png'],
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,vue,png,svg,ico,woff2}'],
      },
      injectRegister: 'auto',
      manifest: {
        background_color: THEME_COLOUR,
        categories: ['music', 'podcast', 'radio stations'],
        description:
          'A responsive, modern web-based client designed for Subsonic music servers.',
        dir: 'ltr',
        display: 'standalone',
        display_override: [
          'window-controls-overlay',
          'standalone',
          'minimal-ui',
        ],
        handle_links: 'preferred',
        iarc_rating_id: '',
        id: 'subsonic-player',
        lang: 'en',
        launch_handler: {
          client_mode: ['navigate-existing', 'auto'],
        },
        name: mainAppTitle,
        orientation: 'any',
        prefer_related_applications: false,
        protocol_handlers: [],
        related_applications: [],
        scope: '/',
        screenshots: [],
        short_name: mainAppTitle,
        shortcuts: [
          createShortcut('Library', '/library', 'View Library'),
          createShortcut('Queue', '/queue', 'View Queue'),
          createShortcut('Playlist', '/playlists', 'View Playlists'),
          createShortcut('Podcasts', '/podcasts', 'View Podcasts'),
          createShortcut('Bookmarks', '/bookmarks', 'View Bookmarks'),
          createShortcut(
            'Radio Stations',
            '/radio-stations',
            'View Radio Stations',
          ),
        ],
        start_url: '/',
        theme_color: THEME_COLOUR,
      },
      pwaAssets: {
        disabled: false,
        htmlPreset: '2023',
        image: 'public/favicon.svg',
        includeHtmlHeadLinks: true,
        integration: {
          baseUrl: '/',
          publicDir: 'public',
        },
        overrideManifestIcons: true,
        preset: {
          apple: {
            ...DEFAULT_PRESET,
            sizes: [180, 192],
          },
          maskable: {
            ...DEFAULT_PRESET,
            sizes: [64, 144, 192, 512],
          },
          transparent: {
            favicons: [[256, 'favicon.ico']],
            sizes: [64, 144, 192, 512],
          },
        },
      },
      registerType: 'autoUpdate',
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,vue,png,svg,ico,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: null,
        runtimeCaching: [
          {
            handler: 'CacheFirst',
            options: {
              cacheableResponse: {
                statuses: [0, 200],
              },
              cacheName: 'audio-cache',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 30,
                maxEntries: 100,
              },
              plugins: [
                {
                  cacheWillUpdate: async ({ response }) => {
                    if (
                      response?.headers?.get('content-type')?.includes('audio')
                    ) {
                      return response;
                    }

                    return null;
                  },
                },
              ],
              rangeRequests: true,
            },
            urlPattern: /^https?:\/\/.*\.(mp3|ogg|wav|flac|m4a)$/i,
          },
          {
            handler: 'CacheFirst',
            options: {
              cacheableResponse: {
                statuses: [0, 200],
              },
              cacheName: 'image-cache',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 7,
                maxEntries: 200,
              },
              plugins: [
                {
                  cacheKeyWillBeUsed: async ({ request }) => {
                    const url = URL.parse(request.url);

                    if (url) {
                      url.search = '';
                      return url.toString();
                    }

                    return request.url;
                  },
                },
              ],
            },
            urlPattern: /^https?:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/i,
          },
          {
            handler: 'NetworkFirst',
            options: {
              cacheableResponse: {
                statuses: [200],
              },
              cacheName: 'api-cache',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24,
                maxEntries: 100,
              },
              networkTimeoutSeconds: 10,
            },
            urlPattern: /^https?:\/\/.*\/rest\/.*/i,
          },
          {
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'asset-cache',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 7,
                maxEntries: 100,
              },
            },
            urlPattern: /^\/(_nuxt|_assets)\//,
          },
          {
            handler: 'NetworkOnly',
            urlPattern: /^https?:\/\/.*\/(ping|getLicense|getUser)$/i,
          },
        ],
      },
    },
  };
}

function createShortcut(name: string, url: string, description: string) {
  const size = 192;

  return {
    description,
    icons: [
      {
        sizes: `${size}x${size}`,
        src: `/pwa-${size}x${size}.png`,
        type: 'image/png',
      },
    ],
    name,
    short_name: name,
    url,
  };
}
