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
const { openPodcastInformationModal, openTrackInformationModal } =
  useMediaInformation();
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();
const { dragStart } = useDragAndDrop();
const { getMediaTracks } = useMediaTracks();
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
    getCachedData: (key, nuxtApp, ctx) => {
      if (ctx.cause === 'refresh:manual') {
        return undefined;
      }

      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  },
);

const gridWrapperProps = computed(() =>
  viewLayout.value === 'gridLayout' ? undefined : '0',
);

async function onAddPodcastToQueue(podcast: Podcast) {
  const podcastEpisodes = await getMediaTracks(podcast);

  if (podcastEpisodes) {
    await addTracksToQueue(podcastEpisodes);
  }
}

function onPlayEpisode(episode: PodcastEpisode) {
  playTracks([episode]);
}

async function onPlayPodcast(podcast: Podcast) {
  const podcastEpisodes = await getMediaTracks(podcast);

  if (podcastEpisodes) {
    await playTracks(podcastEpisodes);
  }
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
        class="mBXL"
        :desktop="gridWrapperProps"
        :mobile="gridWrapperProps"
        :spacing="gridWrapperProps"
        :tablet="gridWrapperProps"
      >
        <PodcastItem
          v-for="podcast in podcasts"
          :key="podcast.id"
          :podcast
          @addPodcastToQueue="onAddPodcastToQueue"
          @dragStart="dragStart"
          @mediaInformation="openPodcastInformationModal"
          @playPodcast="onPlayPodcast"
        />
      </GridWrapper>

      <h3>Latest Podcast Episodes</h3>

      <PodcastEpisodesList
        isRecentList
        :podcastEpisodes="newestPodcastEpisodes"
        @addToPlaylist="addToPlaylistModal"
        @addToQueue="addTrackToQueue"
        @deleteEpisode="deletePodcastEpisode"
        @downloadEpisode="downloadPodcastEpisode"
        @downloadMedia="downloadMedia"
        @dragStart="dragStart"
        @episodeInformation="openTrackInformationModal"
        @playEpisode="onPlayEpisode"
      />
    </div>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.podcast"
      message="No podcasts found."
    />
  </LoadingData>
</template>
