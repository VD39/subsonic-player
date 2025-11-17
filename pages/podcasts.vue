<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import GridWrapper from '@/components/Atoms/GridWrapper.vue';
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import PodcastItem from '@/components/Organisms/PodcastItem.vue';
import PodcastEpisodesList from '@/components/Organisms/TrackLists/PodcastEpisodesList.vue';

const { viewLayout } = useViewLayout();
const { downloadMedia } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openTrackInformationModal } = useMediaInformation();
const { addTrackToQueue, playTracks } = useAudioPlayer();
const { dragStart } = useDragAndDrop();
const {
  addPodcastModal,
  deletePodcastEpisode,
  downloadPodcastEpisode,
  getPodcastsAndNewestPodcastEpisodes,
  newestPodcastEpisodes,
  podcasts,
} = usePodcast();

/* istanbul ignore next -- @preserve */
const { refresh, status } = useAsyncData(
  ASYNC_DATA_NAMES.podcasts,
  async () => {
    await getPodcastsAndNewestPodcastEpisodes();

    return {
      newestPodcastEpisodes: newestPodcastEpisodes.value,
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

const gridWrapperProps = computed(() =>
  viewLayout.value === 'gridLayout' ? undefined : '0',
);

function playEpisode(episode: PodcastEpisode) {
  playTracks([episode]);
}

useHead({
  title: () => ['Podcasts'].filter(Boolean).join(' - '),
});
</script>

<template>
  <HeaderWithAction>
    <h1>Podcasts</h1>

    <template #actions>
      <RefreshButton :status @refresh="refresh" />

      <ButtonLink
        ref="addPodcastButton"
        :icon="ICONS.add"
        iconSize="large"
        title="Add podcast"
        @click="addPodcastModal"
      >
        Add podcast
      </ButtonLink>
    </template>
  </HeaderWithAction>

  <LoadingData :status>
    <div v-if="podcasts.length" ref="podcastsContent" :class="viewLayout">
      <GridWrapper
        :desktop="gridWrapperProps"
        :mobile="gridWrapperProps"
        :spacing="gridWrapperProps"
        :tablet="gridWrapperProps"
      >
        <PodcastItem
          v-for="podcast in podcasts"
          :key="podcast.id"
          draggable="true"
          :podcast
          @dragstart="dragStart(podcast, $event)"
        />
      </GridWrapper>

      <h3>Latest Podcast Episodes</h3>

      <PodcastEpisodesList
        :podcastEpisodes="newestPodcastEpisodes"
        @addToPlaylist="addToPlaylistModal"
        @addToQueue="addTrackToQueue"
        @deleteEpisode="deletePodcastEpisode"
        @downloadEpisode="downloadPodcastEpisode"
        @downloadMedia="downloadMedia"
        @dragStart="dragStart"
        @episodeInformation="openTrackInformationModal"
        @playEpisode="playEpisode"
      />
    </div>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.podcast"
      message="No podcasts found."
    />
  </LoadingData>
</template>
