export function useServerInfo() {
  const { fetchData } = useAPI();
  const { openModal } = useModal();
  const { user } = useUser();
  const config = useRuntimeConfig();

  const { APP_GITHUB_URL, APP_RELEASE_DATE, APP_VERSION } = config.public;

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

  async function openAboutAppModal() {
    const serverInformation = await getServerInformation();
    const appInformation = getAppInformation();

    openModal(MODAL_TYPE.aboutAppModal, {
      appInformation,
      serverInformation,
    });
  }

  return {
    openAboutAppModal,
  };
}
