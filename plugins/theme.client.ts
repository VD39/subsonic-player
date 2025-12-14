/**
 * Theme initialization plugin
 *
 * This plugin runs early on the client to apply the saved theme
 * before the app renders, preventing a flash of wrong theme.
 */
export default defineNuxtPlugin(() => {
  // Read theme from localStorage
  const storageKey = STATE_NAMES.theme;
  let isDark = false;

  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      isDark = JSON.parse(stored) === true;
    } else {
      // Fall back to system preference
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  } catch {
    // Ignore errors, use default (light)
  }

  // Apply theme class to HTML element immediately
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Also update the Nuxt state so useTheme stays in sync
  const themeState = useState(STATE_NAMES.theme, () => isDark);
  themeState.value = isDark;
});
