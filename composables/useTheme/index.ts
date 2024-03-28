export function useTheme() {
  const isDarkTheme = useState('theme', () => false);

  function toggleTheme() {
    isDarkTheme.value = !isDarkTheme.value;
    setLocalStorage('theme', JSON.stringify(isDarkTheme.value));
  }

  function setDefaultTheme() {
    const localTheme = getLocalStorage('theme');
    const userPrefersDarkTheme = window.matchMedia(
      '(prefers-color-scheme: dark)',
    )?.matches;

    if (localTheme) {
      isDarkTheme.value = JSON.parse(localTheme);
      return;
    }

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
