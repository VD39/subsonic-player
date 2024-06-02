export function usePodcast() {
  const { fetchData } = useAPI();
  const { addSuccessSnack } = useSnack();

  const podcast = useState<Podcast | null>('podcast', () => null);
  const podcasts = useState<Podcast[]>('podcasts', () => []);
  const latestPodcasts = useState<Podcast[]>('latest-podcasts', () => []);

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

  async function getPodcast(id: string) {
    if (!podcasts.value.length) {
      await getPodcasts();
    }

    podcast.value = podcasts.value.find((podcast) => podcast.id === id) || null;
  }

  /* istanbul ignore next -- @preserve */
  async function refreshPodcasts() {
    await fetchData('/refreshPodcasts');
  }

  async function addPodcast(url: string) {
    const { data: podcastData } = await fetchData('/createPodcastChannel', {
      method: 'POST',
      retry: 0,
      params: {
        url,
      },
    });

    if (podcastData) {
      addSuccessSnack('Successfully added podcast.');
    }
  }

  async function deletePodcast(id: string) {
    const { data: podcastData } = await fetchData('/deletePodcastChannel', {
      method: 'DELETE',
      params: {
        id,
      },
    });

    if (podcastData) {
      addSuccessSnack('Successfully deleted podcast.');
    }
  }

  async function deletePodcastEpisode(id: string) {
    const { data: podcastData } = await fetchData('/deletePodcastEpisode', {
      params: {
        id,
      },
    });

    if (podcastData) {
      addSuccessSnack('Successfully deleted podcast episode.');
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

  async function getNewestPodcasts() {
    const { data: latestPodcastsData } = await fetchData('/getNewestPodcasts', {
      params: {
        count: 10,
      },
    });

    if (Array.isArray(latestPodcastsData)) {
      latestPodcasts.value = latestPodcastsData;
    }
  }

  return {
    addPodcast,
    deletePodcast,
    deletePodcastEpisode,
    downloadPodcastEpisode,
    getNewestPodcasts,
    getPodcast,
    getPodcasts,
    latestPodcasts,
    podcast,
    podcasts,
    refreshPodcasts,
  };
}
