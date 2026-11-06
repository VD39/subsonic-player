<script setup lang="ts">
import LoadingData from '@/components/notification/LoadingData.vue';
import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import PodcastItem from '@/components/podcast/PodcastItem.vue';
import TracklistPodcast from '@/components/tracklist/TracklistPodcast.vue';
import ButtonLink from '@/components/ui/ButtonLink.vue';
import GridWrapper from '@/components/ui/GridWrapper.vue';
import HeaderWithAction from '@/components/ui/HeaderWithAction.vue';
import RefreshButton from '@/components/ui/RefreshButton.vue';
import SortControls from '@/components/ui/SortControls.vue';

const { viewLayout } = useSettings();
const { downloadTrack } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { deletePodcastEpisodeGlobally, deletePodcastGlobally } =
  usePodcastCleanup();
const { openPodcastDetailsModal, openTrackDetailsModal } =
  useMediaInformation();
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();
const { dragStart } = useDragAndDrop();
const { getMediaTracks } = useMediaTracks();
const {
  addPodcastModal,
  downloadPodcastEpisode,
  getPodcastsAndNewestPodcastEpisodes,
  newestPodcastEpisodes,
  podcasts,
} = usePodcast();

/* istanbul ignore next -- @preserve */
const { refresh, status } = useAsyncData(
  ASYNC_DATA_KEYS.podcasts,
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

const { sortedItems: sortedPodcasts, sortProps } = useLocalSort<Podcast>({
  items: computed(() => podcasts.value || []),
});

const gridWrapperProps = computed(() =>
  viewLayout.value === 'gridLayout' ? undefined : '0',
);

async function onAddPodcastToQueue(podcast: Podcast) {
  const podcastEpisodes = await getMediaTracks(podcast);

  if (podcastEpisodes) {
    addTracksToQueue(podcastEpisodes);
  }
}

async function onPlayPodcast(podcast: Podcast) {
  const podcastEpisodes = await getMediaTracks(podcast);

  if (podcastEpisodes) {
    playTracks(podcastEpisodes);
  }
}

function onPlayPodcastEpisode(podcastEpisode: PodcastEpisode) {
  playTracks([podcastEpisode]);
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
    <div v-if="sortedPodcasts.length" ref="podcastsContent" :class="viewLayout">
      <SortControls v-bind="sortProps" />

      <GridWrapper
        class="mBXL"
        :desktopColumns="gridWrapperProps"
        :mobileColumns="gridWrapperProps"
        :spacing="gridWrapperProps"
        :tabletColumns="gridWrapperProps"
      >
        <PodcastItem
          v-for="podcast in sortedPodcasts"
          :key="podcast.id"
          :podcast
          @addPodcastToQueue="onAddPodcastToQueue"
          @deletePodcast="deletePodcastGlobally"
          @dragStart="dragStart"
          @mediaInformation="openPodcastDetailsModal"
          @playPodcast="onPlayPodcast"
        />
      </GridWrapper>

      <h3>Latest Podcast Episodes</h3>

      <TracklistPodcast
        isRecentList
        :podcastEpisodes="newestPodcastEpisodes"
        @addToPlaylist="addToPlaylistModal"
        @addToQueue="addTrackToQueue"
        @deletePodcastEpisode="deletePodcastEpisodeGlobally"
        @downloadMedia="downloadTrack"
        @downloadPodcastEpisode="downloadPodcastEpisode"
        @dragStart="dragStart"
        @playPodcastEpisode="onPlayPodcastEpisode"
        @podcastEpisodeInformation="openTrackDetailsModal"
      />
    </div>

    <NoMediaMessage
      v-else
      :icon="FALLBACK_ICON_BY_TYPE.podcast"
      message="No podcasts found."
    />
  </LoadingData>
</template>
