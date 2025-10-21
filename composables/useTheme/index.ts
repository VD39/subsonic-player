export function useTheme() {
  const isDarkTheme = useState(STATE_NAMES.theme, () => false);

  function toggleTheme() {
    isDarkTheme.value = !isDarkTheme.value;
    setLocalStorage(STATE_NAMES.theme, JSON.stringify(isDarkTheme.value));
  }

  function setDefaultTheme() {
    const localTheme = getLocalStorage(STATE_NAMES.theme);

    if (localTheme) {
      isDarkTheme.value = JSON.parse(localTheme);
      return;
    }

    const userPrefersDarkTheme = globalThis.matchMedia(
      '(prefers-color-scheme: dark)',
    )?.matches;

    if (userPrefersDarkTheme) {
      isDarkTheme.value = userPrefersDarkTheme;
    }
  }

  return {
    isDarkTheme,
    setDefaultTheme,
    toggleTheme,
  };
}
