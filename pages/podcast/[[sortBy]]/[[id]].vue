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
import PodcastEpisodesList from '@/components/Organisms/TrackLists/PodcastEpisodesList.vue';

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
  getPodcast,
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

function fetchData() {
  fetchMoreData((offset: number) =>
    sliceArrayBySizeAndOffset(
      podcastData.value.podcast?.episodes?.[
        route.params.sortBy as PodcastSortByParam
      ] || [],
      LOAD_SIZE,
      offset,
    ),
  );
}

const {
  data: podcastData,
  refresh,
  status,
} = await useAsyncData(
  `${ASYNC_DATA_NAMES.podcast}-${route.params.id}`,
  async () => {
    const podcast = await getPodcast(route.params.id as string);

    return {
      podcast,
    };
  },
  {
    default: () => ({
      podcast: null,
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
    lazy: true,
  },
);

const hasDownloadedEpisodes = computed(
  () => podcastData.value.podcast!.totalDownloadedEpisodes > 0,
);

function addDownloadedTracksToQueue() {
  addTracksToQueue(podcastData.value.podcast!.episodes.downloaded);
}

async function deleteSelectedPodcast() {
  await deletePodcast(podcastData.value.podcast!.id);
  await navigateTo('/podcasts');
}

function getData() {
  resetToDefaults();
  fetchData();
}

function openPodcastDescriptionModal() {
  openModal(MODAL_TYPE.readMoreModal, {
    text: podcastData.value.podcast!.description,
    title: 'Description',
  });
}

function playAllEpisodes() {
  playTracks(podcastData.value.podcast!.episodes.downloaded, -1);
}

function playEpisode(episode: PodcastEpisode) {
  playTracks([episode]);
}

function playLatestsEpisodes() {
  playEpisode(podcastData.value.podcast!.episodes.downloaded[0]);
}

async function refreshPodcast() {
  await refresh();
  resetToDefaults();
}

getData();

watch(
  () => podcastData.value.podcast,
  () => {
    getData();
  },
);

useHead({
  title: () =>
    [podcastData.value.podcast?.name, route.params.sortBy, 'Podcast']
      .filter(Boolean)
      .join(' - '),
});
</script>

<template>
  <LoadingData :status="status">
    <div v-if="podcastData.podcast">
      <EntryHeader
        :images="[podcastData.podcast.image]"
        :title="podcastData.podcast.name"
      >
        <template #actions>
          <RefreshButton :status="status" @refresh="refreshPodcast" />
        </template>

        <ul class="bulletList">
          <li>
            Episodes:
            <span class="strong">{{ podcastData.podcast.totalEpisodes }}</span>
          </li>
          <li>
            Last updated:
            <span class="strong">{{ podcastData.podcast.lastUpdated }}</span>
          </li>
          <li>
            Downloaded episodes:
            <span class="strong">
              {{ podcastData.podcast.totalDownloadedEpisodes }}
            </span>
          </li>
        </ul>

        <TextClamp
          v-if="podcastData.podcast.description"
          :max-lines="3"
          :text="podcastData.podcast.description"
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

      <PodcastEpisodesList
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
