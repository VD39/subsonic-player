export function useTheme() {
  const isDarkTheme = useState(STATE_KEYS.theme, () => false);

  function toggleTheme() {
    isDarkTheme.value = !isDarkTheme.value;
    setLocalStorage(LOCAL_STORAGE_KEYS.theme, isDarkTheme.value);
  }

  function loadThemePreference() {
    const localTheme = getLocalStorage(LOCAL_STORAGE_KEYS.theme);

    if (typeof localTheme === 'boolean') {
      isDarkTheme.value = localTheme;
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
    loadThemePreference,
    toggleTheme,
  };
}
