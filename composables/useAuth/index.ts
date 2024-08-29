import MD5 from 'crypto-js/md5';

export function useAuth() {
  const { fetchData } = useAPI();
  const user = useUser();
  const authCookie = useCookie('auth-params', {
    sameSite: true,
  });

  const loading = ref(false);
  const error = ref<string | null>(null);
  const authenticated = useState('authenticated', () => false);
  user.value = loadSession(authCookie.value!);

  async function logout() {
    authCookie.value = null;
    clearNuxtState();
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
      token: hashValue,
      salt: saltValue,
      server,
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
    autoLogin,
    error,
    authenticated,
    loading,
    login,
    logout,
  };
}
