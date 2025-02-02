export function useTheme() {
  const isDarkTheme = useState(STATE_NAMES.theme, () => false);

  function toggleTheme() {
    isDarkTheme.value = !isDarkTheme.value;
    setLocalStorage(STATE_NAMES.theme, isDarkTheme.value);
  }

  function setDefaultTheme() {
    const localTheme = getLocalStorage(STATE_NAMES.theme);

    if (localTheme) {
      isDarkTheme.value = localTheme;
      return;
    }

    const userPrefersDarkTheme = window.matchMedia(
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
