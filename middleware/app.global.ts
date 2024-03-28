export default defineNuxtRouteMiddleware(async (to) => {
  const { setDefaultTheme } = useTheme();
  const { autoLogin, authenticated } = useAuth();

  await callOnce(async () => {
    await autoLogin();

    if (import.meta.client) {
      setDefaultTheme();
    }
  });

  if (to.name === 'login' && authenticated.value) {
    return await navigateTo('/');
  }

  if (to.name !== 'login' && !authenticated.value) {
    return await navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
