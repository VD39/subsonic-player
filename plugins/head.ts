export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const { MAIN_APP_TITLE } = config.public;

  useHead({
    htmlAttrs: {
      lang: 'en',
    },
    link: [
      // Safari pinned tab.
      {
        color: THEME_COLOUR,
        href: '/favicon.svg',
        rel: 'mask-icon',
      },
    ],
    meta: [
      {
        content:
          'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover',
        name: 'viewport',
      },
      {
        content: THEME_COLOUR,
        name: 'theme-color',
      },
      {
        content:
          'A responsive, modern web-based client designed for Subsonic music servers.',
        name: 'description',
      },
      {
        content: 'yes',
        name: 'mobile-web-app-capable',
      },
      {
        content: 'black-translucent',
        name: 'apple-mobile-web-app-status-bar-style',
      },
      {
        content: MAIN_APP_TITLE,
        name: 'apple-mobile-web-app-title',
      },
      // iOS-specific behavior.
      {
        content: 'telephone=no',
        name: 'format-detection',
      },
    ],
    titleTemplate: (titleChunk) => {
      if (!titleChunk) {
        return MAIN_APP_TITLE;
      }

      return `${titleChunk
        .split(/ - /)
        .map((substring) => {
          if (substring === 'a-z') {
            return substring.toUpperCase();
          }

          return convertToTitleCase(replaceCharactersWithSpace(substring));
        })
        .join(' - ')} - ${MAIN_APP_TITLE}`;
    },
  });
});
