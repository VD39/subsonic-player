<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import TextClamp from '@/components/Atoms/TextClamp.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import InfiniteScroller from '@/components/Molecules/InfiniteScroller.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import EntryHeader from '@/components/Organisms/EntryHeader.vue';
import PodcastList from '@/components/Organisms/PodcastList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.podcast],
});

const route = useRoute();
const { openModal } = useModal();
const { downloadMedia } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openTrackInformationModal } = useMediaInformation();
const {
  deletePodcast,
  deletePodcastEpisode,
  downloadPodcastEpisode,
  getNewestPodcasts,
  getPodcasts,
} = usePodcast();
const {
  fetchMoreData,
  hasMore,
  items: podcastEpisodes,
  LOAD_SIZE,
  resetToDefaults,
} = useInfinityLoading<PodcastEpisode>(
  `${route.params.id}-${route.params.sortBy}`,
);
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();

const {
  data: podcastsData,
  refresh,
  status,
} = await useAsyncData(
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

const podcastById = computed(() => {
  const podcast = podcastsData.value?.podcasts?.find(
    (podcast) => podcast.id === route.params.id,
  );

  return podcast || null;
});

const sortedPodcast = computed(() =>
  sortPodcastEpisodes(
    podcastById.value?.episodes || [],
    route.params.sortBy as PodcastSortByParam,
  ),
);

const downloadedEpisodes = computed(() =>
  sortPodcastEpisodes(
    sortedPodcast.value,
    ROUTE_PODCAST_SORT_BY_PARAMS.Downloaded,
  ),
);

const hasDownloadedEpisodes = computed(() => !!downloadedEpisodes.value.length);

function fetchData() {
  fetchMoreData((offset: number) =>
    sliceArrayBySizeAndOffset(sortedPodcast.value, LOAD_SIZE, offset),
  );
}

fetchData();

function addDownloadedTracksToQueue() {
  addTracksToQueue(downloadedEpisodes.value);
}

async function deleteSelectedPodcast() {
  await deletePodcast(podcastById.value!.id);
  await navigateTo('/podcasts');
  await refresh();
}

function openPodcastDescriptionModal() {
  openModal(MODAL_TYPE.readMoreModal, {
    text: podcastById.value!.description,
    title: 'Description',
  });
}

function playAllEpisodes() {
  playTracks(downloadedEpisodes.value, -1);
}

function playEpisode(episode: PodcastEpisode) {
  playTracks([episode]);
}

function playLatestsEpisodes() {
  playEpisode(downloadedEpisodes.value[0]);
}

async function refreshPodcast() {
  resetToDefaults();
  await refresh();
  fetchData();
}

onBeforeUnmount(() => {
  resetToDefaults();
});

useHead({
  title: () =>
    [podcastById.value?.name, route.params.sortBy, 'Podcast']
      .filter(Boolean)
      .join(' - '),
});
</script>

<template>
  <LoadingData :status="status">
    <div v-if="podcastById">
      <EntryHeader :images="[podcastById.image]" :title="podcastById.name">
        <template #actions>
          <RefreshButton :status="status" @refresh="refreshPodcast" />
        </template>

        <ul class="bulletList">
          <li>
            Episodes:
            <span class="strong">{{ podcastById.totalEpisodes }}</span>
          </li>
          <li>
            Last updated:
            <span class="strong">{{ podcastById.lastUpdated }}</span>
          </li>
          <li>
            Downloaded episodes:
            <span class="strong">
              {{ podcastById.totalDownloadedEpisodes }}
            </span>
          </li>
        </ul>

        <TextClamp
          v-if="podcastById.description"
          :max-lines="3"
          :text="podcastById.description"
          @more="openPodcastDescriptionModal"
        />

        <div class="list">
          <ButtonLink
            class="largeThemeHoverButton"
            :disabled="!hasDownloadedEpisodes"
            :icon="ICONS.play"
            title="Play podcast episodes"
            @click="playAllEpisodes"
          >
            Play podcast episodes
          </ButtonLink>

          <DropdownMenu>
            <DropdownItem @click="deleteSelectedPodcast">
              Delete podcast
            </DropdownItem>
            <template v-if="hasDownloadedEpisodes">
              <DropdownDivider />
              <DropdownItem @click="addDownloadedTracksToQueue">
                Add episodes to queue
              </DropdownItem>
              <DropdownItem @click="playLatestsEpisodes">
                Play latests episode
              </DropdownItem>
              <DropdownItem @click="playAllEpisodes">
                Play all episodes
              </DropdownItem>
            </template>
          </DropdownMenu>
        </div>
      </EntryHeader>

      <PageNavigation :navigation="PODCAST_NAVIGATION" />

      <PodcastList
        :podcast-episodes="podcastEpisodes"
        @add-to-playlist="addToPlaylistModal"
        @add-to-queue="addTrackToQueue"
        @delete-episode="deletePodcastEpisode"
        @download-episode="downloadPodcastEpisode"
        @download-media="downloadMedia"
        @episode-information="openTrackInformationModal"
        @play-episode="playEpisode"
      />

      <InfiniteScroller
        :has-more="hasMore"
        :loading="false"
        @load-more="fetchData"
      />
    </div>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.podcast"
      message="No podcast found."
    />
  </LoadingData>
</template>
