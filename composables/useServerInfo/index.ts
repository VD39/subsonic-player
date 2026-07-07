export function useServerInfo() {
  const config = useRuntimeConfig();
  const { APP_GITHUB_URL, APP_RELEASE_DATE, APP_VERSION } = config.public;

  const { fetchData } = useAPI();
  const { user } = useUser();

  const aboutInformation = ref<AboutInformation | null>(null);

  async function fetchInformation() {
    const appInfo = getAppInformation();
    const serverInfo = await getServerInformation();

    aboutInformation.value = {
      appInformation: appInfo,
      serverInformation: serverInfo,
    };
  }

  function getAppInformation(): AppInformation {
    return {
      bugReportUrl: `${APP_GITHUB_URL}/issues/new`,
      githubReleaseUrl: `${APP_GITHUB_URL}/releases`,
      githubUrl: APP_GITHUB_URL,
      homepageUrl: APP_GITHUB_URL,
      releaseDate: APP_RELEASE_DATE,
      version: APP_VERSION,
    };
  }

  async function getServerInformation(): Promise<ServerInformation> {
    const { data: serverInfoData } = await fetchData('/ping', {
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        formatAppInformation(response),
    });

    return {
      ...serverInfoData,
      url: user.value?.server || '',
    };
  }

  return {
    aboutInformation,
    fetchInformation,
  };
}
