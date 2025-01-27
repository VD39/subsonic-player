export function usePodcast() {
  const { fetchData } = useAPI();
  const { addSuccessSnack } = useSnack();
  const { closeModal, openModal } = useModal();

  async function getPodcasts() {
    const { data: podcastsData } = await fetchData('/getPodcasts', {
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        (response.podcasts.channel || []).map(formatPodcast),
    });

    return podcastsData || [];
  }

  async function getNewestPodcasts() {
    const { data: latestPodcastsData } = await fetchData('/getNewestPodcasts', {
      params: {
        count: 10,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        (response.newestPodcasts.episode || []).map(formatPodcastEpisode({})),
    });

    return latestPodcastsData || [];
  }

  /* istanbul ignore next -- @preserve */
  async function refreshPodcasts() {
    await fetchData('/refreshPodcasts');
  }

  async function addPodcast(url: string) {
    const { data: podcastData } = await fetchData('/createPodcastChannel', {
      method: 'POST',
      params: {
        url,
      },
      retry: 0,
    });

    if (podcastData) {
      addSuccessSnack('Successfully added podcast.');
    }
  }

  async function deletePodcast(id: string, refresh?: () => Promise<void>) {
    const { data: podcastData } = await fetchData('/deletePodcastChannel', {
      params: {
        id,
      },
    });

    if (podcastData) {
      addSuccessSnack('Successfully deleted podcast.');
      await refresh?.();
    }
  }

  async function deletePodcastEpisode(id: string) {
    const { data: podcastData } = await fetchData('/deletePodcastEpisode', {
      params: {
        id,
      },
    });

    if (podcastData) {
      addSuccessSnack('Successfully deleted podcast episode from server.');
    }
  }

  async function downloadPodcastEpisode(id: string) {
    const { data: podcastData } = await fetchData('/downloadPodcastEpisode', {
      params: {
        id,
      },
    });

    if (podcastData) {
      addSuccessSnack('Download has begun on the server.');
    }
  }

  /* istanbul ignore next -- @preserve */
  function addPodcastModal(refresh: () => Promise<void>) {
    openModal(MODAL_TYPE.addPodcastModal, {
      async onSubmit(podcastUrl: string) {
        await addPodcast(podcastUrl);
        await refresh();
        closeModal();
      },
    });
  }

  function sortPodcasts(podcasts: Podcast[], sortBy: PodcastsSortByParam) {
    switch (sortBy) {
      case ROUTE_PODCASTS_SORT_BY_PARAMS.Recent:
        return sortPodcastsByDate(podcasts);
      default:
        return sortPodcastsByName(podcasts);
    }
  }

  return {
    addPodcast,
    addPodcastModal,
    deletePodcast,
    deletePodcastEpisode,
    downloadPodcastEpisode,
    getNewestPodcasts,
    getPodcasts,
    refreshPodcasts,
    sortPodcasts,
  };
}
