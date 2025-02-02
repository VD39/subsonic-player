export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const { MAIN_APP_TITLE } = config.public;

  useHead({
    meta: [
      {
        content: 'width=device-width, initial-scale=1',
        name: 'viewport',
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
