import MD5 from 'crypto-js/md5';

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
  const isAuthenticated = useState(STATE_NAMES.userAuthenticated, () => false);
  setUser(authCookie.value!);

  async function autoLogin() {
    if (!user.value?.server) {
      basicReset();
      return;
    }

    const { data: loggedIn, error: loginError } = await fetchData('/ping');

    if (loginError?.message) {
      basicReset();
      return;
    }

    if (loggedIn) {
      isAuthenticated.value = true;
    }
  }

  async function login(auth: AuthData) {
    loading.value = true;
    error.value = null;

    const { password, server, username } = auth;

    const saltValue = generateRandomString();
    const hashValue = MD5(`${password}${saltValue}`).toString();

    const params = {
      salt: saltValue,
      server,
      token: hashValue,
      username,
    };

    const { data: loggedIn, error: loginError } = await fetchData(
      '/rest/ping',
      {
        baseURL: server,
        query: {
          s: params.salt,
          t: params.token,
          u: params.username,
        },
      },
    );

    if (loginError?.message) {
      error.value = loginError.message;
      loading.value = false;
      isAuthenticated.value = false;

      return;
    }

    if (loggedIn) {
      authCookie.value = convertToQueryString(params);
      setUser(authCookie.value);
      isAuthenticated.value = true;
    }

    loading.value = false;
  }

  // Reset all user-related states.
  function basicReset() {
    resetAuth();
    resetAllUserState();
  }

  async function logoutAndRedirect() {
    clearNuxtData();

    basicReset();

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
