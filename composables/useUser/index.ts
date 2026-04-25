export function useUser() {
  const { getAvatarUrl } = useAPI();

  const user = useState<null | User>(STATE_NAMES.currentUser, () => null);

  async function getAvatar(username: string) {
    const url = getAvatarUrl(username);

    const response = await fetch(url, {
      method: 'HEAD',
    });

    const contentType = response.headers.get('Content-Type');

    return response.ok && contentType?.startsWith('image/')
      ? url
      : IMAGE_DEFAULT_BY_TYPE.user;
  }

  function setUser(cookie: string) {
    user.value = loadSession(cookie);
  }

  function clearUser() {
    user.value = null;
  }

  return {
    clearUser,
    getAvatar,
    setUser,
    user,
  };
}
