<script setup lang="ts">
import DropdownDivider from '@/components/dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import PageNavigation from '@/components/navigation/PageNavigation.vue';
import LoadingData from '@/components/notification/LoadingData.vue';
import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import TracklistPodcast from '@/components/tracklist/TracklistPodcast.vue';
import ButtonLink from '@/components/ui/ButtonLink.vue';
import EntryHeader from '@/components/ui/EntryHeader.vue';
import RefreshButton from '@/components/ui/RefreshButton.vue';
import TextClamp from '@/components/ui/TextClamp.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.podcast],
});

const route = useRoute();
const { openModal } = useModal();
const { downloadTrack } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { deletePodcastEpisodeGlobally, deletePodcastGlobally } =
  usePodcastCleanup();
const { openTrackDetailsModal } = useMediaInformation();
const { dragStart } = useDragAndDrop();
const {
  downloadPodcastEpisode,
  getPodcast,
  podcast: podcastState,
} = usePodcast();
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();

/* istanbul ignore next -- @preserve */
const { refresh, status } = useAsyncData(
  `${ASYNC_DATA_KEYS.podcast}-${route.params[ROUTE_PARAM_KEYS.podcast.id]}`,
  async () => {
    const podcastId = route.params[ROUTE_PARAM_KEYS.podcast.id] as string;
    await getPodcast(podcastId);

    return {
      podcast: podcastState.value,
    };
  },
  {
    default: () => ({
      podcast: null,
    }),
    getCachedData: (key, nuxtApp, ctx) => {
      if (ctx.cause === 'refresh:manual') {
        return undefined;
      }

      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  },
);

const podcast = computed(
  () =>
    podcastState.value?.[route.params[ROUTE_PARAM_KEYS.podcast.id] as string],
);

const hasDownloadedPodcastEpisodes = computed(
  () => Number(podcast.value?.totalDownloadedEpisodes) > 0,
);

function addDownloadedTracksToQueue() {
  addTracksToQueue(podcast.value!.episodes.downloaded);
}

async function deleteSelectedPodcast() {
  await deletePodcastGlobally(podcast.value!.id);
  await navigateTo({
    name: ROUTE_NAMES.podcasts,
  });
}

function onDragStart(event: DragEvent) {
  dragStart(podcast.value!, event);
}

function onPlayPodcastEpisode(podcastEpisode: PodcastEpisode) {
  playTracks([podcastEpisode]);
}

function openPodcastDescriptionModal() {
  openModal(MODAL_TYPE.readMoreModal, {
    text: podcast.value!.description,
    title: 'Description',
  });
}

function playDownloadedPodcastEpisodes() {
  playTracks(podcast.value!.episodes.downloaded);
}

function playFirstDownloadedPodcastEpisode() {
  onPlayPodcastEpisode(podcast.value!.episodes.downloaded[0]);
}

const podcastEpisodes = computed(
  () =>
    podcast.value?.episodes?.[
      route.params[ROUTE_PARAM_KEYS.podcast.sortBy] as PodcastSortByParam
    ] as PodcastEpisode[],
);

useHead({
  title: () =>
    [
      podcast.value?.name,
      route.params[ROUTE_PARAM_KEYS.podcast.sortBy],
      'Podcast',
    ]
      .filter(Boolean)
      .join(' - '),
});
</script>

<template>
  <LoadingData :status>
    <div v-if="podcast" ref="podcastContent">
      <EntryHeader
        :images="[podcast.image]"
        :title="podcast.name"
        @dragStart="onDragStart"
      >
        <template #actions>
          <RefreshButton :status @refresh="refresh" />
        </template>

        <ul class="bulletList">
          <li>
            Podcast episodes:
            <span class="strong">{{ podcast.totalEpisodes }}</span>
          </li>
          <li>
            Last updated:
            <span class="strong">{{ podcast.lastUpdated }}</span>
          </li>
          <li>
            Downloaded podcast episodes:
            <span class="strong">
              {{ podcast.totalDownloadedEpisodes }}
            </span>
          </li>
        </ul>

        <TextClamp
          v-if="podcast.description"
          :maxLines="3"
          :text="podcast.description"
          @expand="openPodcastDescriptionModal"
        />

        <div class="list">
          <ButtonLink
            :id="HOTKEY_ELEMENT_IDS.playAllButton"
            ref="playAllPodcastEpisodesButton"
            class="largeThemeHoverButton"
            :disabled="!hasDownloadedPodcastEpisodes"
            :icon="ICONS.play"
            title="Play podcast episodes"
            @click="playDownloadedPodcastEpisodes"
          >
            Play podcast episodes
          </ButtonLink>

          <DropdownMenu>
            <template v-if="hasDownloadedPodcastEpisodes">
              <DropdownItem
                ref="playLatestPodcastEpisodeDropdownItem"
                @click="playFirstDownloadedPodcastEpisode"
              >
                Play latest podcast episode
              </DropdownItem>
              <DropdownItem
                ref="playAllPodcastEpisodesDropdownItem"
                @click="playDownloadedPodcastEpisodes"
              >
                Play all podcast episodes
              </DropdownItem>
              <DropdownItem
                ref="addDownloadedPodcastEpisodesToQueueDropdownItem"
                @click="addDownloadedTracksToQueue"
              >
                Add podcast episodes to queue
              </DropdownItem>
              <DropdownDivider />
            </template>
            <DropdownItem
              ref="deletePodcastDropdownItem"
              @click="deleteSelectedPodcast"
            >
              Delete podcast
            </DropdownItem>
          </DropdownMenu>
        </div>
      </EntryHeader>

      <PageNavigation :navigation="PODCAST_NAVIGATION" />

      <TracklistPodcast
        :podcastEpisodes
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
      message="No podcast found."
    />
  </LoadingData>
</template>
