import MD5 from 'crypto-js/md5';

export function useAuth() {
  const { fetchData } = useAPI();
  const user = useUser();
  const { resetAllUserState } = useStateReset();
  const authCookie = useCookie(COOKIE_NAMES.auth, {
    expires: new Date(
      new Date().setDate(new Date().getDate() + DAYS_COOKIE_EXPIRES),
    ),
  });

  const loading = ref(false);
  const error = ref<null | string>(null);
  const isAuthenticated = useState(STATE_NAMES.userAuthenticated, () => false);

  // Initialize user from stored auth token
  // Use localStorage for webOS (file://), cookies for web
  const storedToken = getAuthToken();
  user.value = loadSession(storedToken ?? '');

  function logout() {
    clearNuxtData();
    setAuthToken(null);
    user.value = loadSession('');
    clearNuxtState(STATES_TO_CLEAR);
  }

  async function autoLogin() {
    if (!user.value?.server) {
      logout();
      return;
    }

    const { data: loggedIn, error: loginError } = await fetchData('/ping');

    if (loginError?.message) {
      logout();
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
      const authToken = convertToQueryString(params);
      setAuthToken(authToken);
      user.value = loadSession(authToken);
      isAuthenticated.value = true;
    }

    loading.value = false;
  }

  async function logoutAndRedirect() {
    clearNuxtData();

    // Reset all user-related states.
    resetAuth();
    resetAllUserState();

    await navigateTo({
      name: ROUTE_NAMES.login,
    });
  }

  function resetAuth() {
    isAuthenticated.value = false;
    user.value = null;
    authCookie.value = null;
    error.value = null;
  }

  return {
    autoLogin,
    error,
    isAuthenticated,
    loading,
    login,
    logout,
    logoutAndRedirect,
  };
}

// Get auth token from storage (localStorage for webOS, cookie for web)
function getAuthToken(): null | string {
  if (isWebOS()) {
    return getAuthFromLocalStorage();
  }
  return useCookie(COOKIE_NAMES.auth).value ?? null;
}

// Set auth token in storage
function setAuthToken(value: null | string) {
  if (isWebOS()) {
    setAuthInLocalStorage(value);
  } else {
    const cookie = useCookie(COOKIE_NAMES.auth, {
      expires: new Date(
        new Date().setDate(new Date().getDate() + DAYS_COOKIE_EXPIRES),
      ),
    });
    cookie.value = value;
  }
}
