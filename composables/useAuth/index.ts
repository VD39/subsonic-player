import MD5 from 'crypto-js/md5';
import { convertToQueryString, generateRandomString } from '@/utils';
import type { Auth } from './types';
import { useAPI } from '../useApi';
import { loadSession } from '../useApi/utils';
import { useUser } from '../useUser';

export function useAuth() {
  const user = useUser();
  const authParams = useCookie('auth-params', {
    sameSite: true,
  });

  const loading = ref(false);
  const error = ref<string | null>(null);
  const authenticated = useState('authenticated', () => false);
  user.value = loadSession(authParams.value!);

  async function logout() {
    authParams.value = null;
    authenticated.value = false;
  }

  async function autoLogin() {
    if (!user.value?.server) {
      return;
    }

    const { data: loggedIn, error: loginError } = await useAPI('/ping');

    if (loginError.value?.message) {
      logout();
      return;
    }

    if (loggedIn.value) {
      authenticated.value = true;
    }
  }

  async function login(auth: Auth) {
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

    const { data: loggedIn, error: loginError } = await useAPI('/rest/ping', {
      baseURL: server,
      query: {
        s: params.salt,
        t: params.token,
        u: params.username,
      },
    });

    if (loginError.value?.message) {
      error.value = loginError.value.message;
      loading.value = false;

      return;
    }

    if (loggedIn.value) {
      authParams.value = convertToQueryString(params);
      user.value = loadSession(authParams.value);
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
