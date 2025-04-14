<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import MediaListWrapper from '@/components/Atoms/MediaListWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import PodcastItem from '@/components/Organisms/PodcastItem.vue';
import PodcastList from '@/components/Organisms/PodcastList.vue';

const route = useRoute();
const { downloadMedia } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openTrackInformationModal } = useMediaInformation();
const { addTrackToQueue, playTracks } = useAudioPlayer();
const {
  addPodcastModal,
  deletePodcastEpisode,
  downloadPodcastEpisode,
  getNewestPodcastEpisodes,
  getPodcasts,
  podcasts,
} = usePodcast();

const {
  data: podcastData,
  refresh,
  status,
} = useAsyncData(
  ASYNC_DATA_NAMES.podcasts,
  async () => {
    const [newestPodcastEpisodes] = await Promise.all([
      getNewestPodcastEpisodes(),
      getPodcasts(),
    ]);

    return {
      newestPodcastEpisodes,
      podcasts: podcasts.value,
    };
  },
  {
    default: () => ({
      newestPodcastEpisodes: [],
      podcasts: [],
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

function playEpisode(episode: PodcastEpisode) {
  playTracks([episode]);
}

useHead({
  title: () => [route.params.sortBy, 'Podcasts'].filter(Boolean).join(' - '),
});
</script>

<template>
  <HeaderWithAction>
    <h1>Podcasts</h1>

    <template #actions>
      <RefreshButton :status="status" @refresh="refresh" />

      <ButtonLink
        :icon="ICONS.add"
        icon-size="large"
        title="Add podcast"
        @click="addPodcastModal"
      >
        Add podcast
      </ButtonLink>
    </template>
  </HeaderWithAction>

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
        :podcast-episodes="podcastData.newestPodcastEpisodes"
        @add-to-playlist="addToPlaylistModal"
        @add-to-queue="addTrackToQueue"
        @delete-episode="deletePodcastEpisode"
        @download-episode="downloadPodcastEpisode"
        @download-media="downloadMedia"
        @episode-information="openTrackInformationModal"
        @play-episode="playEpisode"
      />
    </div>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.podcast"
      message="No podcasts found."
    />
  </LoadingData>
</template>
