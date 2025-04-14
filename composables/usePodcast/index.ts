export function usePodcast() {
  const { fetchData } = useAPI();
  const { addSuccessSnack } = useSnack();
  const { closeModal, openModal } = useModal();

  const podcasts = useState<Podcast[]>(STATE_NAMES.podcasts, () => []);

  function getPodcastsData(
    params: PodcastsParams = {
      includeEpisodes: false,
    },
  ) {
    return fetchData('/getPodcasts', {
      params,
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        (response.podcasts.channel || []).map(formatPodcast),
    });
  }

  async function getPodcasts() {
    const { data: podcastsData } = await getPodcastsData();
    podcasts.value =
      (podcastsData?.length && sortPodcastsByName(podcastsData)) || [];
  }

  async function getPodcast(id: string) {
    const { data: podcastData } = await getPodcastsData({
      id,
      includeEpisodes: true,
    });

    return podcastData?.[0] || null;
  }

  async function getNewestPodcastEpisodes() {
    const { data: newestPodcastEpisodesData } = await fetchData(
      '/getNewestPodcasts',
      {
        params: {
          count: 15,
        },
        transform: /* istanbul ignore next -- @preserve */ (response) =>
          (response.newestPodcasts.episode || []).map(formatPodcastEpisode),
      },
    );

    return newestPodcastEpisodesData || [];
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
      // Server might return error, however, some servers still add podcast.
      retry: 0,
    });

    if (podcastData) {
      addSuccessSnack('Successfully added podcast.');
      await getPodcasts();
    }
  }

  async function deletePodcast(id: string) {
    const { data: podcastData } = await fetchData('/deletePodcastChannel', {
      params: {
        id,
      },
    });

    if (podcastData) {
      addSuccessSnack('Successfully deleted podcast.');
      await getPodcasts();
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
  function addPodcastModal() {
    openModal(MODAL_TYPE.addPodcastModal, {
      async onSubmit(podcastUrl: string) {
        await addPodcast(podcastUrl);
        await getPodcasts();
        closeModal();
      },
    });
  }

  return {
    addPodcast,
    addPodcastModal,
    deletePodcast,
    deletePodcastEpisode,
    downloadPodcastEpisode,
    getNewestPodcastEpisodes,
    getPodcast,
    getPodcasts,
    podcasts,
    refreshPodcasts,
  };
}
