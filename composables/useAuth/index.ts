import MD5 from 'crypto-js/md5';

export function useAuth() {
  const { fetchData } = useAPI();
  const user = useUser();
  const authCookie = useCookie(COOKIE_NAMES.auth, {
    sameSite: true,
  });

  const loading = ref(false);
  const error = ref<null | string>(null);
  const authenticated = useState(STATE_NAMES.userAuthenticated, () => false);
  user.value = loadSession(authCookie.value!);

  async function logout() {
    const { resetAudio } = useAudioPlayer();

    authCookie.value = null;
    resetAudio();
    clearNuxtState(STATE_NAMES.userAuthenticated);
  }

  async function autoLogin() {
    if (!user.value?.server) {
      return;
    }

    const { data: loggedIn, error: loginError } = await fetchData('/ping');

    if (loginError?.message) {
      logout();
      return;
    }

    if (loggedIn) {
      authenticated.value = true;
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
        params: {
          s: params.salt,
          t: params.token,
          u: params.username,
        },
      },
    );

    if (loginError?.message) {
      error.value = loginError.message;
      loading.value = false;
      authenticated.value = false;

      return;
    }

    if (loggedIn) {
      authCookie.value = convertToQueryString(params);
      user.value = loadSession(authCookie.value);
      authenticated.value = true;
    }

    loading.value = false;
  }

  return {
    authenticated,
    autoLogin,
    error,
    loading,
    login,
    logout,
  };
}
