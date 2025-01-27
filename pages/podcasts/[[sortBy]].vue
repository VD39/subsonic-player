<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import MediaListWrapper from '@/components/Atoms/MediaListWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import PodcastItem from '@/components/Organisms/PodcastItem.vue';
import PodcastList from '@/components/Organisms/PodcastList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.podcasts],
});

const route = useRoute();
const { downloadMedia } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openTrackInformationModal } = useMediaInformation();
const { addTrackToQueue, playTracks } = useAudioPlayer();
const {
  addPodcastModal,
  deletePodcastEpisode,
  downloadPodcastEpisode,
  getNewestPodcasts,
  getPodcasts,
  sortPodcasts,
} = usePodcast();

const {
  data: podcastsData,
  refresh,
  status,
} = useAsyncData(
  ASYNC_DATA_NAMES.podcasts,
  async () => {
    const [latestPodcasts, podcasts] = await Promise.all([
      getNewestPodcasts(),
      getPodcasts(),
    ]);

    return {
      latestPodcasts,
      podcasts,
    };
  },
  {
    default: () => ({
      latestPodcasts: [],
      podcasts: [],
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

function playEpisode(episode: PodcastEpisode) {
  playTracks([episode]);
}

const podcasts = computed(() =>
  sortPodcasts(
    podcastsData.value.podcasts,
    route.params.sortBy as PodcastsSortByParam,
  ),
);

function addNewPodcastModal() {
  addPodcastModal(refresh);
}

useHead({
  title: () =>
    [route.params.sortBy || '', 'Podcasts'].filter(Boolean).join(' - '),
});
</script>

<template>
  <HeaderWithAction>
    <h1>Podcasts</h1>

    <template #actions>
      <RefreshButton :status="status" @refresh="refresh" />

      <ButtonLink
        icon-size="large"
        :icon="ICONS.add"
        title="Add podcast"
        @click="addNewPodcastModal"
      >
        Add podcast
      </ButtonLink>
    </template>
  </HeaderWithAction>

  <PageNavigation :navigation="PODCASTS_NAVIGATION" />

  <LoadingData :status="status">
    <div v-if="podcasts.length">
      <MediaListWrapper>
        <PodcastItem
          v-for="podcast in podcasts"
          :key="podcast.id"
          :podcast="podcast"
        />
      </MediaListWrapper>

      <h3>Latest Podcast Episodes</h3>

      <PodcastList
        :podcast-episodes="podcastsData.latestPodcasts"
        @play-episode="playEpisode"
        @add-to-queue="addTrackToQueue"
        @add-to-playlist="addToPlaylistModal"
        @episode-information="openTrackInformationModal"
        @delete-episode="deletePodcastEpisode"
        @download-episode="downloadPodcastEpisode"
        @download-media="downloadMedia"
      />
    </div>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.podcast"
      message="No podcasts found."
    />
  </LoadingData>
</template>
