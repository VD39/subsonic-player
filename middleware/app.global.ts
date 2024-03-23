import { useTheme } from '@/composables/useTheme';

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    return;
  }

  const { setDefaultTheme } = useTheme();

  await callOnce(async () => {
    setDefaultTheme();
  });
});
