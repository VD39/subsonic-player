export function useAuth() {
  const { fetchData } = useAPI();
  const { clearUser, setUser, user } = useUser();
  const { resetAllUserState } = useStateReset();
  const authCookie = useCookie(COOKIE_NAMES.auth, {
    expires: new Date(
      new Date().setDate(new Date().getDate() + DAYS_COOKIE_EXPIRES),
    ),
  });

  const loading = ref(false);
  const error = ref<null | string>(null);
  const isAuthenticated = useState(STATE_KEYS.userAuthenticated, () => false);

  if (authCookie.value) {
    setUser(authCookie.value);
  }

  async function autoLogin() {
    if (!user.value?.server) {
      resetAllState();
      return;
    }

    const { data: pingResponse, error: loginError } = await fetchData('/ping');

    if (loginError?.message) {
      resetAllState();
      return;
    }

    if (pingResponse) {
      isAuthenticated.value = true;
    }
  }

  async function login(auth: AuthData) {
    loading.value = true;
    error.value = null;

    const params = buildSessionParams(auth);
    const requestOptions = {
      baseURL: params.server,
      query: getAuthParams(params),
      skipSessionAuth: true,
      suppressErrorSnack: true,
    };

    const { data: pingResponse, error: loginError } = await fetchData(
      '/rest/ping',
      requestOptions,
    );

    if (loginError?.message) {
      error.value = getFriendlyErrorMessage(loginError);
      loading.value = false;
      isAuthenticated.value = false;

      return;
    }

    if (pingResponse) {
      const username =
        params.authMethod === 'apiKey'
          ? await fetchTokenUsername(requestOptions)
          : params.username;

      authCookie.value = convertToQueryString({
        ...params,
        username,
      });

      setUser(authCookie.value);
      isAuthenticated.value = true;
    }

    loading.value = false;
  }

  async function fetchTokenUsername(
    requestOptions: Parameters<typeof fetchData>[1],
  ) {
    const { data } = await fetchData('/rest/tokenInfo', {
      ...requestOptions,
      transform: (response: SubsonicResponse) => response.tokenInfo?.username,
    });

    return data;
  }

  // Reset all user-related states.
  function resetAllState() {
    resetAuth();
    resetAllUserState();
  }

  async function logoutAndRedirect() {
    clearNuxtData();

    resetAllState();

    // Cached /rest URLs contain credentials.
    if (import.meta.client && 'caches' in window) {
      await caches.delete(PWA_CACHE_NAMES.api);
    }

    await navigateTo({
      name: ROUTE_NAMES.login,
    });
  }

  function resetAuth() {
    isAuthenticated.value = false;
    clearUser();
    authCookie.value = null;
    error.value = null;
  }

  return {
    autoLogin,
    error,
    isAuthenticated,
    loading,
    login,
    logoutAndRedirect,
  };
}
