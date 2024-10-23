export function usePodcast() {
  const { fetchData } = useAPI();
  const { addSuccessSnack } = useSnack();
  const { closeModal, openModal } = useModal();

  const podcast = useState<Podcast | undefined>(
    STATE_NAMES.podcast,
    () => undefined,
  );
  const podcasts = useState<Podcast[]>(STATE_NAMES.podcasts, () => []);
  const podcastEpisodes = useState<PodcastEpisode[]>(
    STATE_NAMES.podcastEpisodes,
    () => [],
  );
  const latestPodcasts = useState<PodcastEpisode[]>(
    STATE_NAMES.latestPodcasts,
    () => [],
  );

  async function getPodcasts(noLoading = false) {
    const { data: podcastsData } = await fetchData('/getPodcasts', {
      params: {
        noLoading,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        (response.podcasts.channel || []).map(formatPodcast),
    });

    if (Array.isArray(podcastsData)) {
      podcasts.value = podcastsData;
    }
  }

  async function getPodcast(
    id: string,
    sortBy: PodcastSortByParam = ROUTE_PODCAST_SORT_BY_PARAMS.All,
  ) {
    if (!podcasts.value.length) {
      await getPodcasts();
    }

    podcast.value = podcasts.value.find((podcast) => podcast.id === id);

    podcastEpisodes.value = podcast.value
      ? sortPodcastEpisodes(podcast.value.episodes, sortBy)
      : [];
  }

  /* istanbul ignore next -- @preserve */
  async function refreshPodcasts() {
    await fetchData('/refreshPodcasts');
  }

  async function addPodcast(url: string) {
    const { data: podcastData } = await fetchData('/createPodcastChannel', {
      method: 'POST',
      params: {
        noLoading: true,
        url,
      },
      retry: 0,
    });

    if (podcastData) {
      addSuccessSnack('Successfully added podcast.');
      await getPodcasts(true);
    }
  }

  async function deletePodcast(id: string) {
    const { data: podcastData } = await fetchData('/deletePodcastChannel', {
      params: {
        id,
        noLoading: true,
      },
    });

    if (podcastData) {
      addSuccessSnack('Successfully deleted podcast.');
      await getPodcasts(true);
    }
  }

  async function deletePodcastEpisode(id: string) {
    const { data: podcastData } = await fetchData('/deletePodcastEpisode', {
      params: {
        id,
        noLoading: true,
      },
    });

    if (podcastData) {
      addSuccessSnack('Successfully deleted podcast episode.');
      await getPodcasts(true);
    }
  }

  async function downloadPodcastEpisode(id: string) {
    const { data: podcastData } = await fetchData('/downloadPodcastEpisode', {
      params: {
        id,
        noLoading: true,
      },
    });

    if (podcastData) {
      addSuccessSnack('Download has begun on the server.');
    }
  }

  async function getNewestPodcasts() {
    const { data: latestPodcastsData } = await fetchData('/getNewestPodcasts', {
      params: {
        count: 10,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        (response.newestPodcasts.episode || []).map(formatPodcastEpisode('')),
    });

    if (Array.isArray(latestPodcastsData)) {
      latestPodcasts.value = latestPodcastsData;
    }
  }

  /* istanbul ignore next -- @preserve */
  function addPodcastModal() {
    openModal(MODAL_TYPE.addPodcastModal, {
      async onSubmit(podcastUrl: string) {
        await addPodcast(podcastUrl);
        closeModal();
      },
    });
  }

  function sortPodcasts(sortBy: PodcastsSortByParam) {
    if (sortBy === ROUTE_PODCASTS_SORT_BY_PARAMS.Recent) {
      podcasts.value = sortPodcastsByDate(podcasts.value);
    } else {
      podcasts.value = sortPodcastsByName(podcasts.value);
    }
  }

  return {
    addPodcast,
    addPodcastModal,
    deletePodcast,
    deletePodcastEpisode,
    downloadPodcastEpisode,
    getNewestPodcasts,
    getPodcast,
    getPodcasts,
    latestPodcasts,
    podcast,
    podcastEpisodes,
    podcasts,
    refreshPodcasts,
    sortPodcasts,
  };
}
