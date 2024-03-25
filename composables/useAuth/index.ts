import MD5 from 'crypto-js/md5';
import {
  deleteLocalStorage,
  generateRandomString,
  loadSession,
  saveSession,
} from '@/utils';
import { queryWithError } from '@/services';
import type { Auth } from './types';

export function useAuth() {
  const isLoading = ref(false);
  const errorMessage = ref('');
  const isLoggedIn = useState('is-logged-in', () => false);
  const userDetails = useState('user-details', () => loadSession());

  async function logout() {
    deleteLocalStorage();
    isLoggedIn.value = false;
  }

  async function autoLogin() {
    if (!userDetails.value.server) {
      logout();
      return;
    }

    await queryWithError('ping', userDetails.value)
      .then(() => {
        isLoggedIn.value = true;
      })
      .catch(() => {
        logout();
      });
  }

  async function login(auth: Auth) {
    isLoading.value = true;

    const { password, server, username } = auth;

    errorMessage.value = '';

    const saltValue = generateRandomString();
    const hashValue = MD5(`${password}${saltValue}`).toString();

    const params = {
      hash: hashValue,
      salt: saltValue,
      server,
      username,
    };

    await queryWithError('ping', params)
      .then(() => {
        saveSession(params);

        userDetails.value = loadSession();
        isLoggedIn.value = true;
      })
      .catch((error: Error) => {
        errorMessage.value = error.message;
        isLoggedIn.value = false;
      })
      .finally(() => {
        isLoading.value = false;
      });
  }

  return {
    autoLogin,
    errorMessage,
    isLoading,
    isLoggedIn,
    login,
    logout,
    userDetails,
  };
}
