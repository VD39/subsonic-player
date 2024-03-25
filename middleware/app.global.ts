import { useAuth } from '@/composables/useAuth';
import { useTheme } from '@/composables/useTheme';

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return;
  }

  const { setDefaultTheme } = useTheme();
  const { autoLogin, isLoggedIn } = useAuth();

  await callOnce(async () => {
    await autoLogin();
    setDefaultTheme();
  });

  if (to.name === 'login' && isLoggedIn.value) {
    return await navigateTo('/');
  }

  if (to.name !== 'login' && !isLoggedIn.value) {
    return await navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
